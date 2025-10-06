import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { EFConnectionBehavior, FFlowModule } from '@foblex/flow';
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
  nodeClass?: string;
  style?: any;
  data?: { info: Info[] };
}
@Component({
  selector: 'manager-dashboard',
  imports: [CommonModule, NgxEchartsDirective, FFlowModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit {
  //#region Properties
  orgData!: OrgNode & { children?: OrgNode[] };
  nodes: Array<any> = [];
  topLeftChartOptions = {};
  topRightChartOptions = {};
  topCenterChartOption = {};
  bottomRightChartOption = {};
  eConnectionBehaviour = EFConnectionBehavior;
  //endregion
  //#region Constructor
  constructor(private dashboardService: DashboardService) {}
  //endregion
  get rootId() {
    return this.orgData.id;
  }
  //#region Life cycle
  ngOnInit() {
    // this.dashboardService.getActivePowerData().subscribe({
    //   next: (result) => {},
    // });
    this.orgData = {
      id: 'root',
      name: 'Toàn xưởng',
      nodeClass: 'root',
      style: { color: '#fff' },
      children: [
        {
          id: 'd1',
          name: 'Tiện (điều hoà)',
          nodeClass: 'org-node-1 small',
          data: {
            info: [
              { label: 'Mất CB 1', value: '1.9%' },
              { label: 'Mất CB 2', value: '2.5%' },
              { label: 'Điện áp', value: '≈210.7V' },
              { label: 'Hệ số', value: '0.870' },
            ],
          },
        },
        {
          id: 'd2',
          name: 'Xưởng dập',
          nodeClass: 'org-node-2 small',
          data: {
            info: [
              { label: 'Dòng dư', value: '1A' },
              { label: 'Điện áp', value: '220V' },
              { label: 'Dòng', value: '6.94A' },
              { label: 'Công suất', value: '300W' },
            ],
          },
        },
        {
          id: 'd3',
          name: 'Tiện (chiếu sáng)',
          nodeClass: 'org-node-3 small',
          data: {
            info: [
              { label: 'Điện áp', value: '220V' },
              { label: 'Dòng', value: '10A' },
              { label: 'Công suất', value: '2200W' },
              { label: 'Hệ số', value: '0.9' },
            ],
          },
        },
        {
          id: 'd4',
          name: 'Tiện Khu B',
          nodeClass: 'org-node-4 small',
          data: {
            info: [
              { label: 'Điện áp', value: '380V' },
              { label: 'Dòng', value: '10A' },
              { label: 'Công suất', value: '3800W' },
              { label: 'Hệ số', value: '0.9' },
            ],
          },
        },
        {
          id: 'd5',
          name: 'Xưởng hàn',
          nodeClass: 'org-node-5 small',
          data: {
            info: [
              { label: 'Điện áp', value: '230V' },
              { label: 'Dòng', value: '15A' },
              { label: 'Công suất', value: '3450W' },
              { label: 'Hệ số', value: '0.88' },
            ],
          },
        },
        {
          id: 'd6',
          name: 'Xưởng sơn',
          nodeClass: 'org-node-6 small',
          data: {
            info: [
              { label: 'Điện áp', value: '220V' },
              { label: 'Dòng', value: '8A' },
              { label: 'Công suất', value: '1760W' },
              { label: 'Hệ số', value: '0.92' },
            ],
          },
        },
      ],
    };
    const children = this.orgData?.children ?? [];
    const cols = 3;
    const spacingX = 260;
    const spacingY = 180;
    const startX = 80;
    const centerX = startX + Math.floor(cols / 2) * spacingX - 10;
    const centerY = 240;
    this.nodes.push({
      ...{
        id: this.orgData.id,
        name: this.orgData.name,
        nodeClass: this.orgData.nodeClass,
        style: this.orgData.style,
      },
      pos: { x: centerX, y: centerY + 40 },
      isRoot: true,
    });
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

    const barData = [1000, 1500, 1300, 900, 700];
    const total = barData.reduce((sum, val) => sum + val, 0);
    let cumulative = 0;
    const cumulativePercent = barData.map((val) => {
      cumulative += val;
      return ((cumulative / total) * 100).toFixed(2);
    });
    this.topLeftChartOptions = {
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
      legend: {
        data: ['Công suất (W)', 'Tổng %'],
        textStyle: { color: '#ffffff' },
      },
      xAxis: {
        data: [
          'Thiết bị 1',
          'Thiết bị 2',
          'Thiết bị 3',
          'Thiết bị 4',
          'Thiết bị 5',
        ],
        axisLabel: {
          color: '#ffffff',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Công suất (W)',
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
          name: 'Công suất (W)',
          type: 'bar',
          data: barData,
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
    this.topRightChartOptions = {
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
          data: [
            {
              value: 11000,
              name: 'Xưởng dập',
              itemStyle: { color: '#FF7043' },
            },
            {
              value: 4000,
              name: 'Xưởng gia công',
              itemStyle: { color: '#42A5F5' },
            },
            {
              value: 2300,
              name: 'Xưởng lắp ráp',
              itemStyle: { color: '#66BB6A' },
            },
            {
              value: 300,
              name: 'Xưởng ép nhựa',
              itemStyle: { color: '#AB47BC' },
            },
          ],
        },
      ],
    };
    this.topCenterChartOption = {
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
        right: '35%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [
          '10/12',
          '10/13',
          '10/14',
          '10/15',
          '10/16',
          '10/17',
          '10/18',
          '10/19',
          '10/20',
        ],
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
          name: 'Trong tháng',
          type: 'line',
          smooth: true,
          data: [200, 180, 220, 240, 210, 230, 250, 220, 210],
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#4CAF50' },
          lineStyle: { color: '#4CAF50', width: 2 },
        },
        {
          name: 'Tháng trước',
          type: 'line',
          smooth: true,
          data: [800, 780, 820, 860, 810, 830, 870, 820, 815],
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#42A5F5' },
          lineStyle: { color: '#42A5F5', width: 2 },
        },
      ],
      graphic: [
        {
          type: 'group',
          right: 10,
          top: 80,
          children: [
            {
              type: 'rect',
              shape: { width: 200, height: 100 },
              style: {
                fill: '#1c1f2e',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            },
            {
              type: 'text',
              style: {
                text: 'Mức thay đổi: 1,6838.9 kWh',
                x: 10,
                y: 20,
                fill: '#fff',
                font: '14px sans-serif',
              },
            },
            {
              type: 'text',
              style: {
                text: 'Tỉ lệ thay đổi: 1.98%',
                x: 10,
                y: 45,
                fill: '#4CAF50',
                font: '14px sans-serif',
              },
            },
          ],
        },
      ],
    };
    this.bottomRightChartOption = {
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
      legend: {
        data: ['Tháng trước', 'Tháng này'],
        textStyle: { color: '#ffffff' },
      },
      xAxis: {
        data: [
          'Thiết bị 1',
          'Thiết bị 2',
          'Thiết bị 3',
          'Thiết bị 4',
          'Thiết bị 5',
        ],
        axisLabel: {
          color: '#ffffff',
        },
      },
      yAxis: {
        axisLabel: {
          color: '#ffffff',
        },
      },
      series: [
        {
          name: 'Tháng trước',
          type: 'bar',
          data: [100, 180, 130, 160, 140],
          itemStyle: {
            color: '#FF9800',
          },
        },
        {
          name: 'Tháng này',
          type: 'bar',
          data: [120, 200, 150, 190, 170],
          itemStyle: {
            color: '#1976D2',
          },
        },
      ],
    };
  }
  //endregion
}
