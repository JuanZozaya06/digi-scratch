import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventPageComponent } from './event-page/event-page.component';
import { InternalLoginComponent } from './internal-login/internal-login.component';
import { LandingIntroComponent } from './landing-intro/landing-intro.component';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { ScratchCardComponent } from './scratch-card/scratch-card.component';

@NgModule({
  declarations: [
    AppComponent,
    EventPageComponent,
    InternalLoginComponent,
    LandingIntroComponent,
    ParticipantFormComponent,
    ScratchCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
