import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Transaction } from './../Transaction.model';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {
  transactionForm: FormGroup;
  coinName: string;

  constructor(
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.coinName = this.data.coin.name;

    this.transactionForm = new FormGroup({
      'buyPrice': new FormControl(null, [ Validators.required, Validators.pattern(/^\d*\.?\d*$/) ]),
      'amount': new FormControl(null, [ Validators.required, Validators.pattern(/^\d*\.?\d*$/) ]),
      'date': new FormControl(null, Validators.required),
      'sell': new FormControl(),
      'soldPrice': new FormControl({value: '', disabled: true}, [ Validators.required, Validators.pattern(/^\d*\.?\d*$/) ])
    });

    this.transactionForm.get('buyPrice').setValue(this.data.purchasePrice);
    this.transactionForm.get('amount').setValue(this.data.amount);
    this.transactionForm.get('date').setValue(this.data.purchaseDate);

    if (this.data.isSold) {
      this.transactionForm.get('sell').setValue(this.data.isSold);
      this.transactionForm.get('sell').disable();
      this.transactionForm.get('soldPrice').setValue(this.data.soldPrice);
    }
  }

  update() {
    const buyPrice = this.transactionForm.get('buyPrice').value;
    const amount = this.transactionForm.get('amount').value;
    const date = this.transactionForm.get('date').value;
    const sell = this.transactionForm.get('sell').value;
    const soldPrice = this.transactionForm.get('soldPrice').value;

    const transaction = new Transaction(this.data.coin.symbol, buyPrice, amount, date);
    if (sell === true) {
      transaction.sell(soldPrice);
    }

    this.dialogRef.close({ mode: 'update', data: transaction });
  }

  delete() {
    this.dialogRef.close({ mode: 'delete', data: this.data });
  }

  toggleSellState() {
    const sellState = this.transactionForm.get('sell').value;
    if (sellState) {
      this.transactionForm.get('soldPrice').enable();
    } else {
      this.transactionForm.get('soldPrice').disable();
    }
  }
}
