import { Component, OnInit } from '@angular/core';
import { BarsService } from '../bars.service';

declare const Highcharts: any;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private barService: BarsService) {
    this.barService.getFrequentCounts().subscribe(
      data => {
        console.log(data);

        const bars = [];
        const counts = [];

        data.forEach(bar => {
          bars.push(bar.BarName);
          counts.push(bar.frequentCount);
        });

        this.renderChart(bars, counts);
      }
    );
  }

  ngOnInit() {
  }

  renderChart(bars: string[], counts: number[]) {
    Highcharts.chart('bargraph', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Popular Bars!'
      },
      xAxis: {
        categories: bars,
        title: {
          text: 'Bar'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Frequenters'
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
        data: counts
      }]
    });
  }

}

