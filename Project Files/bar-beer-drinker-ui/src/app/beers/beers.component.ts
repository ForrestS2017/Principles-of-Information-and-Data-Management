import { Component, OnInit } from '@angular/core';
import { BeersService } from '../beers.service';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.css']
})
export class BeersComponent implements OnInit {

  beers: any[];
  manufacturerOptions: SelectItem[];

  originalBeersList: any[];

  constructor(private beerService: BeersService) {
    this.beerService.getBeers().subscribe(
      data => {
        this.beers = data;
        this.originalBeersList = data;
      }
    );
    this.beerService.getBeerManufacturers().subscribe(
      data => {
        this.manufacturerOptions = data.map(manf => {
          return {
            label: manf.Manf,
            value: manf.Manf,
          };
        });
      }
    );

  }

  ngOnInit() {
  }

  filterBeers(manufacturer: string) {
    this.beers = this.originalBeersList;
    if (manufacturer) {
      this.beers = this.originalBeersList.filter(beer => beer.Manf === manufacturer);
    }
  }

}
