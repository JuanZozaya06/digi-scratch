import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Participant, PrizeResult } from '../models/promotion.models';

type FlowStep = 'landing' | 'form' | 'scratch' | 'instructions';

interface PersistedPromotionState {
  participant: Participant | null;
  result: PrizeResult | null;
  scratchComplete: boolean;
  step: FlowStep;
}

interface PromotionEvent {
  id: string;
  name: string;
  location: string;
  schedule: string;
  badge: string;
}

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit, OnDestroy {
  private readonly mockResults: PrizeResult[] = [
    { id: 'try-again', label: 'Sigue intentando', isWinner: false },
    { id: 'thanks', label: 'Gracias por participar', isWinner: false },
    { id: 'sticker', label: 'Ganaste una calcomania', isWinner: true, prizeName: 'una calcomania' },
    { id: 'bracelet', label: 'Ganaste una pulsera', isWinner: true, prizeName: 'una pulsera' },
    { id: 'stickers-pack', label: 'Ganaste 1 sobre de barajitas', isWinner: true, prizeName: '1 sobre de barajitas' },
    { id: 'ball', label: 'Ganaste un balon del Mundial', isWinner: true, prizeName: 'un balon del Mundial' }
  ];

  private readonly eventCatalog: Record<string, PromotionEvent> = {
    'digitel-caracas': {
      id: 'digitel-caracas',
      name: 'Digitel Fan Zone Caracas',
      location: 'CCCT, Nivel C2',
      schedule: 'Disponible hoy de 10:00 AM a 8:00 PM',
      badge: 'Evento activo'
    },
    'digitel-valencia': {
      id: 'digitel-valencia',
      name: 'Digitel Fan Zone Valencia',
      location: 'Sambil Valencia',
      schedule: 'Disponible hoy de 11:00 AM a 9:00 PM',
      badge: 'Evento activo'
    }
  };

  currentStep: FlowStep = 'landing';
  participant: Participant | null = null;
  result: PrizeResult | null = null;
  scratchComplete = false;
  eventId = '';
  eventName = '';
  eventBadge = '';
  eventLocation = '';
  eventSchedule = '';

  private routeSubscription?: Subscription;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id') || 'digitel-caracas';
      this.applyEventMetadata();
      this.restoreState();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  startPromotion(): void {
    this.setCurrentStep('form');
  }

  handleParticipantSubmitted(participant: Participant): void {
    this.participant = participant;
    this.result = this.pickRandomResult();
    this.scratchComplete = false;
    this.setCurrentStep('scratch');
  }

  revealScratchResult(): void {
    this.scratchComplete = true;
    this.persistState();
  }

  openInstructions(): void {
    this.setCurrentStep('instructions');
  }

  restartContest(): void {
    this.participant = null;
    this.result = null;
    this.scratchComplete = false;
    this.currentStep = 'landing';
    localStorage.removeItem(this.storageKey);
    this.scrollToTop();
  }

  private get storageKey(): string {
    return `digi-scratch-promotion-state-${this.eventId}`;
  }

  private applyEventMetadata(): void {
    const event = this.eventCatalog[this.eventId];

    if (event) {
      this.eventName = event.name;
      this.eventBadge = event.badge;
      this.eventLocation = event.location;
      this.eventSchedule = event.schedule;
      return;
    }

    const readableId = this.eventId
      .split('-')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');

    this.eventName = `Evento ${readableId || 'Digitel'}`;
    this.eventBadge = 'Codigo activo';
    this.eventLocation = `Evento identificado como ${this.eventId}`;
    this.eventSchedule = 'Disponible mientras la promocion este habilitada.';
  }

  private restoreState(): void {
    const savedState = this.readState();

    this.participant = savedState?.participant ?? null;
    this.result = savedState?.result ?? null;
    this.scratchComplete = !!savedState?.scratchComplete;
    this.currentStep = 'landing';

    if (!savedState) {
      this.scrollToTop();
      return;
    }

    if (this.participant && !this.result) {
      this.result = this.pickRandomResult();
      this.persistState();
    }

    if (savedState.step === 'instructions' && savedState.result) {
      this.setCurrentStep('instructions', false);
      return;
    }

    if (savedState.participant) {
      this.setCurrentStep('scratch', false);
      return;
    }

    this.scrollToTop();
  }

  private setCurrentStep(step: FlowStep, shouldPersist = true): void {
    this.currentStep = step;

    if (shouldPersist) {
      this.persistState();
    }

    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  private pickRandomResult(): PrizeResult {
    const randomIndex = Math.floor(Math.random() * this.mockResults.length);
    return this.mockResults[randomIndex];
  }

  private persistState(): void {
    const state: PersistedPromotionState = {
      participant: this.participant,
      result: this.result,
      scratchComplete: this.scratchComplete,
      step: this.currentStep
    };

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private readState(): PersistedPromotionState | null {
    const rawState = localStorage.getItem(this.storageKey);

    if (!rawState) {
      return null;
    }

    try {
      return JSON.parse(rawState) as PersistedPromotionState;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
