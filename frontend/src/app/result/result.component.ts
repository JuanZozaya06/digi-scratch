import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrizeResult } from '../models/demo.models';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  @Input({ required: true }) result!: PrizeResult;

  @Output() viewSummary = new EventEmitter<void>();
  @Output() finish = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();
}
