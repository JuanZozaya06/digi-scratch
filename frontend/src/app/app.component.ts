import { Component, OnInit } from '@angular/core';
import { Participant, PrizeResult } from './models/demo.models';

type FlowStep = 'landing' | 'form' | 'scratch' | 'result' | 'summary';

interface PersistedDemoState {
  participant: Participant | null;
  result: PrizeResult | null;
  step: FlowStep;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly storageKey = 'digi-scratch-demo-state';
  private readonly mockResults: PrizeResult[] = [
    { id: 'try-again', label: 'Sigue intentando', isWinner: false },
    { id: 'thanks', label: 'Gracias por participar', isWinner: false },
    {
      id: 'sticker',
      label: 'Ganaste una calcomania',
      isWinner: true,
      prizeName: 'una calcomania'
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
      label: 'Ganaste un balon del Mundial',
      isWinner: true,
      prizeName: 'un balon del Mundial'
    }
  ];

  currentStep: FlowStep = 'landing';
  participant: Participant | null = null;
  result: PrizeResult | null = null;

  ngOnInit(): void {
    const savedState = this.readState();

    if (!savedState) {
      return;
    }

    this.participant = savedState.participant;
    this.result = savedState.result;

    if (savedState.result) {
      this.currentStep = savedState.step === 'summary' ? 'summary' : 'result';
      return;
    }

    if (savedState.participant) {
      this.currentStep = 'scratch';
    }
  }

  startDemo(): void {
    this.currentStep = 'form';
    this.persistState();
  }

  handleParticipantSubmitted(participant: Participant): void {
    this.participant = participant;
    this.result = null;
    this.currentStep = 'scratch';
    this.persistState();
  }

  revealScratchResult(): void {
    this.result = this.pickRandomResult();
    this.currentStep = 'result';
    this.persistState();
  }

  openSummary(): void {
    this.currentStep = 'summary';
    this.persistState();
  }

  finishDemo(): void {
    this.currentStep = 'summary';
    this.persistState();
  }

  restartDemo(): void {
    this.participant = null;
    this.result = null;
    this.currentStep = 'landing';
    localStorage.removeItem(this.storageKey);
  }

  private pickRandomResult(): PrizeResult {
    const randomIndex = Math.floor(Math.random() * this.mockResults.length);
    return this.mockResults[randomIndex];
  }

  private persistState(): void {
    const state: PersistedDemoState = {
      participant: this.participant,
      result: this.result,
      step: this.currentStep
    };

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private readState(): PersistedDemoState | null {
    const rawState = localStorage.getItem(this.storageKey);

    if (!rawState) {
      return null;
    }

    try {
      return JSON.parse(rawState) as PersistedDemoState;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
