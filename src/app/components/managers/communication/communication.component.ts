import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TabulatorTableSingleComponent } from '../../_shared/tabulator-table/tabulator-tables.component';
import { Communication } from '../../../models/communication';
import { CommunicationService } from '../../../services/managers/communication.service';
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
  comm: Communication[] = [];
  columnNames: ColumnDefinition[] = [
    { title: 'Tên kiểu truyền thông', field: 'CommunicationName' },
    { title: 'Mô tả', field: 'Description', widthGrow: 1 },
  ];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  commFormValue: Communication = new Communication();
  @ViewChild('tblComp', { static: false })
  tblComp!: TabulatorTableSingleComponent;
  @ViewChild('btnDelete', { static: false })
  btnDelete!: ElementRef<HTMLButtonElement>;
  //#endregion

  constructor(
    private communicationService: CommunicationService,
    private modalService: NgbModal,
    private toastHelper: ToastHelper //private toastr : ToastrService
  ) {}
  //#endregion

  //#region Life cycle
  ngOnInit() {
    this.loadCommunication();
  }
  //#endregion
  loadCommunication() {
    this.communicationService.getAll().subscribe({
      next: (data) => {
        this.comm = data;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      },
    });
  }
  openModal(content: TemplateRef<any>, isEditing = false) {
    const selected = this.tblComp.getSelectedRow();
    if (isEditing && !selected) return;
    this.commFormValue = isEditing
      ? new Communication(selected)
      : new Communication();
    this.modalService.open(content, { centered: true });
  }
  onRefresh() {
    this.loadCommunication();
    console.log('data reloaded');
  }
  save(modal: NgbActiveModal) {
    this.communicationService.createOrUpdate(this.commFormValue).subscribe({
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
    const selected = this.tblComp.getSelectedRow();
    if (!selected) return;
    this.btnDelete.nativeElement.classList.add('disabled');

    this.toastHelper.showToast(
      'error',
      'Xác nhận xóa?',
      '✔',
      () => {
        this.communicationService.deleteById(selected.Id).subscribe({
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
}
