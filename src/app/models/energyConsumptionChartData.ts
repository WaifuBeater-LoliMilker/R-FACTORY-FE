export class EnergyConsumptionChartData {
  public DeviceName: string = '';
  public SumCongSuatTieuThu: string = '';
  constructor(init?: Partial<EnergyConsumptionChartData>) {
    Object.assign(this, init);
  }
}
