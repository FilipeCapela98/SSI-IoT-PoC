import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RdwComponent } from './components/rdw/rdw.component';
import { ChargingStationComponent } from './components/charging-station/charging-station.component';
import { EmspComponent } from './components/emsp/emsp.component';
import { AgentApisComponent } from './components/agent-apis/agent-apis.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HomepageComponent,
    ToolbarComponent,
    EmspComponent,
    RdwComponent,
    ChargingStationComponent,
    AgentApisComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatIconModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
