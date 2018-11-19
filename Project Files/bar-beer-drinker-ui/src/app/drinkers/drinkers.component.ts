import { Component, OnInit, ElementRef } from '@angular/core';

import { DrinkersService, Drinker, Transaction, Bill, BeerPurchase, Spending } from '../drinkers.service';

import { SelectItem } from 'primeng/components/common/selectitem';

import * as CanvasJS from '../canvasjs.min';

export interface DataPoint {
    y: number;
    label: string;
}

@Component({
  selector: 'app-drinkers',
  templateUrl: './drinkers.component.html',
  styleUrls: ['./drinkers.component.css']
})
export class DrinkersComponent implements OnInit {
    
  transactions: Transaction[];
  drinkers: Drinker[];
  names: SelectItem[];
  drinkerName: string;

  constructor(public drinkerService: DrinkersService, private ref: ElementRef) {
      this.getDrinkers();
  }

  ngOnInit() {
  }
  
  onOptionSelected(event) {
    var drinker:Drinker = this.drinkers[event];
    this.drinkerName = drinker.FirstName + ' ' + drinker.LastName;
    this.getTransactions(drinker.FirstName, drinker.LastName);
    this.makeBeerPurchaseChart(drinker.FirstName, drinker.LastName);
    this.makeSpendingChart(drinker.FirstName, drinker.LastName);
  }
  
  getDrinkers() {
    this.drinkerService.getDrinkers().subscribe(
      data => {
        this.drinkers = data;
        var count:number = 0;
        this.names = data.map(drinker => { return { value: count++, label: drinker.FirstName + ' ' + drinker.LastName }; })
            .sort((a, b) => a.label.localeCompare(b.label));
      },
      error => {
        alert('Could not retrieve a list of drinkers');
      }
    );
  }
  
  getTransactions(FirstName, LastName) {
    this.drinkerService.getTransactions(FirstName, LastName).subscribe(data => {
          var Bills:Bill[] = data;
          var Transactions:Transaction[] = [];
          if (Bills.length < 1) {
              return Transactions;
          }
          var b:Bill = Bills[0];
          var t:number = b.Quantity * b.Price * 0.07; // 7% tax
          var currentTransaction:Transaction = {
              ID: b.BillID,
              Date: b.Date,
              Time: b.Time,
              Bar: b.BarName,
              Items: [{ ItemName: b.ItemName, Quantity: b.Quantity, Price: b.Price }],
              ItemString: '',
              Tip: b.TipTotal - (b.Quantity * b.Price) - t,
              TipString: '',
              Tax: t,
              TaxString: '',
              Total: b.TipTotal,
              TotalString: ''
          }
          for (var i:number = 1; i < Bills.length; i++) {
              var bill:Bill = Bills[i];
              var tax:number = bill.Quantity * bill.Price * 0.07;
              if (currentTransaction.ID != bill.BillID) {
                  currentTransaction.TaxString = currentTransaction.Tax.toFixed(2);
                  currentTransaction.TipString = currentTransaction.Tip.toFixed(2);
                  currentTransaction.TotalString = currentTransaction.Total.toFixed(2);
                  currentTransaction.ItemString = currentTransaction.Items.map((item) => item.ItemName + ': $' + item.Price +  ' (×' + item.Quantity + ')\n').join('');
                  Transactions.push(currentTransaction);
                  currentTransaction = {
                    ID: bill.BillID,
                    Date: bill.Date,
                    Time: bill.Time,
                    Bar: bill.BarName,
                    Items: [{ ItemName: bill.ItemName, Quantity: bill.Quantity, Price: bill.Price }],
                    ItemString: '',
                    Tax: tax,
                    TaxString: '',
                    Tip: bill.TipTotal - bill.Quantity * bill.Price - tax,
                    TipString: '',
                    Total: bill.TipTotal,
                    TotalString: ''
                  }
              } else {
                  currentTransaction.Items.push({ ItemName: bill.ItemName, Quantity: bill.Quantity, Price: bill.Price });
                  currentTransaction.Tax += tax;
                  currentTransaction.Tip += bill.TipTotal - bill.Quantity * bill.Price - tax;
                  currentTransaction.Total += bill.TipTotal;
              }
          }
          currentTransaction.TaxString = currentTransaction.Tax.toFixed(2);
          currentTransaction.TipString = currentTransaction.Tip.toFixed(2);
          currentTransaction.TotalString = currentTransaction.Total.toFixed(2);
          currentTransaction.ItemString = currentTransaction.Items.map((item) => item.ItemName + ': $' + item.Price +  ' (x' + item.Quantity + ')\n').join('');
          Transactions.push(currentTransaction);
          this.transactions = Transactions;
      },
      error => {
        alert('Could not retrieve a list of transactions for ' + FirstName + ' ' + LastName);
      }
    );
  }
  
  makeBeerPurchaseChart(FirstName, LastName) {
      this.drinkerService.getBeerPurchases(FirstName, LastName).subscribe(data => {
          var dps:DataPoint[] = [];
          let ordersChart = new CanvasJS.Chart('ordersChart', {
              animationEnabled: true,
              exportEnabled: true,
              title: {
                  text: this.drinkerName + '\'s Most Ordered Beers'
              },
              data: [{
                  type: "column",
                  dataPoints: dps
              }]
          });
          for (var i:number = 0; i < data.length; i++) {
              var bp:BeerPurchase = data[i];
              dps.push({ y: bp.Total, label: bp.ItemName });
          }
          ordersChart.render();
      });
  }
  
  makeSpendingChart(FirstName, LastName) {
      this.drinkerService.getSpending(FirstName, LastName).subscribe(data => {
          var dps:DataPoint[] = [];
          let ordersChart = new CanvasJS.Chart('spendingChart', {
              animationEnabled: true,
              exportEnabled: true,
              title: {
                  text: this.drinkerName + '\'s Spending Per Bar Per Day'
              },
              data: [{
                  type: "column",
                  dataPoints: dps
              }]
          });
          for (var i:number = 0; i < data.length; i++) {
              var spending:Spending = data[i];
              dps.push({ y: spending.Total, label: spending.Date + ' ' + spending.BarName });
          }
          ordersChart.render();
      });
  }

}
