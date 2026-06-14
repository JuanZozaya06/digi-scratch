import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant, PrizeResult } from '../models/demo.models';

@Component({
  selector: 'app-participant-summary',
  templateUrl: './participant-summary.component.html',
  styleUrls: ['./participant-summary.component.scss']
})
export class ParticipantSummaryComponent {
  @Input({ required: true }) participant!: Participant;
  @Input({ required: true }) result!: PrizeResult;
  @Output() restart = new EventEmitter<void>();
}
