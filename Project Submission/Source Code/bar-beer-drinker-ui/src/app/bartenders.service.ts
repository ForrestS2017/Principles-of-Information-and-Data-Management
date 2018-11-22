import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface Bartender {
  EmployeeID: string;
  FirstName: string;
  LastName: string;
  StartTime: string;
  EndTime: string;
  WeekDay: string;
}

@Injectable({
  providedIn: 'root'
})
export class BartendersService {

  constructor(
    public http: HttpClient
  ) { }

  getBartenders(EmployeeID: string) {
    return this.http.get<Bartender[]>('/api/bartenders/' + EmployeeID);
  }

}
