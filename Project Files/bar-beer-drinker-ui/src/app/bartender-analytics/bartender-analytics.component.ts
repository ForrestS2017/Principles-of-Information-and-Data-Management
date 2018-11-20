import { Component, OnInit } from '@angular/core';
import { BarsService, Bar } from '../bars.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { HttpClient } from '@angular/common/http';
import { Bartender, Shift, Sale } from '../bartenders/bartenders.component';

export interface Ranking {
    Rank: number;
    Bartender: string;
    BeersSold: number;
}

export interface BartenderSales {
    FirstName: string;
    LastName: string;
    BeersSold: number;
}

@Component({
  selector: 'app-bartender-analytics',
  templateUrl: './bartender-analytics.component.html',
  styleUrls: ['./bartender-analytics.component.css']
})
export class BartenderAnalyticsComponent implements OnInit {

  barName: string;
  shiftName: string;
  dayName: string;
  startTime: string;
  days: SelectItem[];
  bars: Bar[];
  barSelect: SelectItem[];
  shiftSelect: SelectItem[];
  shifts: Shift[];
  rankings: Ranking[];
  sales: Sale[];

  constructor(public barService: BarsService, public http: HttpClient) { 
    this.days = [
        { value: 'Sunday', label: 'Sunday' },
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' }
    ];
    this.getBars();
  }

  ngOnInit() {
  }

  getBars() {
    this.barService.getBars().subscribe(
      data => {
        this.bars = data;
        var count:number = 0;
        this.barSelect = data.map(bar => { return { value: count++, label: bar.BarName }; })
            .sort((a, b) => a.label.localeCompare(b.label));
      },
      error => {
        alert('Could not retrieve a list of bars');
      }
    );
  }
  
  getBartenders(barValue) {
      if (barValue == null) {
          this.barName = null;
          this.shiftName = null;
          this.dayName = null;
          return;
      }
      var bar:Bar = this.bars[barValue];
      this.barName = bar.BarName;
      this.http.get<Shift[]>('/api/bars/' + this.barName + '/shifts').subscribe(
        data => {
            this.shifts = data;
            var count:number = 0;
            this.shiftSelect = data.map(shift => { return { value: count++, label: shift.StartTime + '-' + shift.EndTime }; })
                .sort((a, b) => a.label.localeCompare(b.label));
        }, error => {
            alert('Could not retrieve a list of shifts');
        }
      );
  }
  
  setShift(shiftValue) {
      if (shiftValue == null) {
          this.shiftName = null;
          return;
      }
      var shift:Shift = this.shifts[shiftValue];
      this.shiftName = shift.StartTime + '-' + shift.EndTime;
      this.startTime = shift.StartTime;
      if (this.dayName !== null) {
          this.getRankingInfo();
      }
  }
  
  setDay(dayValue) {
      this.dayName = dayValue;
      if (this.dayName !== null && this.shiftName !== null) {
          this.getRankingInfo();
      }
  }
  
  getRankingInfo() {
      this.http.get<BartenderSales[]>('/api/bars/' + this.barName + '/shifts/' + this.dayName + '/' + this.startTime).subscribe(
        data => {
            var r = 1;
            this.rankings = data.map(sale => { return { Rank: r++, Bartender: sale.FirstName + ' ' + sale.LastName, BeersSold: sale.BeersSold }; });
        }, error => {
            alert('Could not retrieve a ranking of bartenders');
        }
      );
  }
  
}
