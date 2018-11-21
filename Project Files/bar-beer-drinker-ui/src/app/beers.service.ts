import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface BeerLocation {
  BarName: string;
  Price: number;
  customers: number;
}

export interface TopBar {
  BarName: string;
  Quantity: number;
}

export interface TopDrinker {
  DName: string;
  Quantity: number;
}

export interface Beer {
  BeerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class BeersService {

  constructor(private http: HttpClient) { }

  getBeers() {
    return this.http.get<any[]>('/api/beer');
  }

  getBeers1() {
    return this.http.get<Beer[]>('/api/beer');
  }

  getBarsSelling(beer: string) {
    return this.http.get<BeerLocation[]>(`/api/bars-selling/${beer}`);
  }

  getBeerManufacturers(beer?: string): any {
    if (beer) {
      return this.http.get<string>(`/api/beer-manufacturer/${beer}`);
    }
    return this.http.get<string[]>('/api/beer-manufacturer');
  }

  getBeerTopBars(beer: string) {
    return this.http.get<TopBar[]>('/api/beer-top-bars/' + beer);
  }

  getBeerTopDrinkers(beer: string) {
    return this.http.get<TopDrinker[]>('/api/beer-top-drinkers/' + beer);
  }

}
