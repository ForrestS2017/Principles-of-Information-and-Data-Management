import { Component, OnInit } from '@angular/core';
import { BeersService, BeerLocation, TopBar, TopDrinker, TimeDist } from '../beers.service';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/components/common/selectitem';
import * as CanvasJS from '../canvasjs.min'

export interface DataPoint {
  y: number;
  label: string;
}

@Component({
  selector: 'app-beer-details',
  templateUrl: './beer-details.component.html',
  styleUrls: ['./beer-details.component.css']
})
export class BeerDetailsComponent implements OnInit {

  beerName: string;
  beerLocations: BeerLocation[];
  manufacturer: string;

  filterOptions: SelectItem[];
  sortField: string;
  sortOrder: number;

  topBars: TopBar[];
  topDrinkers: TopDrinker[];

  timeDist: TimeDist;

  constructor(
    private beerService: BeersService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      this.beerName = paramMap.get('beer');

      this.beerService.getBarsSelling(this.beerName).subscribe(
        data => {
          this.beerLocations = data;
        }
      );

      this.beerService.getBeerManufacturers(this.beerName).subscribe(
        data => {
          this.manufacturer = data;
        }
      );

      this.beerService.getBeerTopBars(this.beerName).subscribe(
        data => {
          this.topBars = data;
        }
      );

      this.beerService.getBeerTopDrinkers(this.beerName).subscribe(
        data => {
          this.topDrinkers = data;
        }
      );

      this.beerService.getBeerTimeDist(this.beerName).subscribe(
        data => {
          this.timeDist = data;
        }
      )

      this.getBeerTopBarsChart(this.beerName);
      this.getBeerTopDrinkersChart(this.beerName);
      this.getTimeDistChart(this.beerName);

      this.filterOptions = [
        /*{
          'label': 'Low price first',
          'value': 'low price'
        },
        {
          'label': 'High price first',
          'value': 'high price'
        },*/
        {
          'label': 'Most frequented first',
          'value': 'high customer'
        },
        {
          'label': 'Least frequented first',
          'value': 'low customer'
        }
      ];
    });
  }

  ngOnInit() {
  }

  sortBy(selectedOption: string) {
    if (selectedOption === 'low price') {
      this.beerLocations.sort((a, b) => {
        return a.Price - b.Price;
      });
    } else if (selectedOption === 'high price') {
      this.beerLocations.sort((a, b) => {
        return b.Price - a.Price;
      });
    } else if (selectedOption === 'low customer') {
      this.beerLocations.sort((a, b) => {
        return a.customers - b.customers;
      });
    } else if (selectedOption === 'high customer') {
      this.beerLocations.sort((a, b) => {
        return b.customers - a.customers;
      });
    }
  }

  getTimeDistChart(beerName){
    this.beerService.getBeerTimeDist(beerName).subscribe(data => {
      var dps:DataPoint[] = [];
      let timeDistChart = new CanvasJS.Chart('timeDistChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: beerName + ' - Time Distribution of Sales'
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

  getBeerTopBarsChart(beerName){
    this.beerService.getBeerTopBars(beerName).subscribe(data => {
      var dps:DataPoint[] = [];
      let topBarsChart = new CanvasJS.Chart('topBarsChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: 'Top 10 Bars Selling ' + beerName
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var bbar:TopBar = data[i];
        dps.push({ y: bbar.Quantity, label: bbar.BarName });
      }
      topBarsChart.render();
    });
  }

  getBeerTopDrinkersChart(beerName){
    this.beerService.getBeerTopDrinkers(beerName).subscribe(data => {
      var dps:DataPoint[] = [];
      let topDrinkersChart = new CanvasJS.Chart('topDrinkersChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: 'Top 20 People Drinking ' + beerName
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var ddrinker:TopDrinker = data[i];
        dps.push({ y: ddrinker.Quantity, label: ddrinker.DName });
      }
      topDrinkersChart.render();
    });
  }

}
