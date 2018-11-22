import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { BarDetailsComponent } from './bar-details/bar-details.component';
import { BarAnalyticsComponent } from './bar-analytics/bar-analytics.component';
import { BeerDetailsComponent } from './beer-details/beer-details.component';
import { BeersComponent } from './beers/beers.component';
import { BartendersComponent } from './bartenders/bartenders.component';
import { DrinkersComponent } from './drinkers/drinkers.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { ModificationsComponent } from './modifications/modifications.component';
import { DrinkerDetailsComponent } from './drinker-details/drinker-details.component';
import { BarsComponent } from './bars/bars.component';
import { VerificationComponent } from './verification/verification.component';
import { BartenderAnalyticsComponent } from './bartender-analytics/bartender-analytics.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent
  },
  {
    path: 'static',
    pathMatch: 'full',
    component: WelcomeComponent
  },
  {
    path: 'bars',
    pathMatch: 'full',
    component: BarsComponent
  },
  {
    path: 'bars/:bar',
    pathMatch: 'full',
    component: BarDetailsComponent
  },
  {
    path: 'bar_analytics',
    pathMatch: 'full',
    component: BarAnalyticsComponent
  },
  {
    path: 'beers',
    pathMatch: 'full',
    component: BeersComponent
  },
  {
    path: 'beers/:beer',
    pathMatch: 'full',
    component: BeerDetailsComponent
  },
  {
    path: 'manufacturers',
    pathMatch: 'full',
    component: ManufacturersComponent
  },
  {
    path: 'bartenders',
    pathMatch: 'full',
    component: BartendersComponent
  },
  {
    path: 'modifications',
    pathMatch: 'full',
    component: ModificationsComponent
  },
  {
    path: 'drinkers',
    pathMatch: 'full',
    component: DrinkersComponent
  },
  {
    path: 'drinkers/:drinker',
    pathMatch: 'full',
    component: DrinkerDetailsComponent
  },
  {
    path: 'patterns',
    pathMatch: 'full',
    component: VerificationComponent
  },
  {
      path: 'bartender_analytics',
      pathMatch: 'full',
      component: BartenderAnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
