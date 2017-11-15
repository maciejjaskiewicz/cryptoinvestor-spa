import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { TdLoadingService } from '@covalent/core';
import { CoinChartService } from './coin-chart.service';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-coin-chart',
  templateUrl: './coin-chart.component.html',
  styleUrls: ['./coin-chart.component.scss']
})
export class CoinChartComponent implements OnInit, OnDestroy {
  @Input() coinSymbol: string;
  chart: AmChart;
  options: any;
  chartData: any;
  activePeriod = '1h';

  constructor(
    private AmCharts: AmChartsService,
    private loadingService: TdLoadingService,
    private chartService: CoinChartService,
    private dataPipe: DatePipe,
    private uppercasePipe: UpperCasePipe
  ) { }

  ngOnInit() {
    this.loadingService.register('chartLoading');
    this.coinSymbol = this.uppercasePipe.transform(this.coinSymbol);
    this.chartService.getData(this.coinSymbol, this.activePeriod).subscribe(
      (data) => {
        this.chartData = data;
        this.makeChart('mm', '10mm');
        this.loadingService.resolve('chartLoading');
      }
    );
  }

  changePerdiod(period: string) {
    switch (period) {
      case '1h':
        this.changeChart(period, 'mm', '10mm');
        break;
      case '1d':
        this.changeChart(period, '10mm', '30mm');
        break;
      case '1w':
        this.changeChart(period, 'hh', 'DD');
        break;
      case '1m':
        this.changeChart(period, '6hh', '4DD');
        break;
      case '3m':
        this.changeChart(period, 'DD', 'MM');
        break;
      case '6m':
        this.changeChart(period, 'DD', 'MM');
        break;
      case '1y':
        this.changeChart(period, 'DD', '2MM');
        break;
      case '3y':
        this.changeChart(period, '7DD', '6MM');
        break;
      case 'max':
        this.changeChart(period, '14DD', 'YY');
        break;
      default:
        this.changeChart('h1', 'mm', '10mm');
        break;
    }
  }

  changeChart(period: string, minPeriodOption: string, periodOption: string) {
    if (this.activePeriod === period) { return; }
    this.activePeriod = period;
    this.loadingService.register('chartLoading');
    this.chartService.getData(this.coinSymbol, period).subscribe(
      (data) => {
        this.chartData = data;
        if (data.length !== 0) {
          this.makeChart(minPeriodOption, periodOption);
        } else {
          this.changePerdiod('1h');
        }
        this.loadingService.resolve('chartLoading');
      }
    );
  }

  makeChart(minPeriod: string, period: string) {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
    this.formatDate(this.chartData);
    this.options = this.makeOptions(this.chartData, minPeriod, period);
    this.chart = this.AmCharts.makeChart('chartDiv', this.options);
  }

  formatDate(data: any) {
    for (let i = 0; i < data.length; i++ ) {
      const date = new Date(data[i].time * 1000);
      data[i].time = date;
    }
  }

  makeOptions(chartData: any, minPeriod: string, period: string) {
    return {
      'type': 'stock',
      'theme': 'light',
      'animationPlayed': true,
      'categoryAxesSettings': {
        'minPeriod': minPeriod,
        'maxSeries': chartData.length + 1
      },
      'dataSets': [ {
          'title': this.coinSymbol,
          'color': '#4527A0',
          'fieldMappings': [ {
            'fromField': 'close',
            'toField': 'value'
          }, {
            'fromField': 'volumeto',
            'toField': 'volume'
          } ],
          'dataProvider': chartData,
          'categoryField': 'time'
        }
      ],
      'panels': [ {
        'showCategoryAxis': false,
        'title': 'Value',
        'percentHeight': 70,
        'stockGraphs': [ {
          'id': 'g1',
          'valueField': 'value',
          'balloonText': 'CLose: <b>[[value]]</b> USD'
        } ],
        'stockLegend': {
          'periodValueTextRegular': '[[value.close]] USD'
        }
      }, {
        'title': 'Volume',
        'percentHeight': 30,
        'stockGraphs': [ {
          'valueField': 'volume',
          'type': 'column',
          'showBalloon': false,
          'fillAlphas': 1
        } ],
        'stockLegend': {
          'periodValueTextRegular': '[[value.close]]'
        }
      } ],
      'chartScrollbarSettings': {
        'graph': 'g1',
        'usePeriod': period,
      },
      'chartCursorSettings': {
        'valueBalloonsEnabled': true,
        'fullWidth': true,
        'cursorAlpha': 0.1,
        'valueLineBalloonEnabled': true,
        'valueLineEnabled': true,
        'valueLineAlpha': 0.5
      }
    };
  }

  ngOnDestroy() {
    this.AmCharts.destroyChart(this.chart);
  }

}
