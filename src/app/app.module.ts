import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PackageTrackerComponent } from './components/package-tracker/package-tracker.component';
import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    PackageTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ApiService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
