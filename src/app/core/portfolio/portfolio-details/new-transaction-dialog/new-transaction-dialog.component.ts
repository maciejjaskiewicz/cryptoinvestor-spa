import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Transaction } from './../transactions-table/Transaction.model';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-transaction-dialog',
  templateUrl: './new-transaction-dialog.component.html',
  styleUrls: ['./new-transaction-dialog.component.scss']
})
export class NewTransactionDialogComponent implements OnInit {

  newTransactionForm: FormGroup;
  coinControl: FormControl = new FormControl(null, Validators.required);
  options: any[] = [];

  filteredOptions: Observable<any[]>;

  constructor(
    private dialogRef: MatDialogRef<NewTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.newTransactionForm = new FormGroup({
      'coin': this.coinControl,
      'buyPrice': new FormControl(null, [ Validators.required, Validators.pattern(/^\d*\.?\d*$/) ]),
      'amount': new FormControl(null, [ Validators.required, Validators.pattern(/^\d*\.?\d*$/) ]),
      'date': new FormControl(null, Validators.required)
    });

    this.options = JSON.parse(localStorage.getItem('coins'));

    this.filteredOptions = this.coinControl.valueChanges.startWith(null).map(
      val => val ? this.filter(val) : this.options.slice()
    );
  }

  addToPortfolio() {
    const coinSymbol = this.newTransactionForm.get('coin').value;
    const buyPrice = this.newTransactionForm.get('buyPrice').value;
    const amount = this.newTransactionForm.get('amount').value;
    const date = this.newTransactionForm.get('date').value;

    const transaction = new Transaction(coinSymbol, buyPrice, amount, date);
    this.dialogRef.close(transaction);
  }

  filter(name: string): any[] {
    return this.options.filter(
      option => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  displayFn(symbol: string) {
    const coins = JSON.parse(localStorage.getItem('coins'));
    const coin = coins.find(x => x.symbol === symbol);
    return coin ? coin.name : symbol;
  }
}
