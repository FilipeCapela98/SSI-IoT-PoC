import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChargingStationComponent } from './components/charging-station/charging-station.component';
import { RdwComponent } from './components/rdw/rdw.component';
import { EmspComponent } from './components/emsp/emsp.component';
import { AgentApisComponent } from './components/agent-apis/agent-apis.component';

const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'emsp', component: EmspComponent},
  { path: 'charging-station', component: ChargingStationComponent},
  { path: 'rdw', component: RdwComponent},
  { path: 'agent-apis', component: AgentApisComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [EmspComponent, HomepageComponent, ChargingStationComponent, RdwComponent, AgentApisComponent];
