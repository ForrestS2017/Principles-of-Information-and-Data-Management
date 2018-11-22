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

export interface Fraction {
  Fraction: number;
}

export interface TimeDist {
  Interval1: number;
  Interval2: number;
  Interval3: number;
  Interval4: number;
}

export interface WeekDist {
  Interval1: number;
  Interval2: number;
  Interval3: number;
  Interval4: number;
  Interval5: number;
  Interval6: number;
  Interval7: number;
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
    return this.http.get<Fraction>('/api/fraction-sold/' + bar + '/' + day)
  }

  getBarTimeDist(bar: string) {
    return this.http.get<TimeDist>('api/bar-time-dist/' + bar);
  }
  
  getBarWeekDist(bar: string) {
    return this.http.get<WeekDist>('api/bar-week-dist/' + bar);
  }
  
  getDates() {
    return this.http.get<any[]>('/api/days')
  }
}
