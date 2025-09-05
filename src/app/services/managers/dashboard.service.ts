import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { ChartData } from '../../models/chartData';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  getActivePowerData() {
    return this.http.get<ChartData>(`${this.baseUrl}/dashboard/active-power`);
  }
}
