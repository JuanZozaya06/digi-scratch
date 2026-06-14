import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LandingIntroComponent } from './landing-intro/landing-intro.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { ScratchCardComponent } from './scratch-card/scratch-card.component';
import { ResultComponent } from './result/result.component';
import { ParticipantSummaryComponent } from './participant-summary/participant-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingIntroComponent,
    ParticipantFormComponent,
    ScratchCardComponent,
    ResultComponent,
    ParticipantSummaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
