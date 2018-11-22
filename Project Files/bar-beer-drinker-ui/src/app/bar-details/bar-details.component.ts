import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarsService, Bar, TimeDist, Fraction, BarMenuItem } from '../bars.service';
import { HttpResponse } from '@angular/common/http';
import { SelectItem } from 'primeng/components/common/selectitem';
import * as CanvasJS from '../canvasjs.min'


declare const Highcharts: any;
export interface DataPoint {
  y: number;
  label: string;
}

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
  fraction: number;
  timeDist: TimeDist;
  
  constructor(
    private barService: BarsService,
    private route: ActivatedRoute
  ) {
    route.paramMap.subscribe((paramMap) => {
      this.barName = paramMap.get('bar');
      
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
              value: day.Date,
            };
          });
        }
      );

      

    });
  }

  ngOnInit() {
  }

  filterBars(day: string) {
    if(day) {
      this.selectedDay = day;

      this.barService.getTopSoldBeers(this.barName, this.selectedDay).subscribe(
        data => {
  
          const names = [];
          const amounts = [];
  
          data.forEach(bar => {
            names.push(bar.ItemName);
            amounts.push(bar.Quantity);
          });
          this.renderChart2(names, amounts);
        }
      );

      this.barService.get_fraction_sold(this.barName, this.selectedDay).subscribe(
        data => {
          this.fraction = data[0].Fraction;
        }
      );

      this.barService.getBarTimeDist(this.barName).subscribe(
        data => {
          this.timeDist = data;
        }
      );
      this.getTimeDistChart(this.barName);
    }
  }

  getTimeDistChart(barName){
    console.log('SHOULD GRAPH')
    this.barService.getBarTimeDist(barName).subscribe(data => {
      var dps:DataPoint[] = [];
      let timeDistChart = new CanvasJS.Chart('timeDistChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: barName + ' - Time Distribution of Sales'
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      var inters:TimeDist = data[0];
      dps.push({ y: inters.Interval1, label: '12AM - 6AM' })
      dps.push({ y: inters.Interval2, label: '6AM - 12PM' })
      dps.push({ y: inters.Interval3, label: '12PM - 6PM' })
      dps.push({ y: inters.Interval4, label: '6PM - 12AM' })
     
      timeDistChart.render();
    });
  }
  

  renderChart(names: string[], amounts: number[]) {
    Highcharts.chart('bargraph', {
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

  renderChart3(bnames: string[], bamounts: number[]) {
    Highcharts.chart('bargraphTime', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Time Distribution of Total Sales'
      },
      xAxis: {
        categories: bnames,
        title: {
          text: 'Time of Day'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Amount Sold'
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
