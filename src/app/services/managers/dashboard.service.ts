import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { OrgChartData } from '../../models/orgChartData';
import { ActivePowerChartData } from '../../models/activePowerChartData';
import { EnergyConsumptionChartData } from '../../models/energyConsumptionChartData';
import { WasteOutputChartData } from '../../models/wasteOutputChartData';
import { ElectricUsageChartData } from '../../models/electricUsageChartData';
import { DetailCharts } from '../../models/detailCharts';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  getOrgChartData() {
    return this.http.get<OrgChartData[]>(`${this.baseUrl}/dashboard/org-chart`);
  }
  getActivePowerChartData() {
    return this.http.get<ActivePowerChartData[]>(
      `${this.baseUrl}/dashboard/active-power-chart`
    );
  }
  getEnergyConsumptionChartData() {
    return this.http.get<EnergyConsumptionChartData[]>(
      `${this.baseUrl}/dashboard/energy-consumption-chart`
    );
  }
  getElectricUsageChartData() {
    return this.http.get<{
      Item1: ElectricUsageChartData[];
      Item2: ElectricUsageChartData[];
    }>(`${this.baseUrl}/dashboard/electric-usage-chart`);
  }
  getWasteOutputChartData() {
    return this.http.get<WasteOutputChartData[]>(
      `${this.baseUrl}/dashboard/waste-output-chart`
    );
  }
  getDetailChartData(dateOption: number, deviceId: number) {
    return this.http.get<{
      voltageData: DetailCharts[];
      amperageData: DetailCharts[];
      powerRateData: DetailCharts[];
      temperatureData: DetailCharts[];
      wasteOutputData: DetailCharts[];
    }>(
      `${this.baseUrl}/dashboard/details?date-option=${dateOption}&device-id=${deviceId}`
    );
  }
}
