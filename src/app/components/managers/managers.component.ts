import { Component, OnInit, Type, ViewChild } from '@angular/core';
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
import { DevicesComponent } from './devices/devices.component';
import { CommunicationComponent } from './communication/communication.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AreasComponent } from './areas/areas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
  //#region Properties
  isSideNavSideMode = false;
  isSideNavOpened = false;
  dashboard = DashboardComponent;
  areas = AreasComponent;
  devices = DevicesComponent;
  communication = CommunicationComponent;
  @ViewChild('tabContainer') tabContainer!: DynamicTabsComponent<any>;
  //#endregion

  //#region Constructor
  constructor(private auth: AuthService, private router: Router) {}
  //#endregion

  //#region Life cycle
  ngOnInit(): void {
    this.isSideNavSideMode =
      localStorage.getItem('is_sidenav_side_mode') == 'side';
    this.isSideNavOpened = localStorage.getItem('is_sidenav_opened') == 'true';
    setTimeout(() => {
      this.onAddTab('Dashboard', this.dashboard, true);
    })
  }
  //#endregion

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
  onAddTab(title: string, content: Type<any>, passTabs: boolean = false) {
    const newId = 'tab_' + Math.random().toString(36).substring(2, 7);
    const existing = this.tabContainer.tabs.find((t) => t.title === title);
    this.tabContainer.tabs.forEach((t) => (t.active = false));

    if (existing) {
      existing.active = true;
      this.tabContainer.scrollToTab(existing.id);
    } else {
      this.tabContainer.tabs.push({
        id: newId,
        title,
        content,
        active: true,
        passTabs,
      });
      setTimeout(() => this.tabContainer.scrollToTab(newId), 0); //fuck Angular, fuck you
    }

    const navlinks = document.querySelectorAll('[data-tab-name]');
    navlinks.forEach((link) => {
      const isActive = link.getAttribute('data-tab-name') === title;
      link.classList.toggle('active', isActive);
    });

    if (!this.isSideNavSideMode && this.isSideNavOpened) {
      this.isSideNavOpened = false;
    }
  }

  onLogOut() {
    this.auth
      .logout()
      .subscribe({
        error: (err) => {
          console.error(err.message);
        },
      })
      .add(() => this.router.navigateByUrl('/login'));
  }
}
