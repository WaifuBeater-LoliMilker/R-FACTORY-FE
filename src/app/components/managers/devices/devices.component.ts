import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TabulatorTableSingleComponent } from '../../_shared/tabulator-table/tabulator-tables.component';
import { Devices } from '../../../models/devices';
import { DevicesService } from '../../../services/managers/devices.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faPenToSquare,
  faCopy,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  CellComponent,
  ColumnDefinition,
  FilterFunction,
  RowRangeLookup,
} from 'tabulator-tables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefreshableDirective } from '../../../directives/refreshData.directive';
import { FormsModule } from '@angular/forms';
import { ToastHelper } from '../../../services/toastHelper.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { AreasService } from '../../../services/managers/areas.service';
import { Areas } from '../../../models/areas';
import { DeviceParam } from '../../../models/deviceParam';
import { DeviceParamService } from '../../../services/managers/deviceParam.service';
import { Communication } from '../../../models/communication';
import { BASE_URL } from '../../../app.config';
import { CommunicationService } from '../../../services/managers/communication.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  imports: [
    TabulatorTableSingleComponent,
    FontAwesomeModule,
    RefreshableDirective,
    FormsModule,
    NgxSelectModule,
    FormsModule,
  ],
})
export class DevicesComponent implements OnInit {
  //#region Properties
  devices: Devices[] = [];
  deviceParams: DeviceParam[] = [];
  communication: Communication[] = [];
  areas: Areas[] = [];
  deviceColumns: ColumnDefinition[] = [
    { title: 'Tên', field: 'DeviceName', width: '35%' },
    { title: 'Mô tả', field: 'Description', width: '25%' },
    { title: 'Khu vực', field: 'AreaName', width: '20%' },
    {
      title: 'Trạng thái',
      field: 'IsActive',
      formatter: 'tickCross',
      hozAlign: 'center',
      width: '10%',
    },
  ];
  deviceParamsColumns: ColumnDefinition[] = [];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  deviceFormValue: Devices = new Devices();
  @ViewChild('tblComp', { static: false })
  tblComp!: TabulatorTableSingleComponent;
  @ViewChild('tblModalDetail', { static: false })
  tblModalDetail!: TabulatorTableSingleComponent;
  @ViewChild('btnDelete', { static: false })
  btnDelete!: ElementRef<HTMLButtonElement>;
  @ViewChild('paramValues', { static: false })
  paramModal!: TemplateRef<any>;
  //#endregion

  //#region Constructor
  constructor(
    private devicesService: DevicesService,
    private areasSevices: AreasService,
    private commService: CommunicationService,
    private deviceParamService: DeviceParamService,
    private modalService: NgbModal,
    private toastHelper: ToastHelper //private toastr : ToastrService
  ) {}
  //#endregion

  //#region Life cycle
  ngOnInit() {
    this.loadDevices();
  }
  //#endregion
  initCol(): ColumnDefinition[] {
    return [
      {
        title: 'Kiểu truyền thông',
        field: 'CommunicationId',
        width: '21%',
        editor: 'list',
        editorParams: {
          values: this.communication.map((c) => ({
            value: c.Id,
            label: c.CommunicationName,
          })),
          multiselect: false,
          autocomplete: true,
        },
        formatter: (cell) => {
          const id = cell.getValue() as number;
          return (
            this.communication.find((c) => c.Id == id)?.CommunicationName ?? ''
          );
        },
      },
      { title: 'Tên tham số', field: 'ParamName', width: '18%', editor: true },
      { title: 'Đơn vị', field: 'Unit', width: '15%', editor: true },
      {
        title: 'Trạng thái',
        field: 'IsActive',
        formatter: 'tickCross',
        hozAlign: 'center',
        width: '15%',
        cellClick: function (_: Event, cell: CellComponent) {
          const currentValue = cell.getValue();
          cell.setValue(!currentValue);
        },
      },
      {
        title: 'Polling interval',
        field: 'PollingInterval',
        width: '20%',
        editor: true,
      },
    ];
  }
  loadDevices() {
    this.devicesService.getAll().subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => {
        console.error('Failed to load areas', err);
      },
    });
  }
  loadAreas() {
    this.areasSevices.getAll().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Failed to load areas', err);
      },
    });
  }
  loadDeviceParam(deviceId: number) {
    this.deviceParamService.getByDeviceId(deviceId).subscribe({
      next: (data) => {
        this.deviceParams = data;
      },
    });
  }
  openModal(content: TemplateRef<any>, isEditing = false) {
    const selected = this.tblComp.getSelectedRow() as Devices;
    if (isEditing && !selected) return;
    this.loadAreas();
    this.commService
      .getAll()
      .subscribe((data) => {
        this.communication = data;
      })
      .add(() => {
        this.deviceParamService
          .getByDeviceId(isEditing ? selected.Id : 0)
          .subscribe((data) => {
            this.deviceParams = data;
          })
          .add(() => {
            this.deviceFormValue = isEditing
              ? new Devices(selected)
              : new Devices();
            this.modalService.open(content, {
              fullscreen: true,
            });
          });
      });
  }
  onRefresh() {
    this.loadDevices();
    console.log('data reloaded');
  }
  save(modal: NgbActiveModal) {
    const isEditing = !!this.deviceFormValue.Id;
    this.devicesService.createOrUpdate(this.deviceFormValue).subscribe({
      error: (err) => {
        console.error('Failed to call API:', err);
      },
    });
    modal.close();
  }
  onDelete() {
    const selected = this.tblComp.getSelectedRow() as Devices;
    if (!selected) return;
    this.btnDelete.nativeElement.classList.add('disabled');

    this.toastHelper.showToast(
      'error',
      'Xác nhận xóa?',
      '✔',
      () => {
        this.devicesService.deleteById(selected.Id).subscribe({
          complete: () => {
            this.loadDevices();
            this.btnDelete.nativeElement.classList.remove('disabled');
          },
        });
      },
      '✖',
      () => {
        this.btnDelete.nativeElement.classList.remove('disabled');
      }
    );
  }
  onAddRow() {
    const newRow = new DeviceParam();
    newRow.DeviceId = this.deviceFormValue.Id;
    this.deviceParams.unshift(newRow);
  }
  onCellEdit(cell: CellComponent) {}
  onRefreshDetail() {}
  onTableBuildt() {
    this.tblModalDetail.table!.setColumns(this.initCol());
  }
  openParamModal() {
    this.modalService.open(this.paramModal, {
      centered: true,
    });
  }
}
