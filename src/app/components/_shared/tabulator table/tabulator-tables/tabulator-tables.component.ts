import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

@Component({
  selector: 'tabulator-table',
  templateUrl: './tabulator-tables.component.html',
  styleUrls: ['./tabulator-tables.component.css'],
})
export class TabulatorTableComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '100%';
  constructor() {}
  tab = document.createElement('div');
  ngOnChanges(changes: SimpleChanges): void {
    this.drawTable();
  }
  private drawTable(): void {
    new Tabulator(this.tab, {
      data: this.tableData,
      reactiveData: true,
      columns: this.columnNames,
      pagination: true,
      paginationSize: 10,
      layout: 'fitData',
      height: this.height,
      rowHeader: {
        headerSort: false,
        resizable: false,
        frozen: true,
        headerHozAlign: 'center',
        hozAlign: 'center',
        formatter: 'rowSelection',
        titleFormatter: 'rowSelection',
        cellClick: function (e, cell) {
          cell.getRow().toggleSelect();
        },
        width: 3,
      },
    });
    const table = document.getElementById('tabular-table');
    table!.appendChild(this.tab);
    this.tab.className = 'table-bordered border-primary';
  }
}
