import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface Verification {
    Verify: string;
}

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  running: string;
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
  count: number;

  constructor(public http: HttpClient) {
      this.running = 'Queries have not been run yet';
      this.result1 = '';
      this.result2 = '';
      this.result3 = '';
      this.result4 = '';
      this.result5 = '';
  }
  
  onClickMe() {
      this.count = 5;
      this.running = 'Running queries. . .';
      this.http.get<Verification[]>('/api/patterns/1').subscribe(
          data => {
            this.result1 = data[0].Verify;
            this.count--;
            if (this.count == 0) {
                this.running = 'Done';
            } else {
                this.running = '' + this.count + ' quer' + (this.count == 1 ? 'y' : 'ies') + ' remaining. . .';
            }
          },
          error => {
            alert('Could not verify Pattern 1');
          }
      );
      this.http.get<Verification[]>('/api/patterns/2').subscribe(
          data => {
            this.result2 = data[0].Verify;
            this.count--;
            if (this.count == 0) {
                this.running = 'Done';
            } else {
                this.running = '' + this.count + ' quer' + (this.count == 1 ? 'y' : 'ies') + ' remaining. . .';
            }
          },
          error => {
            alert('Could not verify Pattern 2');
          }
      );
      this.http.get<Verification[]>('/api/patterns/3').subscribe(
          data => {
            this.result3 = data[0].Verify;
            this.count--;
            if (this.count == 0) {
                this.running = 'Done';
            } else {
                this.running = '' + this.count + ' quer' + (this.count == 1 ? 'y' : 'ies') + ' remaining. . .';
            }
          },
          error => {
            alert('Could not verify Pattern 3');
          }
      );
      this.http.get<Verification[]>('/api/patterns/4').subscribe(
          data => {
            this.result4 = data[0].Verify;
            this.count--;
            if (this.count == 0) {
                this.running = 'Done';
            } else {
                this.running = '' + this.count + ' quer' + (this.count == 1 ? 'y' : 'ies') + ' remaining. . .';
            }
          },
          error => {
            alert('Could not verify Pattern 4');
          }
      );
      this.http.get<Verification[]>('/api/patterns/5').subscribe(
          data => {
            this.result5 = data[0].Verify;
            this.count--;
            if (this.count == 0) {
                this.running = 'Done';
            } else {
                this.running = '' + this.count + ' quer' + (this.count == 1 ? 'y' : 'ies') + ' remaining. . .';
            }
          },
          error => {
            alert('Could not verify Pattern 5');
          }
      );
  }

  ngOnInit() {
  }

}
