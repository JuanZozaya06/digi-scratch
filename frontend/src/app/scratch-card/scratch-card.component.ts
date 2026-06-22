import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
export class ScratchCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('scratchCanvas') scratchCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() participant: Participant | null = null;
  @Input() result: PrizeResult | null = null;
  @Input() scratchComplete = false;
  @Input() showInstructions = false;

  @Output() scratched = new EventEmitter<void>();
  @Output() instructionsRequested = new EventEmitter<void>();

  scratchLayerVisible = true;
  scratchLayerFading = false;

  private canvasContext: CanvasRenderingContext2D | null = null;
  private isScratching = false;
  private hasEmittedCompletion = false;
  private completionPending = false;
  private fadeTimer: number | null = null;
  private readonly revealThreshold = 0.5;

  ngAfterViewInit(): void {
    this.prepareScratchLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scratchComplete']) {
      this.syncScratchLayerVisibility();
    }

    if (changes['result'] || changes['showInstructions']) {
      window.setTimeout(() => this.prepareScratchLayer());
    }
  }

  ngOnDestroy(): void {
    if (this.fadeTimer) {
      window.clearTimeout(this.fadeTimer);
    }
  }

  startScratch(event: PointerEvent): void {
    if (this.scratchComplete || this.showInstructions || !this.result) {
      return;
    }

    this.isScratching = true;
    this.scratchCanvas?.nativeElement.setPointerCapture(event.pointerId);
    this.eraseAt(event);
  }

  moveScratch(event: PointerEvent): void {
    if (!this.isScratching || this.scratchComplete || this.showInstructions) {
      return;
    }

    this.eraseAt(event);
  }

  stopScratch(event: PointerEvent): void {
    if (!this.isScratching) {
      return;
    }

    const canvas = this.scratchCanvas?.nativeElement;
    this.isScratching = false;

    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    if (this.completionPending) {
      this.completeScratch();
    }
  }

  requestInstructions(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.instructionsRequested.emit();
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

    const foilGradient = this.canvasContext.createLinearGradient(0, 0, rect.width, rect.height);
    foilGradient.addColorStop(0, '#dbe3ea');
    foilGradient.addColorStop(0.42, '#b9c6d0');
    foilGradient.addColorStop(1, '#edf2f6');
    this.canvasContext.fillStyle = foilGradient;
    this.canvasContext.fillRect(0, 0, rect.width, rect.height);

    this.canvasContext.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    this.canvasContext.lineWidth = 2;

    for (let offset = -rect.height; offset < rect.width; offset += 18) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(offset, 0);
      this.canvasContext.lineTo(offset + rect.height, rect.height);
      this.canvasContext.stroke();
    }

    this.canvasContext.fillStyle = '#22303d';
    this.canvasContext.font = '800 22px Fraunces, Georgia, serif';
    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.fillText('Raspa aquí', rect.width / 2, rect.height / 2);
    this.canvasContext.font = '800 12px "Nunito Sans", "Trebuchet MS", sans-serif';
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
    this.canvasContext.arc(x, y, 26, 0, Math.PI * 2);
    this.canvasContext.fill();
    this.checkRevealProgress();
  }

  private checkRevealProgress(): void {
    const canvas = this.scratchCanvas?.nativeElement;

    if (!canvas || !this.canvasContext || this.hasEmittedCompletion || this.completionPending) {
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
      this.completionPending = true;

      if (!this.isScratching) {
        this.completeScratch();
      }
    }
  }

  private completeScratch(): void {
    if (this.hasEmittedCompletion) {
      return;
    }

    this.hasEmittedCompletion = true;
    this.completionPending = false;
    this.scratchLayerFading = true;
    this.scratched.emit();
  }

  private syncScratchLayerVisibility(): void {
    if (!this.scratchComplete) {
      this.scratchLayerVisible = true;
      this.scratchLayerFading = false;
      this.hasEmittedCompletion = false;
      this.completionPending = false;
      return;
    }

    this.scratchLayerFading = true;

    if (this.fadeTimer) {
      window.clearTimeout(this.fadeTimer);
    }

    this.fadeTimer = window.setTimeout(() => {
      this.scratchLayerVisible = false;
    }, 420);
  }
}
