import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppComponent } from './app.component';
import { CityUtilComponent } from './city-util/city-util.component';
import { RgChartComponent } from './city-util/rg-chart/rg-chart.component';
import { EndgameCorpStatsComponent } from './endgame-corp-stats/endgame-corp-stats.component';
import { HomeComponent } from './home/home.component';
import { PlayerRanksComponent } from './player-ranks/player-ranks.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { TrainStationStatsComponent } from './train-station-stats/train-station-stats.component';


const appRoutes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'city-util', component: CityUtilComponent },
  { path: 'endgame-corp-stats', component: EndgameCorpStatsComponent },
  { path: 'player-ranks', component: PlayerRanksComponent },
  { path: 'train-station-stats', component: TrainStationStatsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    CityUtilComponent,
    EndgameCorpStatsComponent,
    HomeComponent,
    ConfirmationModalComponent,
    RgChartComponent,
    PlayerRanksComponent,
    TrainStationStatsComponent,
  ],
  imports: [
    AuthModule.forRoot({
      domain: 'joallard.auth0.com',
      clientId: 'YVEiFzpvvn67oh933D0bNNydND2uRHWY',
      cacheLocation: 'localstorage'
    }),
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgApexchartsModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
