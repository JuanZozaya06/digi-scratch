import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { InternalLoginComponent } from './internal-login/internal-login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'event/digitel-caracas' },
  {
    path: 'admin',
    component: InternalLoginComponent,
    data: { mode: 'admin' }
  },
  {
    path: 'stand',
    component: InternalLoginComponent,
    data: { mode: 'stand' }
  },
  {
    path: 'event/:id',
    component: EventPageComponent
  },
  { path: '**', redirectTo: 'event/digitel-caracas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
