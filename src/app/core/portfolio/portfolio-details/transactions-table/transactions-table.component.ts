import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  TdDataTableService,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  ITdDataTableColumn
} from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { PortfolioService } from './../../portfolio.service';
import { Transaction } from './Transaction.model';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'coin.iconUrl', label: 'Icon', width: 50},
    { name: 'coin.name',  label: 'Name', sortable: true, filter: true },
    { name: 'purchaseDate',  label: 'Date', sortable: true, filter: true },
    { name: 'price', label: 'Price', numeric: true, sortable: true },
    { name: 'profit', label: 'Profit / Loss', numeric: true, sortable: true }
  ];

  data: any[] = [];

  @Input()
  set transactionsData(data: any[]) {
    this.data = data;
    this.filter();
  }

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;

  searchTerm = '';
  fromRow = 1;
  currentPage = 1;
  pageSize = 10;
  sortBy = 'profit';
  selectedRows = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(
    private dataTableService: TdDataTableService,
    private dialog: MatDialog,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit() {
    this.filter();
  }

  selectEvent(event: any) {
    this.openTransactionDialog(event.row);
  }

  openTransactionDialog(data: any) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      panelClass: ['clear-dialog'],
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.mode === 'update') {
          this.updateTransaction(data.id, result.data);
        }
        if (result.mode === 'delete') {
          this.deleteTransaction(data.id);
        }
      }
    });
  }

  updateTransaction(id: string, data: any) {
    this.portfolioService.updateTransaction(id, data).subscribe(
      (result) => {}
    );
  }

  deleteTransaction(id: string) {
    this.portfolioService.deleteTransaction(id).subscribe(
      (result) => {}
    );
  }

  sort(sortEvent: ITdDataTableSortChangeEvent) {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent) {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter() {
    let newData: any[] = this.data;
    const excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this.dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this.dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this.dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
}
