import { Component, OnInit } from '@angular/core';
import { Participant, PrizeResult } from './models/promotion.models';

type FlowStep = 'landing' | 'form' | 'scratch' | 'instructions';

interface PersistedPromotionState {
  participant: Participant | null;
  result: PrizeResult | null;
  scratchComplete: boolean;
  step: FlowStep;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly storageKey = 'digi-scratch-promotion-state';
  private readonly mockResults: PrizeResult[] = [
    { id: 'try-again', label: 'Sigue intentando', isWinner: false },
    { id: 'thanks', label: 'Gracias por participar', isWinner: false },
    {
      id: 'sticker',
      label: 'Ganaste una calcomanía',
      isWinner: true,
      prizeName: 'una calcomanía'
    },
    {
      id: 'bracelet',
      label: 'Ganaste una pulsera',
      isWinner: true,
      prizeName: 'una pulsera'
    },
    {
      id: 'stickers-pack',
      label: 'Ganaste 1 sobre de barajitas',
      isWinner: true,
      prizeName: '1 sobre de barajitas'
    },
    {
      id: 'ball',
      label: 'Ganaste un balón del Mundial',
      isWinner: true,
      prizeName: 'un balón del Mundial'
    }
  ];

  currentStep: FlowStep = 'landing';
  participant: Participant | null = null;
  result: PrizeResult | null = null;
  scratchComplete = false;

  ngOnInit(): void {
    const savedState = this.readState();

    if (!savedState) {
      return;
    }

    this.participant = savedState.participant;
    this.result = savedState.result;
    this.scratchComplete = !!savedState.scratchComplete;

    if (this.participant && !this.result) {
      this.result = this.pickRandomResult();
      this.persistState();
    }

    if (savedState.step === 'instructions' && savedState.result) {
      this.currentStep = 'instructions';
      return;
    }

    if (savedState.participant) {
      this.currentStep = 'scratch';
    }
  }

  startPromotion(): void {
    this.currentStep = 'form';
    this.persistState();
  }

  handleParticipantSubmitted(participant: Participant): void {
    this.participant = participant;
    this.result = this.pickRandomResult();
    this.scratchComplete = false;
    this.currentStep = 'scratch';
    this.persistState();
  }

  revealScratchResult(): void {
    this.scratchComplete = true;
    this.persistState();
  }

  openInstructions(): void {
    this.currentStep = 'instructions';
    this.persistState();
  }

  restartContest(): void {
    this.participant = null;
    this.result = null;
    this.scratchComplete = false;
    this.currentStep = 'landing';
    localStorage.removeItem(this.storageKey);
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
