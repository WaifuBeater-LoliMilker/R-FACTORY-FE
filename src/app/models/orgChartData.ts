export class OrgChartData {
  public DeviceName: string = '';
  public AvgDongDien: string = '';
  public SumCongSuat: string = '';
  public SumCongSuatTieuThu: string = '';
  constructor(init?: Partial<OrgChartData>) {
    Object.assign(this, init);
  }
}
