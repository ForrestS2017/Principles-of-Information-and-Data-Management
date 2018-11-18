import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface Drinker {
  FirstName: string;
  LastName: string;
  State: string;
  City: string;
  Phone: string;
  Address: string;
}

export interface Bill {
    BillID: string;
    Date: string;
    Time: string;
    BarName: string;
    ItemName: string;
    Quantity: number;
    Price: number;
    TipTotal: number;
}

export interface Item {
    ItemName: string;
    Quantity: number;
    Price: number;
}

export interface Transaction {
    ID: string;
    Date: string;
    Time: string;
    Bar: string;
    Items: Item[];
    ItemString: string;
    Tip: number;
    TipString: string;
    Tax: number;
    TaxString: string;
    Total: number;
    TotalString: string;
}

export interface BeerPurchase {
    ItemName: string;
    Total: number;    
}

export interface Spending {
    Date: string;
    BarName: string;
    Total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DrinkersService {

  constructor(public http: HttpClient) { }
  
  getDrinkers() {
    return this.http.get<Drinker[]>('/api/drinker');
  }
  
  getDrinker(FirstName: string, LastName: string) {
    return this.http.get<Drinker>('/api/drinker/' + FirstName + '_' + LastName);
  }
  
  getTransactions(FirstName: string, LastName: string) {
      return this.http.get<Bill[]>('api/drinker/' + FirstName + '_' + LastName + '/transactions');
  }
  
  getBeerPurchases(FirstName: string, LastName: string) {
    return this.http.get<BeerPurchase[]>('/api/drinker/' + FirstName + '_' + LastName + '/beer_purchases');
  }
  
  getSpending(FirstName: string, LastName: string) {
    return this.http.get<Spending[]>('/api/drinker/' + FirstName + '_' + LastName + '/spending');
  }
  
}
