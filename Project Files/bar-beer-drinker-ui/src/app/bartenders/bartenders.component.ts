import { Component, OnInit } from '@angular/core';
import { BarsService, Bar } from '../bars.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { HttpClient } from '@angular/common/http';

export interface Bartender {
    EmployeeID: string;
    FirstName: string;
    LastName: string;
}

export interface Shift {
    WeekDay: string;
    StartTime: string;
    EndTime: string;
}

export interface Sale {
    ItemName: string;
    TotalSold: number;
}

@Component({
  selector: 'app-bartenders',
  templateUrl: './bartenders.component.html',
  styleUrls: ['./bartenders.component.css']
})
export class BartendersComponent implements OnInit {

  barName: string;
  bartenderName: string;
  bars: Bar[];
  barSelect: SelectItem[];
  bartenders: Bartender[];
  bartenderSelect: SelectItem[];
  shifts: Shift[];
  sales: Sale[];
  done: number;

  constructor(public barService: BarsService, public http: HttpClient) { 
    this.getBars();
  }

  ngOnInit() {
  }

  getBars() {
    this.done = 1;
    this.barService.getBars().subscribe(
      data => {
        this.bars = data;
        var count:number = 0;
        this.barSelect = data.map(bar => { return { value: count++, label: bar.BarName }; })
            .sort((a, b) => a.label.localeCompare(b.label));
        this.done = 0;
      },
      error => {
        alert('Could not retrieve a list of bars');
        this.done = 0;
      }
    );
  }
  
  getBartenders(barValue) {
      this.bartenderName = null;
      if (barValue == null) {
          this.barName = null;
          return;
      }
      this.done = 1;
      var bar:Bar = this.bars[barValue];
      this.barName = bar.BarName;
      this.http.get<Bartender[]>('/api/bars/' + this.barName + '/bartenders').subscribe(
        data => {
            this.bartenders = data;
            var count:number = 0;
            this.bartenderSelect = data.map(bartender => { return { value: count++, label: bartender.FirstName + ' ' + bartender.LastName }; })
                .sort((a, b) => a.label.localeCompare(b.label));
            this.done = 0;
        }, error => {
            alert('Could not retrieve a list of bartenders');
            this.done = 0;
        }
      );
  }
  
  getBartenderInfo(bartenderValue) {
      if (bartenderValue == null) {
          this.bartenderName = null;
          return;
      }
      this.done = 2;
      var bartender:Bartender = this.bartenders[bartenderValue];
      this.bartenderName = bartender.FirstName + ' ' + bartender.LastName;
      this.http.get<Shift[]>('/api/bartenders/' + bartender.FirstName + '_' + bartender.LastName + '/shifts').subscribe(
        data => {
            this.shifts = data;
            this.done--;
        }, error => {
            alert('Could not retrieve a list of bartender shifts');
            this.done--;
        }
      );
      // Corbin Shaffer
      this.http.get<Sale[]>('/api/bartenders/' + bartender.FirstName + '_' + bartender.LastName + '/sales').subscribe(
        data => {
            if (data == null) {
                this.sales = [{ ItemName: 'No beers sold', TotalSold: -1 }];
            } else {
                this.sales = data;
            }
            this.done--;
        }, error => {
            alert('Could not retrieve a list of bartender shifts');
            this.done--;
        }
      );
  }
  
}
