export class Transaction {
  public coinSymbol: string;
  public buyPrice: number;
  public amount: number;
  public date: Date;
  public sold: boolean;
  public soldPrice: number;

  constructor(coinSymbol: string, buyPrice: number, amount: number, date: Date) {
    this.coinSymbol = coinSymbol;
    this.buyPrice = buyPrice;
    this.amount = amount;
    this.date = date;

    this.sold = false;
    this.soldPrice = 0;
  }

  sell(soldPrice: number) {
    this.sold = true;
    this.soldPrice = soldPrice;
  }
}
