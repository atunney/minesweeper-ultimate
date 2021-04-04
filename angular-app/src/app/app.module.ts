import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { SettingsComponent } from './settings/settings.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    SettingsComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GridComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
