import { Component, OnInit } from '@angular/core';
import { Bar, BarMenuItem , BarsService} from '../bars.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { HttpClient } from '@angular/common/http';
import { BeersService } from '../beers.service';
import * as CanvasJS from '../canvasjs.min'

export interface BarSale {
  BarName: string;
  Quantity: number;
}

export interface DataPoint {
  y: number;
  label: string;
}

@Component({
  selector: 'app-bar-analytics',
  templateUrl: './bar-analytics.component.html',
  styleUrls: ['./bar-analytics.component.css']
})
export class BarAnalyticsComponent implements OnInit {

  Bnames: SelectItem[];
  Dnames: SelectItem[];
  selectedBeer: string;
  selectedDay: string;
  done: number;

  constructor(
    private beerService: BeersService,
    private barService: BarsService) { 
      this.getBeers();
      this.getDates();
    }

  ngOnInit() {
  }

  onOptionSelectedB(event) { //after dropdown is picked, show following elements on page
    if (event == null) {
        return;
    }
    this.selectedBeer = event;
  }

  onOptionSelectedD(event) { //after dropdown is picked, show following elements on page
    if (event == null) {
        return;
    }
    this.selectedDay = event;
    this.getTop10BarsSalesChart(this.selectedBeer, this.selectedDay);
  }

  getBeers(){
    this.beerService.getBeers1().subscribe(
      data => {
        this.Bnames = data.map(bname => { return {
            value: bname.BeerName,
            label: bname.BeerName }; 
        })
      }
    )
  }

  getDates(){
    this.barService.getDates().subscribe(
      data => {
        this.Dnames = data.map(day => { return {
            label: day.Date,
            value: day.Date };
        });
      }
    );
  }

  getTop10BarsSalesChart(beer, day){
    this.barService.getBarAnalytics(beer, day).subscribe(data => {
      var dps:DataPoint[] = [];
      let barSalesChart = new CanvasJS.Chart('barSalesChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: beer + ' - Highest Sales Bars on: ' + day
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var sale:BarSale = data[i];
        dps.push({ y: sale.Quantity, label: sale.BarName });
      }
      barSalesChart.render();
    });
  }

}
