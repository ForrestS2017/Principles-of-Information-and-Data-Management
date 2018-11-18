import { Component, OnInit } from '@angular/core';

import { DrinkersService, Drinker, Transaction, Bill } from '../drinkers.service';

@Component({
  selector: 'app-drinkers',
  templateUrl: './drinkers.component.html',
  styleUrls: ['./drinkers.component.css']
})
export class DrinkersComponent implements OnInit {
    
  transactions: Transaction[];

  constructor(public drinkerService: DrinkersService) {
      this.getTransactions('Forrest', 'Smith');
  }

  ngOnInit() {
  }
  
  getTransactions(FirstName, LastName) {
    this.drinkerService.getTransactions(FirstName, LastName).subscribe(data => {
          var Bills:Bill[] = data;
          var Transactions:Transaction[] = [];
          if (Bills.length < 1) {
              return Transactions;
          }
          var b:Bill = Bills[0];
          var currentTransaction:Transaction = {
              ID: b.BillID,
              Date: b.Date,
              Time: b.Time,
              Items: [{ ItemName: b.ItemName, Quantity: b.Quantity, Price: b.Price }],
              Tip: b.TipTotal - (b.Quantity * b.Price),
              Total: b.TipTotal
          }
          for (var i:number = 1; i < Bills.length; i++) {
              var bill:Bill = Bills[i];
              if (currentTransaction.ID != bill.BillID) {
                  Transactions.push(currentTransaction);
                    currentTransaction = {
                      ID: bill.BillID,
                      Date: bill.Date,
                      Time: bill.Time,
                      Items: [{ ItemName: bill.ItemName, Quantity: bill.Quantity, Price: bill.Price }],
                      Tip: bill.TipTotal - bill.Quantity * bill.Price,
                      Total: bill.TipTotal
                  }
              } else {
                  currentTransaction.Items.push({ ItemName: bill.ItemName, Quantity: bill.Quantity, Price: bill.Price });
                  currentTransaction.Tip += bill.TipTotal - bill.Quantity * bill.Price;
                  currentTransaction.Total += bill.TipTotal;
              }
          }
          Transactions.push(currentTransaction);
          this.transactions = Transactions;
      },
      error => {
        alert('Could not retrieve a list of transactions for ' + FirstName + ' ' + LastName);
      }
    );
  }

}
