import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Participant, PrizeResult } from '../models/promotion.models';

@Component({
  selector: 'app-scratch-card',
  templateUrl: './scratch-card.component.html',
  styleUrls: ['./scratch-card.component.scss']
})
export class ScratchCardComponent implements AfterViewInit, OnChanges {
  @ViewChild('scratchCanvas') scratchCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() participant: Participant | null = null;
  @Input() result: PrizeResult | null = null;
  @Input() scratchComplete = false;
  @Input() showInstructions = false;

  @Output() scratched = new EventEmitter<void>();
  @Output() instructionsRequested = new EventEmitter<void>();

  private canvasContext: CanvasRenderingContext2D | null = null;
  private isScratching = false;
  private hasEmittedCompletion = false;
  private readonly revealThreshold = 0.75;

  ngAfterViewInit(): void {
    this.prepareScratchLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] || changes['scratchComplete'] || changes['showInstructions']) {
      window.setTimeout(() => this.prepareScratchLayer());
    }
  }

  startScratch(event: PointerEvent): void {
    if (this.scratchComplete || this.showInstructions || !this.result) {
      return;
    }

    this.isScratching = true;
    this.eraseAt(event);
  }

  moveScratch(event: PointerEvent): void {
    if (!this.isScratching || this.scratchComplete || this.showInstructions) {
      return;
    }

    this.eraseAt(event);
  }

  stopScratch(): void {
    this.isScratching = false;
  }

  private prepareScratchLayer(): void {
    const canvas = this.scratchCanvas?.nativeElement;

    if (!canvas || !this.result || this.scratchComplete || this.showInstructions) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(Math.floor(rect.width * scale), 1);
    canvas.height = Math.max(Math.floor(rect.height * scale), 1);

    this.canvasContext = canvas.getContext('2d');

    if (!this.canvasContext) {
      return;
    }

    this.canvasContext.setTransform(scale, 0, 0, scale, 0, 0);
    this.canvasContext.globalCompositeOperation = 'source-over';
    this.canvasContext.fillStyle = '#c7d0da';
    this.canvasContext.fillRect(0, 0, rect.width, rect.height);
    this.canvasContext.fillStyle = '#22303d';
    this.canvasContext.font = '700 22px Arial, Helvetica, sans-serif';
    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.fillText('Raspa aquí', rect.width / 2, rect.height / 2);
    this.canvasContext.font = '600 13px Arial, Helvetica, sans-serif';
    this.canvasContext.fillStyle = '#52606d';
    this.canvasContext.fillText('Desliza con tu dedo', rect.width / 2, rect.height / 2 + 30);
  }

  private eraseAt(event: PointerEvent): void {
    const canvas = this.scratchCanvas?.nativeElement;

    if (!canvas || !this.canvasContext) {
      return;
    }

    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.canvasContext.globalCompositeOperation = 'destination-out';
    this.canvasContext.beginPath();
    this.canvasContext.arc(x, y, 24, 0, Math.PI * 2);
    this.canvasContext.fill();
    this.checkRevealProgress();
  }

  private checkRevealProgress(): void {
    const canvas = this.scratchCanvas?.nativeElement;

    if (!canvas || !this.canvasContext || this.hasEmittedCompletion) {
      return;
    }

    const imageData = this.canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    const totalPixels = imageData.data.length / 4;

    for (let index = 3; index < imageData.data.length; index += 4) {
      if (imageData.data[index] === 0) {
        transparentPixels += 1;
      }
    }

    if (transparentPixels / totalPixels >= this.revealThreshold) {
      this.hasEmittedCompletion = true;
      this.scratched.emit();
    }
  }
}
