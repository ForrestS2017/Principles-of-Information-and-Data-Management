import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarsService, Bar, BarMenuItem } from '../bars.service';
import { HttpResponse } from '@angular/common/http';
import { SelectItem } from 'primeng/components/common/selectitem';

declare const Highcharts: any;

@Component({
  selector: 'app-bar-details',
  templateUrl: './bar-details.component.html',
  styleUrls: ['./bar-details.component.css']
})
export class BarDetailsComponent implements OnInit {

  barName: string;
  selectedDay: string;
  barDetails: Bar;
  days: SelectItem[];
  
  constructor(
    private barService: BarsService,
    private route: ActivatedRoute
  ) {
    route.paramMap.subscribe((paramMap) => {
      this.barName = paramMap.get('bar');
      this.selectedDay = '11/5';
      
      barService.getBar(this.barName).subscribe(
        data => {
          this.barDetails = data;
        },
        (error: HttpResponse<any>) => {
          if (error.status === 404) {
            alert('Bar not found');
          } else {
            console.error(error.status + ' - ' + error.body);
            alert('An error occurred on the server. Please check the browser console.');
          }
        }
      );

      

      this.barService.getTopDrinkers(this.barName).subscribe(
        data => {
  
          const names = [];
          const amounts = [];
  
          data.forEach(bar => {
            names.push(bar.FirstName);
            amounts.push(bar.Total);
          });
  
          this.renderChart(names, amounts);
        }
      );

      this.barService.getDates().subscribe(
        data => {
          this.days = data.map(day => {
            return {
              label: day.Date,
              value: day.Weekday,
            };
          });
        }
      );

      this.barService.getTopSoldBeers(this.barName, this.selectedDay).subscribe(
        data => {
          console.log('HELLO');
  
          const names = [];
          const amounts = [];
  
          data.forEach(bar => {
            names.push(bar.ItemName);
            amounts.push(bar.Quantity);
          });
          console.log('ablablablablablab');
          //console.log(names);
          //console.log(amounts);
          //this.renderChart2(names, amounts);
        }
      );

    });
  }

  ngOnInit() {
  }

  filterBars(day: string) {
    if(day) {
      this.selectedDay = day
    }
  }

  renderChart(names: string[], amounts: number[]) {
    Highcharts.chart('mytest', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top 10 Largest Spenders'
      },
      xAxis: {
        categories: names,
        title: {
          text: 'Name'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Spent'
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        data: amounts
      }]
    });
  };

  renderChart2(bnames: string[], bamounts: number[]) {
    Highcharts.chart('bargraph2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top 10 Beers Sold On This Day'
      },
      xAxis: {
        categories: bnames,
        title: {
          text: 'Beer Name'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Sold'
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        data: bamounts
      }]
    });
  }

}
