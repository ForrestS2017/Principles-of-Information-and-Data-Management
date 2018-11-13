import { Component, OnInit } from '@angular/core';

import { BarsService, Bar } from '../bars.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bars: Bar[];

  constructor(
    public barService: BarsService
  ) {
    this.getBars();
  }

  ngOnInit() {
  }

  getBars() {
    this.barService.getBars().subscribe(
      data => {
        this.bars = data;
      },
      error => {
        alert('Could not retrieve a list of bars');
      }
    );
  }

}
