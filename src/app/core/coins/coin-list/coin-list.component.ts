import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TdDataTableService,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  ITdDataTableColumn,
  TdLoadingService,
  IPageChangeEvent,
  TdMediaService
} from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import { CoinsService } from './../coins.service';

const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit, OnDestroy {

  columns: ITdDataTableColumn[] = [
    { name: 'iconUrl', label: 'Icon', width: 50},
    { name: 'symbol',  label: 'Symbol', width: 100, hidden: false, sortable: true},
    { name: 'name',  label: 'Name', sortable: true, filter: true },
    { name: 'marketCap', label: 'Market Cap $', numeric: true, sortable: true, format: NUMBER_FORMAT },
    { name: 'volume24h', label: 'Volume (24h) $', numeric: true, sortable: true, hidden: false, format: NUMBER_FORMAT },
    { name: 'price', label: 'Price $', numeric: true, sortable: true },
    { name: 'change24h', label: 'Change (24h)', numeric: true, sortable: true, format: DECIMAL_FORMAT },
  ];

  data: any[] = [];

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;

  searchTerm = '';
  fromRow = 1;
  currentPage = 1;
  pageSize = 50;
  sortBy = 'marketCap';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  mediaSubscriptionSm: Subscription;

  constructor(
    private dataTableService: TdDataTableService,
    private mediaService: TdMediaService,
    private loadingService: TdLoadingService,
    private coinsService: CoinsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingService.register('coinListLoading');
    this.coinsService.getCoinsList().subscribe(
      (data) => {
        this.data = data;
        this.selectPriceByCurrency();
        this.filter();
        this.loadingService.resolve('coinListLoading');
      }
    );

    this.watchScreen();
  }

  watchScreen(): void {
    this.mediaSubscriptionSm = this.mediaService.registerQuery('sm').subscribe((matches: boolean) => {
      this.setList();
    });

  }

  setList() {
    const isSm = this.checkScreenIsSm();

    if (isSm) {
      this.columns.find(x => x.name === 'volume24h').hidden = true;
      this.columns.find(x => x.name === 'symbol').hidden = true;
    } else {
      this.columns.find(x => x.name === 'volume24h').hidden = false;
      this.columns.find(x => x.name === 'symbol').hidden = false;
    }
  }

  checkScreenIsSm() {
    return this.mediaService.query('sm');
  }

  selectEvent(event: any) {
    localStorage.setItem(event.row.symbol, event.row.name);
    this.router.navigate([event.row.symbol], { relativeTo: this.route });
  }

  selectPriceByCurrency() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].price = this.data[i].prices[0].price;
    }
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    setTimeout(() => {
      this.fromRow = pagingEvent.fromRow;
      this.currentPage = pagingEvent.page;
      this.pageSize = pagingEvent.pageSize;
      this.filter();
    }, 3);
  }

  filter(): void {
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

  ngOnDestroy(): void {
    if (this.mediaSubscriptionSm) {
      this.mediaSubscriptionSm.unsubscribe();
    }
  }

}
