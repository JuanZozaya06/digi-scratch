import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { EventPageComponent } from './event-page/event-page.component';
import { InternalLoginComponent } from './internal-login/internal-login.component';
import { LandingIntroComponent } from './landing-intro/landing-intro.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { ScratchCardComponent } from './scratch-card/scratch-card.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        EventPageComponent,
        InternalLoginComponent,
        LandingIntroComponent,
        ParticipantFormComponent,
        ScratchCardComponent
      ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
