import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BarSale } from './bar-analytics/bar-analytics.component';

export interface Bar {
  BarName: string;
  License: string;
  City: string;
  Phone: string;
  Address: string;
}

export interface BarMenuItem {
  BeerName: string;
  Manf: string;
  Price: number;
  Likes: number;
}

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(
    public http: HttpClient
  ) { }

  getBars() {
    return this.http.get<Bar[]>('/api/bar');
  }

  getBar(bar: string) {
    return this.http.get<Bar>('/api/bar/' + bar);
  }

  getMenu(bar: string) {
    return this.http.get<BarMenuItem[]>('/api/menu/' + bar);
  }

  getFrequentCounts() {
    return this.http.get<any[]>('/api/frequents-data');
  }

  getTopDrinkers(bar: string) {
    return this.http.get<any[]>('/api/bar-top-drinkers/' + bar)
  }

  getTopSoldBeers(bar: string, day: string) {
    return this.http.get<any[]>('/api/bar-top-sold-beers/' + bar + '/day/' + day)
  }

  getBarAnalytics(beer: string, day: string) {
    return this.http.get<BarSale[]>('/api/bar_analytics/' + beer + '/' + day)
  }
  
  get_fraction_sold(bar: string, day: string) {
    return this.http.get<any[]>('/api/fraction-sold/' + bar + '/' + day)
  }
  
  getDates() {
    return this.http.get<any[]>('/api/days')
  }
}
