import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  CellComponent,
  ColumnDefinition,
  Options,
  TabulatorFull as Tabulator,
} from 'tabulator-tables';

@Component({
  selector: 'tabulator-table-single',
  template: `
    <div
      #tableContainer
      class="table-bordered border-primary tabulator-table"
    ></div>
  `,
})
export class TabulatorTableSingleComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() tableData: any[] = [];
  @Input() hasSeclection = true;
  @Input() columnNames: ColumnDefinition[] = [];
  @Input() height = '100%';

  /** Emits whenever the selection changes */
  @Output() rowSelectionChanged = new EventEmitter<any[]>();

  @ViewChild('tableContainer', { static: true })
  private tableContainer!: ElementRef<HTMLDivElement>;

  private table?: Tabulator;

  ngAfterViewInit() {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.table) return;
    if (changes['tableData']) {
      this.table.replaceData(this.tableData);
    }
    if (changes['columnNames']) {
      this.table.setColumns(this.columnNames);
    }
    if (changes['height']) {
      this.table.setHeight(this.height);
    }
  }

  ngOnDestroy() {
    this.table?.destroy();
  }

  private initializeTable() {
    const options: Options = {
      data: this.tableData,
      reactiveData: true,
      columns: this.columnNames,
      pagination: true,
      paginationSize: 10,
      layout: 'fitDataStretch',
      height: this.height,
      selectableRows: true,
    };

    if (this.hasSeclection) {
      options.rowHeader = {
        headerSort: false,
        resizable: false,
        frozen: true,
        headerHozAlign: 'center',
        hozAlign: 'center',
        formatter: 'rowSelection',
        titleFormatter: 'rowSelection',
        cellClick: (_e: MouseEvent, cell: CellComponent) =>
          cell.getRow().toggleSelect(),
        width: 30,
      };
    } else {
      options.selectableRows = 1;
    }

    this.table = new Tabulator(
      this.tableContainer.nativeElement,
      options
    );
    this.table.on('rowSelectionChanged', (data: any[]) => {
      this.rowSelectionChanged.emit(data);
    });
  }

  /** Get current selections */
  public getSelectedRows(): any[] {
    return this.table ? this.table.getSelectedData() : [];
  }

  /** Get current selection */
  public getSelectedRow(): any | null {
    const sel = this.getSelectedRows();
    return sel.length ? sel[0] : null;
  }
}
