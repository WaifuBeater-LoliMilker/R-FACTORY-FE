import { Component, OnInit } from '@angular/core';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'dropdown',
  imports: [NgxSelectModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit {
  items: Items[] = [
    { id: 1, name: 'bruhman' },
    { id: 2, name: 'scatman' },
    { id: 3, name: 'batman' },
  ];
  selectedItem: Items = this.items[0];
  constructor() {}

  ngOnInit() {}
}
export interface Items {
  id: number;
  name: string;
}
