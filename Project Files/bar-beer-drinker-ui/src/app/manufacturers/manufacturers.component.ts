import { Component, OnInit, ElementRef } from '@angular/core';
import { ManufacturersService, Manufacturer, PopularCity, LikedCity, LikedState } from '../manufacturers.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import * as CanvasJS from '../canvasjs.min'

export interface DataPoint {
  y: number;
  label: string;
}

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {

  soldCities: PopularCity[];
  likedCitiesCounts: LikedCity[];
  manfsList: Manufacturer[];
  Mnames: SelectItem[];
  done: number;

  constructor(
    public manfService: ManufacturersService, 
    private ref: ElementRef
    ) {
    this.getManfs();
  }

  ngOnInit() {
  }

  onOptionSelectedM(event) { //after dropdown is picked, show following elements on page
    if (event == null) {
        return;
    }
    this.done = 3;
    var manfName:Manufacturer = this.manfsList[event];
    this.getHighestSalesChart(event);
    this.getLikedCitiesChart(event);
    this.getLikedStatesChart(event);
  }

  getManfs(){
    this.done = 1;
    this.manfService.getManfs().subscribe(
      data => {
        this.manfsList = data;
        this.Mnames = data.map(manfName => { return {
            value: manfName.Manf, 
            label: manfName.Manf }; 
        })
        this.done = 0;
      }
    )
  }

  getHighestSalesChart(manfName){
    this.manfService.getHighestSales(manfName).subscribe(data => {
      var dps:DataPoint[] = [];
      let salesChart = new CanvasJS.Chart('salesChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: manfName + ' - Highest Sales Regions'
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var sale:PopularCity = data[i];
        dps.push({ y: sale.TipTotal, label: sale.City });
      }
      salesChart.render();
      this.done--;
    });
  }

  getLikedCitiesChart(manfName){
    this.manfService.getLikedCities(manfName).subscribe(data => {
      var dps:DataPoint[] = [];
      let popularChart = new CanvasJS.Chart('popularChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: manfName + ' -  Most Popular in These Cities'
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var sale:LikedCity = data[i];
        dps.push({ y: sale.Count, label: sale.City });
      }
      popularChart.render();
      this.done--;
    });
  }
  
  getLikedStatesChart(manfName){
    this.manfService.getLikedStates(manfName).subscribe(data => {
      var dps:DataPoint[] = [];
      let popularChart = new CanvasJS.Chart('statesChart', {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: manfName + ' -  Most Popular in These States'
        },
        data: [{
          type: "column",
          dataPoints: dps
        }]
      });
      for(var i:number = 0; i < data.length; i++){
        var sale:LikedState = data[i];
        dps.push({ y: sale.Count, label: sale.State });
      }
      popularChart.render();
      this.done--;
    });
  }

}
