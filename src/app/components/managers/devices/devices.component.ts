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
import { ColumnDefinition } from 'tabulator-tables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefreshableDirective } from '../../../directives/refreshData.directive';
import { FormsModule } from '@angular/forms';
import { ToastHelper } from '../../../services/toastHelper.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { AreasService } from '../../../services/managers/areas.service';
import { Areas } from '../../../models/areas';
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
  areas: Areas[] = [];
  columnNames: ColumnDefinition[] = [
    { title: 'Tên', field: 'DeviceName', width: '35%' },
    { title: 'Mô tả', field: 'Description', width: '25%' },
    { title: 'Khu vực', field: 'AreaName', width: '20%' },
    {
      title: 'Active',
      field: 'IsActive',
      formatter: 'tickCross',
      hozAlign: 'center',
      width: '10%',
    },
  ];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  deviceFormValue: Devices = new Devices();
  @ViewChild('tblComp', { static: false })
  tblComp!: TabulatorTableSingleComponent;
  @ViewChild('btnDelete', { static: false })
  btnDelete!: ElementRef<HTMLButtonElement>;
  //#endregion

  //#region Constructor
  constructor(
    private devicesService: DevicesService,
    private areasDevices: AreasService,
    private modalService: NgbModal,
    private toastHelper: ToastHelper //private toastr : ToastrService
  ) {}
  //#endregion

  //#region Life cycle
  ngOnInit() {
    this.loadDevices();
  }
  //#endregion

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
    this.areasDevices.getAll().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Failed to load areas', err);
      },
    });
  }
  openModal(content: TemplateRef<any>, isEditing = false) {
    const selected = this.tblComp.getSelectedRow() as Devices;
    if (isEditing && !selected) return;
    this.loadAreas();
    this.deviceFormValue = isEditing ? new Devices(selected) : new Devices();
    this.modalService.open(content, { centered: true });
  }
  onRefresh() {
    this.loadDevices();
    console.log('data reloaded');
  }
  save(modal: NgbActiveModal) {
    this.devicesService.createOrUpdate(this.deviceFormValue).subscribe({
      error: (err) => {
        console.error('Failed to call API:', err);
      },
      complete: () => {
        this.loadDevices();
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
}
