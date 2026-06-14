import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-landing-intro',
  templateUrl: './landing-intro.component.html',
  styleUrls: ['./landing-intro.component.scss']
})
export class LandingIntroComponent {
  @Output() start = new EventEmitter<void>();
}
