import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant } from '../models/demo.models';

@Component({
  selector: 'app-scratch-card',
  templateUrl: './scratch-card.component.html',
  styleUrls: ['./scratch-card.component.scss']
})
export class ScratchCardComponent {
  @Input() participant: Participant | null = null;
  @Output() scratched = new EventEmitter<void>();
}
