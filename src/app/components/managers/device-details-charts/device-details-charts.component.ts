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
  dateOptions: { value: number; label: string }[] = [
    { value: 1, label: '1 ngày' },
    { value: 2, label: '7 ngày' },
    { value: 3, label: '1 tháng' },
    { value: 4, label: 'Năm nay' },
  ];
  dateOptionValue = 1;
  @ViewChild('voltage', { static: false })
  voltage!: ElementRef;
  voltageInstance: echarts.ECharts | undefined | null = undefined;
  voltageChartOption = {};
  @ViewChild('amperage', { static: false })
  amperage!: ElementRef;
  amperageInstance: echarts.ECharts | undefined | null = undefined;
  amperageChartOption = {};
  @ViewChild('powerRate', { static: false })
  powerRate!: ElementRef;
  powerRateInstance: echarts.ECharts | undefined | null = undefined;
  powerRateChartOption = {};
  @ViewChild('temperature', { static: false })
  temperature!: ElementRef;
  temperatureInstance: echarts.ECharts | undefined | null = undefined;
  temperatureChartOption = {};
  @ViewChild('wasteOutput', { static: false })
  wasteOutput!: ElementRef;
  wasteOutputInstance: echarts.ECharts | undefined | null = undefined;
  wasteOutputChartOption = {};
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.dashboardService
      .getDetailChartData(this.dateOptionValue, this.deviceId)
      .subscribe({
        next: ({
          voltageData,
          amperageData,
          powerRateData,
          temperatureData,
          wasteOutputData,
        }) => {
          this.voltageChartOption = {
            title: {
              text: 'Điện áp',
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
                `${p[0].axisValue}<br/>Điện áp: ${p[0].data} V`,
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
              data: voltageData.map((d) => d.XAxisValue),
              axisLabel: {
                color: '#ffffff',
              },
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Điện áp',
                type: 'line',
                smooth: true,
                data: voltageData.map((d) => d.YAxisValue),
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#4CAF50' },
                lineStyle: { color: '#4CAF50', width: 2 },
              },
            ],
          };
          this.amperageChartOption = {
            title: {
              text: 'Dòng điện',
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
                `${p[0].axisValue}<br/>Dòng điện: ${p[0].data} A`,
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
              data: amperageData.map((d) => d.XAxisValue),
              axisLabel: {
                color: '#ffffff',
              },
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Dòng điện',
                type: 'line',
                smooth: true,
                data: amperageData.map((d) => d.YAxisValue),
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#4c81afff' },
                lineStyle: { color: '#4c81afff', width: 2 },
              },
            ],
          };
          this.powerRateChartOption = {
            title: {
              text: 'Công suất',
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
                `${p[0].axisValue}<br/>Công suất: ${p[0].data} kW`,
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
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Công suất',
                type: 'line',
                smooth: true,
                data: powerRateData.map((d) => d.YAxisValue),
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#cb3246ff' },
                lineStyle: { color: '#cb3246ff', width: 2 },
              },
            ],
          };
          this.temperatureChartOption = {
            title: {
              text: 'Nhiệt độ',
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
                `${p[0].axisValue}<br/>Nhiệt độ: ${p[0].data} °C`,
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
              data: temperatureData.map((d) => d.XAxisValue),
              axisLabel: {
                color: '#ffffff',
              },
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Nhiệt độ',
                type: 'line',
                smooth: true,
                data: temperatureData.map((d) => d.YAxisValue),
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#b4da39ff' },
                lineStyle: { color: '#b4da39ff', width: 2 },
              },
            ],
          };
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
              axisLabel: {
                color: '#ffffff',
              },
            },
            series: [
              {
                name: 'Khí thải',
                type: 'line',
                smooth: true,
                data: wasteOutputData.map((d) => d.YAxisValue),
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#af724cff' },
                lineStyle: { color: '#af724cff', width: 2 },
              },
            ],
          };
        },
      });
  }
}
