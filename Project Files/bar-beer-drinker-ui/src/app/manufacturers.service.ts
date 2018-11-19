import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface Manufacturer {
  Manf: string;
}

export interface PopularCity {
  Manf: string;
  City: string;
  TipTotal: number;
}

export interface LikedCity {
  City: string;
  Count: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  constructor(public http: HttpClient) { }

  getManfs(){
    return this.http.get<Manufacturer[]>('api/beer-manufacturer');
  }

  getHighestSales(Manf: string) {
    return this.http.get<PopularCity[]>('/api/manufacturer/' + Manf + '/sales')
  }

  getLikedCities(Manf: string) {
    return this.http.get<LikedCity[]>('/api/manufacturer/' + Manf + '/liked')
  }
  
}
