import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { CityUtilComponent } from './city-util/city-util.component';
import { RgChartComponent } from './city-util/rg-chart/rg-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PlayerRanksComponent } from './player-ranks/player-ranks.component';


const appRoutes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'city-util', component: CityUtilComponent },
  { path: 'player-ranks', component: PlayerRanksComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    CityUtilComponent,
    HomeComponent,
    ConfirmationModalComponent,
    RgChartComponent,
    PlayerRanksComponent
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
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
