import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { AnswerButtonComponent } from './answer-button/answer-button.component';





@NgModule({
  declarations: [
    AppComponent,
    GamescreenComponent,
    AnswerButtonComponent

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
