import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LandingIntroComponent } from './landing-intro/landing-intro.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { ScratchCardComponent } from './scratch-card/scratch-card.component';
import { ResultComponent } from './result/result.component';
import { ParticipantSummaryComponent } from './participant-summary/participant-summary.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LandingIntroComponent,
        ParticipantFormComponent,
        ScratchCardComponent,
        ResultComponent,
        ParticipantSummaryComponent
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should start on the landing step', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.currentStep).toBe('landing');
  });
});
