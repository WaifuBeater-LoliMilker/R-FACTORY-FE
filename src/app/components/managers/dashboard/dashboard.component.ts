import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from 'gojs-angular';
import * as go from 'gojs';
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

@Component({
  selector: 'manager-dashboard',
  imports: [CommonModule, DiagramComponent, NgxEchartsDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit {
  //#region Properties
  nodeDataArray: Array<go.ObjectData> = [
    {
      key: 0,
      title: 'Toàn xưởng',
      details: '',
      color: '#1565C0',
    },
    {
      key: 1,
      parent: 0,
      title: 'Tiện (điều hoà)',
      details:
        'Mất cân bằng áp: -1.9%\nMất CB điện áp: -2.5%\nĐiện áp: ~210.7V\nHệ số công suất: 0.870',
      color: '#E53935',
    },
    {
      key: 2,
      parent: 0,
      title: 'Xưởng dập',
      details:
        'Dòng điện dư: -1A\nĐiện áp: 220V\nDòng điện: 6.94A\nCông suất: 300W',
      color: '#FB8C00',
    },
    {
      key: 3,
      parent: 0,
      title: 'Tiện (chiếu sáng)',
      details:
        'Điện áp: 220V\nDòng điện: 10A\nCông suất: 2200W\nHệ số công suất: 0.9',
      color: '#43A047',
    },
    {
      key: 4,
      parent: 0,
      title: 'Tiện Khu B',
      details:
        'Điện áp: 380V\nDòng điện: 10A\nCông suất: 3800W\nHệ số công suất: 0.9',
      color: '#3949AB',
    },
  ];
  linkDataArray: Array<go.ObjectData> = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
  ];
  topLeftChartOptions = {};
  topRightChartOptions = {};
  topCenterChartOption = {};
  bottomRightChartOption = {};
  //endregion
  //#region Constructor
  constructor(private dashboardService: DashboardService) {}
  //endregion
  //#region Life cycle
  ngOnInit() {
    this.dashboardService.getActivePowerData().subscribe({
      next: (result) => {},
    });

    this.topLeftChartOptions = {
      title: {
        text: 'ACTIVE POWER',
        textStyle: {
          color: '#ffffff',
          fontSize: 26,
        },
      },
      tooltip: {},
      xAxis: {
        data: ['Thiết bị 1', 'Thiết bị 2', 'Thiết bị 3'],
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
          name: 'Công suất (W)',
          type: 'bar',
          data: [1000, 1500, 1300],
          itemStyle: {
            color: '#1976D2',
          },
        },
        {
          name: 'Trend',
          type: 'line',
          data: [350, 950, 1400],
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
        text: 'ACTIVE POWER',
        textStyle: {
          color: '#ffffff',
          fontSize: 26,
        },
      },
      tooltip: {},
      xAxis: {
        data: ['Thiết bị 1', 'Thiết bị 2', 'Thiết bị 3'],
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
          name: 'Công suất (W)',
          type: 'bar',
          data: [1000, 1500, 1300],
          itemStyle: {
            color: '#1976D2',
          },
        },
      ],
    };
  }
  //endregion
  public initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true,
      layout: $(go.TreeLayout, {
        angle: 90,
        arrangement: go.TreeArrangement.Horizontal,
        nodeSpacing: 16,
        layerSpacing: 40,
      }),
    });

    diagram.model = $(go.GraphLinksModel, {
      linkKeyProperty: 'key',
      nodeDataArray: this.nodeDataArray,
      linkDataArray: this.linkDataArray,
    });

    // Node template with multiple text lines
    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { minSize: new go.Size(200, 150) },
      $(
        go.Shape,
        'RoundedRectangle',
        {
          strokeWidth: 1,
          stroke: '#666',
          portId: '',
          cursor: 'pointer',
          fill: '#1E88E5',
        },
        new go.Binding('fill', 'color')
      ),
      $(
        go.Panel,
        'Vertical',
        { margin: 6 },
        // Title (big & bold)
        $(
          go.TextBlock,
          {
            font: 'bold 12pt sans-serif',
            stroke: 'white',
            textAlign: 'center',
          },
          new go.Binding('text', 'title')
        ),
        // Separator line
        $(go.Shape, 'LineH', {
          stroke: 'rgba(255,255,255,0.5)',
          strokeWidth: 1,
          height: 1,
          stretch: go.GraphObject.Horizontal,
          margin: new go.Margin(2, 0, 2, 0),
        }),
        // Details (smaller text, can be multiple lines)
        $(
          go.TextBlock,
          {
            font: '10pt sans-serif',
            stroke: 'white',
            textAlign: 'left',
          },
          new go.Binding('text', 'details')
        )
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.Orthogonal, corner: 4 },
      $(go.Shape, { strokeWidth: 2, stroke: '#555' }),
      $(go.Shape, { toArrow: 'Triangle', fill: '#555', stroke: null })
    );

    return diagram;
  }
}
