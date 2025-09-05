export class ChartData {
  public Data: string[] = [];
  public XAxis: string[] = [];
  public YAxis:  string[] = [];
  constructor(init?: Partial<ChartData>) {
    Object.assign(this, init);
  }
}
