import { Component, OnInit } from '@angular/core';
import { ManagersService } from '../../../services/managers/managers.service';
import { Factories } from '../../../models/factories';
import { TabulatorTableComponent } from '../../_shared/tabulator table/tabulator-tables/tabulator-tables.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPenToSquare, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [TabulatorTableComponent, FontAwesomeModule],
  selector: 'app-factories',
  templateUrl: './factories.component.html',
  styleUrls: ['./factories.component.css'],
})
export class FactoriesComponent implements OnInit {
  constructor(private service: ManagersService) {}
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faCopy = faCopy;
  faTrash = faTrash;
  factories: Factories[] = [];
  columnNames: any[] = [
    { title: 'Mã', field: 'code', width: 200 },
    {
      title: 'Tên',
      field: 'name',
      formatter: 'html',
      minWidth: '210px',
    },
  ];
  ngOnInit() {
    this.service.getAllFactories().subscribe({
      next: (data) => (this.factories = data),
      error: (err) => console.error('Failed to load factories', err),
    });
  }
}
