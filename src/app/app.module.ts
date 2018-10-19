import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgConnectModule } from './ng-connect/ng-connect.module';
import { NgConnectService } from './ng-connect/ng-connect.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgConnectModule,
  ],
  providers: [
    NgConnectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
