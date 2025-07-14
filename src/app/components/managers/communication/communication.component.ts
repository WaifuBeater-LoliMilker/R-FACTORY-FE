import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCopy,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ColumnDefinition } from 'tabulator-tables';
import { RefreshableDirective } from '../../../directives/refreshData.directive';
import { Communication } from '../../../models/communication';
import { CommunicationParam } from '../../../models/communicationParam';
import { CommunicationService } from '../../../services/managers/communication.service';
import { CommunicationParamService } from '../../../services/managers/communicationParam.service';
import { ToastHelper } from '../../../services/toastHelper.service';
import { TabulatorTableSingleComponent } from '../../_shared/tabulator-table/tabulator-tables.component';

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css'],
  imports: [
    TabulatorTableSingleComponent,
    FontAwesomeModule,
    RefreshableDirective,
    FormsModule,
  ],
})
export class CommunicationComponent implements OnInit {
  //#region Properties
  commMaster: Communication[] = [];
  commDetail: CommunicationParam[] = [];
  masterColumns: ColumnDefinition[] = [
    { title: 'Tên', field: 'CommunicationName' },
    { title: 'Mô tả', field: 'Description', widthGrow: 1 },
  ];
  detailColumns: ColumnDefinition[] = [
    { title: 'Tên', field: 'ParamKey' },
    { title: 'Kiểu dữ liệu', field: 'DataType' },
    {
      title: 'Bắt buộc',
      field: 'IsRequired',
      formatter: 'tickCross',
      hozAlign: 'center',
    },
    { title: 'Mô tả', field: 'Description' },
  ];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  commFormValue: Communication = new Communication();
  @ViewChild('tblMaster', { static: false })
  tblMaster!: TabulatorTableSingleComponent;
  @ViewChild('tblDetail', { static: false })
  tblDetail!: TabulatorTableSingleComponent;
  @ViewChild('btnDelete', { static: false })
  btnDelete!: ElementRef<HTMLButtonElement>;
  //#endregion

  //#region Constructor
  constructor(
    private commService: CommunicationService,
    private commParamService: CommunicationParamService,
    private modalService: NgbModal,
    private toastHelper: ToastHelper,
    private toastr: ToastrService
  ) {}
  //#endregion

  //#region Life cycle
  ngOnInit() {
    this.loadCommunication();
  }
  //#endregion
  loadCommunication() {
    this.commService.getAll().subscribe({
      next: (data) => {
        this.commMaster = data;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      },
    });
  }
  openModal(content: TemplateRef<any>, isEditing = false) {
    const selected = this.tblMaster.getSelectedRow();
    if (isEditing && !selected) return;
    this.commFormValue = isEditing
      ? new Communication(selected)
      : new Communication();
    this.modalService.open(content, { fullscreen: true });
  }
  onRefresh() {
    this.loadCommunication();
    console.log('data reloaded');
  }
  save(modal: NgbActiveModal) {
    this.commService.createOrUpdate(this.commFormValue).subscribe({
      error: (err) => {
        console.error('Failed to call API:', err);
      },
      complete: () => {
        this.loadCommunication();
      },
    });
    modal.close();
  }
  onDelete() {
    const selected = this.tblMaster.getSelectedRow();
    if (!selected) return;
    this.btnDelete.nativeElement.classList.add('disabled');

    this.toastHelper.showToast(
      'error',
      'Xác nhận xóa?',
      '✔',
      () => {
        this.commService.deleteById(selected.Id).subscribe({
          complete: () => {
            this.loadCommunication();
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
  onMasterRowChanged() {
    const comm = this.tblMaster.getSelectedRow() as Communication;
    if (!comm) return;
    this.commParamService.getByCommunicationId(comm.Id).subscribe({
      next: (data) => {
        this.commDetail = data;
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.toastr.error('Tải dữ liệu thất bại', 'Thông báo');
      },
    });
  }
}
