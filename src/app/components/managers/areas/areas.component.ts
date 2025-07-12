import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TabulatorTableSingleComponent } from '../../_shared/tabulator-table/tabulator-tables.component';
import { Areas } from '../../../models/areas';
import { AreasService } from '../../../services/managers/areas.service';
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
//import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
  imports: [
    TabulatorTableSingleComponent,
    FontAwesomeModule,
    RefreshableDirective,
    FormsModule,
  ],
})
export class AreasComponent implements OnInit {
  //#region Properties
  areas: Areas[] = [];
  columnNames: ColumnDefinition[] = [
    { title: 'Mã', field: 'AreaCode' },
    { title: 'Tên', field: 'AreaName', widthGrow: 1 },
  ];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  areaFormValue: Areas = new Areas();
  @ViewChild('tblComp', { static: false })
  tblComp!: TabulatorTableSingleComponent;
  @ViewChild('btnDelete', { static: false })
  btnDelete!: ElementRef<HTMLButtonElement>;
  //#endregion

  //#region Constructor
  constructor(
    private areasService: AreasService,
    private modalService: NgbModal,
    private toastHelper: ToastHelper //private toastr : ToastrService
  ) {}
  //#endregion

  //#region Life cycle
  ngOnInit() {
    this.loadAreas();
  }
  //#endregion
  loadAreas() {
    this.areasService.getAll().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      },
    });
  }
  openModal(content: TemplateRef<any>, isEditing = false) {
    const selected = this.tblComp.getSelectedRow();
    if (isEditing && !selected) return;
    this.areaFormValue = isEditing
      ? new Areas(selected)
      : new Areas();
    this.modalService.open(content, { centered: true });
  }
  onRefresh() {
    this.loadAreas();
    console.log('data reloaded');
  }
  save(modal: NgbActiveModal) {
    this.areasService.createOrUpdate(this.areaFormValue).subscribe({
      error: (err) => {
        console.error('Failed to call API:', err);
      },
      complete: () => {
        this.loadAreas();
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
        this.areasService.deleteById(selected.Id).subscribe({
          complete: () => {
            this.loadAreas();
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
