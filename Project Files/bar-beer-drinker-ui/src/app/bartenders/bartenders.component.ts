import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BartendersService, Bartender } from '../bartenders.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-bartenders',
  templateUrl: './bartenders.component.html',
  styleUrls: ['./bartenders.component.css']
})
export class BartendersComponent implements OnInit {

  Bartenders: Bartender[];
  EmployeeID: string;

  constructor(
    private bartenderService: BartendersService,
    private route: ActivatedRoute 
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      this.EmployeeID = paramMap.get('EmployeeID');

      bartenderService.getBartenders(this.EmployeeID).subscribe(
        data => {
          this.Bartenders = data;
        },
        (error: HttpResponse<any>) => {
          if (error.status === 404) {
            alert('Bartender not found');
          } else {
            console.error(error.status + ' - ' + error.body);
            alert('An error occurred on the server. Please check the browser console.');
          }
        }
      );

      });
    }

  ngOnInit() {
  }

}
