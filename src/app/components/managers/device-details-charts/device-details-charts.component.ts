import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { DashboardService } from '../../../services/managers/dashboard.service';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { Devices } from '../../../models/devices';
import { DevicesService } from '../../../services/managers/devices.service';
echarts.use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
]);
@Component({
  selector: 'app-device-details-charts',
  templateUrl: './device-details-charts.component.html',
  styleUrls: ['./device-details-charts.component.css'],
  imports: [NgxSelectModule, FormsModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
})
export class DeviceDetailsChartsComponent implements OnInit {
  @Input() deviceId!: number;
  yearValue = new Date().getFullYear();
  monthOptions: { value: number; label: string }[] = [
    { value: 0, label: 'Tất cả' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
  ];
  monthOptionValue = 0;
  devices: Devices[] = [];

  @ViewChild('powerRate', { static: false })
  powerRate!: ElementRef;
  powerRateInstance: echarts.ECharts | undefined | null = undefined;
  powerRateChartOption = {};
  @ViewChild('wasteOutput', { static: false })
  wasteOutput!: ElementRef;
  wasteOutputInstance: echarts.ECharts | undefined | null = undefined;
  wasteOutputChartOption = {};

  @Input() dynamicTabs!: any;
  constructor(
    private dashboardService: DashboardService,
    private devicesService: DevicesService
  ) {}

  ngOnInit() {
    this.devicesService.getAll().subscribe({
      next: (data) => {
        this.devices = data;
        if (!this.deviceId) {
          this.deviceId = data[0].Id;
        }
        this.loadData();
      },
    });
  }
  loadData() {
    this.dashboardService
      .getDetailsEnergyData(
        this.yearValue,
        this.monthOptionValue,
        this.deviceId
      )
      .subscribe({
        next: (powerRateData) => {
          this.powerRateChartOption = {
            title: {
              text: 'Công suất tiêu thụ',
              left: 'center',
              top: 10,
              textStyle: {
                fontSize: 26,
                fontWeight: 'bold',
                color: '#ffffff',
              },
            },
            tooltip: {
              trigger: 'axis',
              formatter: (p: any) =>
                `${p[0].axisValue}<br/>Công suất: ${p[0].data} kWh`,
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '10%',
              top: 30,
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: powerRateData.map((d) => d.XAxisValue),
              axisLabel: {
                color: '#ffffff',
              },
            },
            yAxis: {
              type: 'value',
              name: 'kWh',
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Công suất tiêu thụ',
                type: 'bar',
                data: powerRateData.map((d) => d.YAxisValue),
                itemStyle: { color: '#32cb37ff' },
              },
            ],
            textStyle: {
              fontFamily: 'Open Sans',
            },
          };
        },
      });
    this.dashboardService
      .getDetailsWasteOutputData(
        this.yearValue,
        this.monthOptionValue,
        this.deviceId
      )
      .subscribe({
        next: (wasteOutputData) => {
          this.wasteOutputChartOption = {
            title: {
              text: 'Khí thải',
              left: 'center',
              top: 10,
              textStyle: {
                fontSize: 26,
                fontWeight: 'bold',
                color: '#ffffff',
              },
            },
            tooltip: {
              trigger: 'axis',
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '10%',
              top: 30,
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: wasteOutputData.map((d) => d.XAxisValue),
              axisLabel: {
                color: '#ffffff',
              },
            },
            yAxis: {
              type: 'value',
              name: 'ppm',
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Khí thải',
                type: 'bar',
                data: wasteOutputData.map((d) => d.YAxisValue),
                itemStyle: { color: '#c02323ff' },
              },
            ],
            textStyle: {
              fontFamily: 'Open Sans',
            },
          };
        },
      });
  }
}
