import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { DashboardService } from '../../../services/managers/dashboard.service';
import {
  EFConnectionBehavior,
  FFlowComponent,
  FFlowModule,
} from '@foblex/flow';
import { Tab } from '../../_shared/dynamic-tabs/dynamic-tabs.component';
import { DeviceDetailsChartsComponent } from '../device-details-charts/device-details-charts.component';

echarts.use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
]);

interface Info {
  label: string;
  value: string;
}

interface OrgNode {
  id: string;
  name: string;
  inputs?: any;
  nodeClass?: string;
  style?: any;
  data?: { info: Info[] };
  children?: OrgNode[];
}

@Component({
  selector: 'manager-dashboard',
  imports: [CommonModule, NgxEchartsDirective, FFlowModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit, OnDestroy {
  //#region Properties
  orgData: OrgNode | null = null;
  nodes: Array<any> = [];
  topLeftChartOptions = {};
  topRightChartOptions = {};
  topCenterChartOption = {};
  bottomRightChartOption = {};
  eConnectionBehaviour = EFConnectionBehavior;
  isReady = false;
  deviceDetailsChart = DeviceDetailsChartsComponent;

  @ViewChild('orgChart') orgChart!: FFlowComponent;
  @ViewChild('activePowerChart', { static: false })
  activePowerChart!: ElementRef;
  activePowerChartInstance: echarts.ECharts | null = null;

  @ViewChild('electricUsageChart', { static: false })
  electricUsageChart!: ElementRef;
  electricUsageChartInstance: echarts.ECharts | null = null;

  @ViewChild('energyConsumption', { static: false })
  energyConsumption!: ElementRef;
  energyConsumptionInstance: echarts.ECharts | null = null;

  @ViewChild('wasteOutputChart', { static: false })
  wasteOutputChart!: ElementRef;
  wasteOutputChartInstance: echarts.ECharts | null = null;

  @Input() dynamicTabs!: any;

  private refreshInterval = 10000; // 10 seconds
  private refreshIntervals: any[] = [];
  //endregion

  //#region Constructor
  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}
  //endregion

  //#region Life cycle
  ngOnInit() {
    this.initializeOrgChart();
    this.loadAllChartData();
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    this.cleanup();
  }
  //endregion

  //#region Chart Initialization Methods
  private initializeOrgChart() {
    const cols = 3;
    const spacingX = 260;
    const spacingY = 150;
    const startX = 120;
    const centerX = startX + Math.floor(cols / 2) * spacingX - 12;
    const centerY = 180;

    this.nodes.push({
      id: 'root',
      name: 'Toàn xưởng',
      nodeClass: 'root',
      style: { color: '#fff' },
      pos: { x: centerX, y: centerY + 35 },
      isRoot: true,
    });

    this.dashboardService.getOrgChartData().subscribe({
      next: (result) => {
        this.orgData = {
          id: 'root',
          name: 'Toàn xưởng',
          nodeClass: 'root',
          style: { color: '#fff' },
          children: [],
        };

        result.forEach((r, idx) => {
          this.orgData?.children?.push({
            id: `d${idx + 1}`,
            inputs: r.DeviceId,
            name: r.DeviceName,
            nodeClass: `org-node-${idx + 1} small`,
            data: {
              info: [
                { label: 'Tổng công suất (kW)', value: r.SumCongSuat || '0' },
                {
                  label: 'Tổng công suất tiêu thụ (kWh)',
                  value: r.SumCongSuatTieuThu || '0',
                },
              ],
            },
          });
        });

        const children = this.orgData?.children ?? [];
        const half = Math.ceil(children.length / 2);
        const topChildren = children.slice(0, half);
        const bottomChildren = children.slice(half);

        topChildren.forEach((c, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = startX + col * spacingX;
          const y = centerY - spacingY - row * spacingY;
          this.nodes.push({
            ...c,
            pos: { x, y },
            isRoot: false,
            connector: 'bottom',
          });
        });

        bottomChildren.forEach((c, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = startX + col * spacingX;
          const y = centerY + spacingY + row * spacingY;
          this.nodes.push({
            ...c,
            pos: { x, y },
            isRoot: false,
            connector: 'top',
          });
        });

        this.isReady = true;
        this.cdr.detectChanges();
      },
    });
  }

  private loadAllChartData() {
    this.loadActivePowerChart();
    this.loadEnergyConsumptionChart();
    this.loadElectricUsageChart();
    this.loadWasteOutputChart();
  }

  private setupAutoRefresh() {
    this.clearRefreshIntervals();

    this.refreshIntervals.push(
      setInterval(() => this.loadActivePowerChart(), this.refreshInterval)
    );
    this.refreshIntervals.push(
      setInterval(() => this.loadEnergyConsumptionChart(), this.refreshInterval)
    );
    this.refreshIntervals.push(
      setInterval(() => this.loadElectricUsageChart(), this.refreshInterval)
    );
    this.refreshIntervals.push(
      setInterval(() => this.loadWasteOutputChart(), this.refreshInterval)
    );
  }

  private clearRefreshIntervals() {
    this.refreshIntervals.forEach((interval) => clearInterval(interval));
    this.refreshIntervals = [];
  }
  //endregion

  //#region Chart Loading Methods
  private loadActivePowerChart() {
    this.dashboardService.getActivePowerChartData().subscribe({
      next: (result) => {
        const deviceNames = result.map((r) => r.DeviceName);
        const values = result.map((r) => +r.SumCongSuat);
        const total = values.reduce((sum, val) => sum + val, 0);
        let cumulative = 0;
        const cumulativePercent = values.map((val) => {
          cumulative += val;
          return ((cumulative / total) * 100).toFixed(2);
        });

        const newOptions = {
          title: {
            text: 'ACTIVE POWER',
            textStyle: {
              color: '#ffffff',
              fontSize: 26,
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          xAxis: {
            data: deviceNames,
            axisLabel: {
              show: false,
            },
          },
          yAxis: [
            {
              type: 'value',
              name: 'Công suất (kW)',
              axisLabel: {
                color: '#ffffff',
              },
            },
            {
              type: 'value',
              name: 'Tổng %',
              min: 0,
              max: 100,
              position: 'right',
              axisLabel: {
                formatter: '{value} %',
                color: '#ffffff',
              },
            },
          ],
          series: [
            {
              name: 'Công suất (kW)',
              type: 'bar',
              data: values,
              itemStyle: {
                color: '#14B8A6',
              },
            },
            {
              name: 'Tổng %',
              type: 'line',
              yAxisIndex: 1,
              data: cumulativePercent,
              smooth: true,
              lineStyle: {
                color: '#FF9800',
                width: 3,
              },
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#FF9800',
              },
            },
          ],
        };

        this.updateChartInstance(
          this.activePowerChartInstance,
          this.activePowerChart,
          newOptions
        );
        this.topLeftChartOptions = newOptions;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading active power chart:', error);
      },
    });
  }

  private loadEnergyConsumptionChart() {
    this.dashboardService.getEnergyConsumptionChartData().subscribe({
      next: (result) => {
        const colors = [
          '#FF7043',
          '#42A5F5',
          '#66BB6A',
          '#AB47BC',
          '#FFA726',
          '#29B6F6',
          '#9CCC65',
          '#8E24AA',
          '#FFCA28',
          '#26A69A',
          '#5C6BC0',
          '#FF8A65',
        ];

        const energyColorMap: Record<string, string> = {};
        let nextEnergyColorIndex = 0;

        const getColorForName = (name: string): string => {
          if (!name) name = 'unknown';
          if (energyColorMap[name]) return energyColorMap[name];
          const color = colors[nextEnergyColorIndex % colors.length];
          energyColorMap[name] = color;
          nextEnergyColorIndex++;
          return color;
        };

        const newOptions = {
          title: {
            text: 'ENERGY CONSUMPTION',
            left: 'center',
            top: 10,
            textStyle: {
              fontSize: 26,
              fontWeight: 'bold',
              color: '#ffffff',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} kWh ({d}%)',
          },
          legend: {
            orient: 'horizontal',
            right: 10,
            top: 'bottom',
            textStyle: { color: '#ffffff' },
          },
          series: [
            {
              name: 'Tỉ lệ',
              type: 'pie',
              radius: ['35%', '65%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 6,
                borderColor: '#0b0c1a',
                borderWidth: 2,
              },
              label: {
                show: true,
                position: 'inner',
                formatter: '{d}%',
                color: '#fff',
                fontSize: 12,
                fontWeight: 'bold',
              },
              labelLine: {
                show: true,
                length: 15,
                length2: 10,
                lineStyle: { color: '#aaa' },
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 18,
                  fontWeight: 'bold',
                  formatter: '{d}%',
                },
              },
              data: result.map((r) => ({
                value: +r.SumCongSuatTieuThu,
                name: r.DeviceName,
                itemStyle: { color: getColorForName(r.DeviceName) },
              })),
            },
          ],
        };

        this.updateChartInstance(
          this.energyConsumptionInstance,
          this.energyConsumption,
          newOptions
        );
        this.topRightChartOptions = newOptions;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading energy consumption chart:', error);
      },
    });
  }

  private loadElectricUsageChart() {
    this.dashboardService.getElectricUsageChartData().subscribe({
      next: (result) => {
        const newOptions = {
          title: {
            text: 'ELECTRIC USAGE',
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
          legend: {
            data: ['Trong tháng', 'Tháng trước'],
            top: 40,
            textStyle: { color: '#ffffff' },
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: result.Item1.map((item) => item.DayValue),
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
              name: 'Trong tháng',
              type: 'line',
              smooth: true,
              data: result.Item1.map((item) => item.LogValue),
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: { color: '#4CAF50' },
              lineStyle: { color: '#4CAF50', width: 2 },
            },
            {
              name: 'Tháng trước',
              type: 'line',
              smooth: true,
              data: result.Item2.map((item) => item.LogValue),
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: { color: '#42A5F5' },
              lineStyle: { color: '#42A5F5', width: 2 },
            },
          ],
        };

        this.updateChartInstance(
          this.electricUsageChartInstance,
          this.electricUsageChart,
          newOptions
        );
        this.topCenterChartOption = newOptions;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading electric usage chart:', error);
      },
    });
  }

  private loadWasteOutputChart() {
    this.dashboardService.getWasteOutputChartData().subscribe({
      next: (result) => {
        const newOptions = {
          title: {
            text: 'WASTE OUTPUT',
            textStyle: {
              color: '#ffffff',
              fontSize: 26,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: result.map((r) => r.Month),
            axisLabel: {
              color: '#ffffff',
              formatter: 'Tháng {value}',
            },
          },
          yAxis: {
            type: 'value',
            name: 'Nồng độ metal (ppm)',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: 12,
              padding: [0, 0, 0, 0],
            },
            axisLabel: {
              color: '#ffffff',
            },
          },
          series: [
            {
              name: 'Nồng độ metal (ppm)',
              type: 'bar',
              data: result.map((r) => +r.AvgValue),
              itemStyle: {
                color: '#1976D2',
              },
            },
          ],
        };

        this.updateChartInstance(
          this.wasteOutputChartInstance,
          this.wasteOutputChart,
          newOptions
        );
        this.bottomRightChartOption = newOptions;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading waste output chart:', error);
      },
    });
  }
  //endregion

  //#region Chart Instance Management
  private updateChartInstance(
    instance: echarts.ECharts | null,
    elementRef: ElementRef,
    options: any
  ) {
    if (instance && !instance.isDisposed()) {
      // Update existing instance
      instance.setOption(options, {
        notMerge: true, // Merge with existing options
        lazyUpdate: true, // Better performance
      });
    } else if (elementRef?.nativeElement) {
      // Create new instance if it doesn't exist
      instance = echarts.getInstanceByDom(elementRef.nativeElement) || null;
      if (!instance) {
        instance = echarts.init(elementRef.nativeElement);
      }
      instance.setOption(options);

      // Store the instance based on which chart it is
      if (elementRef === this.activePowerChart) {
        this.activePowerChartInstance = instance;
      } else if (elementRef === this.energyConsumption) {
        this.energyConsumptionInstance = instance;
      } else if (elementRef === this.electricUsageChart) {
        this.electricUsageChartInstance = instance;
      } else if (elementRef === this.wasteOutputChart) {
        this.wasteOutputChartInstance = instance;
      }
    }
  }

  private cleanup() {
    // Clear all refresh intervals
    this.clearRefreshIntervals();

    // Dispose all chart instances
    [
      this.activePowerChartInstance,
      this.energyConsumptionInstance,
      this.electricUsageChartInstance,
      this.wasteOutputChartInstance,
    ].forEach((instance) => {
      if (instance && !instance.isDisposed()) {
        instance.dispose();
      }
    });

    // Clear references
    this.activePowerChartInstance = null;
    this.energyConsumptionInstance = null;
    this.electricUsageChartInstance = null;
    this.wasteOutputChartInstance = null;
  }
  //endregion

  //#region Tab Management
  onAddTab(node: OrgNode, content: Type<any>) {
    const newId = 'tab_' + Math.random().toString(36).substring(2, 7);
    const existing = this.dynamicTabs.tabs.find(
      (t: Tab<Type<any>>) => t.title === node.name
    );
    this.dynamicTabs.tabs.forEach((t: Tab<Type<any>>) => (t.active = false));

    if (existing) {
      existing.active = true;
    } else {
      this.dynamicTabs.tabs = [
        ...this.dynamicTabs.tabs,
        {
          id: newId,
          title: 'Tổng hợp',
          content,
          active: true,
          passInputs: true,
          inputs: { deviceId: node.inputs },
        },
      ];
      this.dynamicTabs.onTabsChanged();
    }

    const navlinks = document.querySelectorAll('mat-nav-list>a');
    navlinks.forEach((link) => {
      const isActive = link.getAttribute('data-tab-name') === 'Tổng hợp';
      link.classList.toggle('active', isActive);
    });
  }
  //endregion
}
