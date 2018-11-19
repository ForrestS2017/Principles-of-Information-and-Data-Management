import { Component, OnInit, ElementRef } from '@angular/core';
import { ManufacturersService, Manufacturer, PopularCity, LikedCity } from '../manufacturers.service';
import { SelectItem } from 'primeng/components/common/selectitem';

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

  constructor(public manfService: ManufacturersService, private ref: ElementRef) { 
    this.getManfs();
  }

  ngOnInit() {
  }

  onOptionSelectedM(event) { //after dropdown is picked, show following elements on page
    if (event == null) {
        return;
    }
    var manfName:Manufacturer = this.manfsList[event];
    this.getHighestSales(manfName.Manf);
    this.getLikedCities(manfName.Manf);
  }

  getManfs(){
    this.manfService.getManfs().subscribe(
      data => {
        this.manfsList = data;
        this.Mnames = data.map(manfName => { return {
            value: manfName.Manf, 
            label: manfName.Manf }; })
      }
    )
  }

  getHighestSales(name){

  }

  getLikedCities(name){

  }

}
