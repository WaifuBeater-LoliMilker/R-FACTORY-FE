export class Devices {
  Id: number = 0;
  AreaId: number = 0;
  DeviceName: string = '';
  Description: string = '';
  IsActive: boolean = false;
  AreaName: string = '';

  constructor(init?: Partial<Devices>) {
    Object.assign(this, init);
  }
}
