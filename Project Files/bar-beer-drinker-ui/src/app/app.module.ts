import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { BarDetailsComponent } from './bar-details/bar-details.component';
import { BeerDetailsComponent } from './beer-details/beer-details.component';
import { BeersComponent } from './beers/beers.component';
import { InsightComponent } from './insight/insight.component';
import { BartendersComponent } from './bartenders/bartenders.component';
import { DrinkersComponent } from './drinkers/drinkers.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { ModificationsComponent } from './modifications/modifications.component';
import { DrinkerDetailsComponent } from './drinker-details/drinker-details.component';
import { BarsComponent } from './bars/bars.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    BarDetailsComponent,
    BeerDetailsComponent,
    BeersComponent,
    InsightComponent,
    BartendersComponent,
    DrinkersComponent,
    ManufacturersComponent,
    ModificationsComponent,
    DrinkerDetailsComponent,
    BarsComponent,
    VerificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    TableModule,
    AppRoutingModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
