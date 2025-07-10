import { Component, OnInit, TemplateRef } from '@angular/core';
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
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { RefreshableDirective } from '../../../directives/refreshData.directive';
import { FormsModule } from '@angular/forms';
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
  areas: Areas[] = [];
  columnNames: ColumnDefinition[] = [
    { title: 'Mã', field: 'areaCode' },
    { title: 'Tên', field: 'areaName', widthGrow: 1 },
  ];
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  areaValue: Areas = new Areas();

  constructor(
    private areasService: AreasService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.loadAreas();
  }
  loadAreas() {
    this.areasService.getAll().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Failed to load areas', err);
      },
    });
  }
  openModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  onRefresh() {
    this.loadAreas();
    console.log('Areas reloaded');
  }
  save(modal: NgbActiveModal) {
    this.areasService.create(this.areaValue).subscribe({
      error: (err) => {
        console.error('Failed to create area', err);
      },
      complete: () => {
        this.loadAreas();
      },
    });
    modal.close();
  }
}
