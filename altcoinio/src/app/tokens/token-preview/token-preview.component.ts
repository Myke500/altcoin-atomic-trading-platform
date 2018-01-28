import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {QuoteService} from "../../services/quote.service";
import {Observable} from "rxjs/Observable";
import {ChartModel, ChartSerie} from "../../models/chart-model";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/app.state";
import * as quoteSelector from "../../selectors/quote.selector";



@Component({
  selector: 'app-token-preview',
  templateUrl: './token-preview.component.html',
  styleUrls: ['./token-preview.component.scss']
})
export class TokenPreviewComponent implements OnInit {
  @Input() token;

  contentLoaded = false;
  chartPrice = true;
  chartVolume = false;
  chartMarket = false;
  tokenPrice;
  tokenPerc;
  statsLoaded = false;

  public $charts: Observable<ChartModel[]>;
  public multi: ChartModel[] = [];

  // chart options
  public showXAxis = false;
  public scaleType = "linear";
  public showYAxis = false;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = false;
  public showYAxisLabel = false;

  public colorScheme = {
    domain: ['#B2DFDB', '#4DB6AC', '#009688', '#AAAAAA']
  };

  constructor(private store: Store<AppState>,public quoteService: QuoteService, private cd: ChangeDetectorRef) {  
  }

  ngOnInit() {
    this.getCoinStats();
    this.getChartData();
    this.updateChart();  
  }

  getChartData(){
    this.$charts = this.quoteService.getHistory(this.token.name, "90day").map(e => {
      let chart: ChartModel[] = [];
      chart.push(TokenPreviewComponent.parseMap(e, "PRICE", "price"));
      chart.push(TokenPreviewComponent.parseMap(e, "VOLUME", "volume"));
      chart.push(TokenPreviewComponent.parseMap(e, "MARKET CAP", "market_cap"));
      return chart;
    });
  }

  getCoinStats(){
    const quotes = this.store.select(quoteSelector.getQuotes);
    quotes.subscribe((q) => {
      if(!!q){
        var coinStats = q.get(this.token.name);
        this.tokenPrice = coinStats.price;
        this.tokenPerc = coinStats.perc;
        this.statsLoaded = true;
      }
    });
  }

  updateChart(){
    this.$charts.subscribe((data) => {
      this.multi = [];
      if(this.chartPrice)
        this.multi.push(data[0]);
      if(this.chartVolume)
        this.multi.push(data[1]);
      if(this.chartMarket)
        this.multi.push(data[2]);
      this.contentLoaded = true;
    });
  }

  public static parseMap(obj: any, label: string, field: string): ChartModel {
    let priceModel = {} as ChartModel;
    priceModel.name = label;

    priceModel.series = obj[field].map(price => {
      let serie = {} as ChartSerie;
      serie.name = new Date(price[0]);
      serie.value = price[1];
      return serie;
    });

    return priceModel;
  }

  onSelect(event) {
    console.log(event);
  }
}