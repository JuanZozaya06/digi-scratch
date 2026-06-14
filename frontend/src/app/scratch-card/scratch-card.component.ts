import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant, PrizeResult } from '../models/promotion.models';

@Component({
  selector: 'app-scratch-card',
  templateUrl: './scratch-card.component.html',
  styleUrls: ['./scratch-card.component.scss']
})
export class ScratchCardComponent {
  @Input() participant: Participant | null = null;
  @Input() result: PrizeResult | null = null;
  @Output() scratched = new EventEmitter<void>();
}
