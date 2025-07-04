/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabulatorTableComponent } from './tabulator-tables.component';

describe('TabulatorTableComponent', () => {
  let component: TabulatorTableComponent;
  let fixture: ComponentFixture<TabulatorTableComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ TabulatorTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabulatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
