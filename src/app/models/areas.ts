export class Areas {
  public Id: number = 0;
  public AreaCode: string = '';
  public AreaName: string = '';
  constructor(init?: Partial<Areas>) {
    Object.assign(this, init);
  }
}
