import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import {
  DynamicTabsComponent,
  Tab,
} from '../_shared/dynamic-tabs/dynamic-tabs.component';
import { OverviewComponent } from './overview/overview.component';

@Component({
  selector: 'app-managers',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CdkMenu,
    CdkMenuTrigger,
    DynamicTabsComponent,
  ],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css',
})
export class ManagersComponent implements OnInit {
  isSideNavSideMode = false;
  isSideNavOpened = false;
  tabs: Tab<any>[] = [];
  ngOnInit(): void {
    this.isSideNavSideMode =
      localStorage.getItem('is_sidenav_side_mode') == 'side';
    this.isSideNavOpened = localStorage.getItem('is_sidenav_opened') == 'true';
  }
  onDrawerOpenChange(open: boolean) {
    this.isSideNavOpened = open;
    localStorage.setItem('is_sidenav_opened', open.toString());
  }
  onDrawerModeChange() {
    this.isSideNavSideMode = !this.isSideNavSideMode;
    localStorage.setItem(
      'is_sidenav_side_mode',
      this.isSideNavSideMode ? 'side' : 'over'
    );
  }
  onAddTab(title: string, content: string | any = '') {
    const newId = 'tab_' + Math.random().toString(36).substring(2, 7);
    this.tabs.forEach((t) => (t.active = false));
    const existed = this.tabs.find((t) => t.title == title);
    if (existed) {
      existed.active = true;
      return;
    }
    this.tabs.push({
      id: newId,
      title: title,
      content: content,
      active: true,
    });
  }
}
