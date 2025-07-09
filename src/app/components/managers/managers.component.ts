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
import { DeviceParametersComponent } from './device-parameters/device-parameters.component';
import { CommunicationComponent } from './communication/communication.component';
import { CommunicationParamComponent } from './communication-param/communication-param.component';
import { CommunicationParamConfigComponent } from './communication-param-config/communication-param-config.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AreasComponent } from './areas/areas.component';
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
  tabs: Tab<any>[] = [];
  areas = AreasComponent;
  devices = DevicesComponent;
  deviceParameters = DeviceParametersComponent;
  communication = CommunicationComponent;
  communicationParam = CommunicationParamComponent;
  communicationParamConfig = CommunicationParamConfigComponent;
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
  onAddTab(title: string, content: Type<any>) {
    const newId = 'tab_' + Math.random().toString(36).substring(2, 7);
    this.tabs.forEach((t) => (t.active = false));
    const existed = this.tabs.find((t) => t.title == title);
    if (existed) {
      existed.active = true;
      this.tabContainer.scrollToTab(existed.id);
      return;
    }
    this.tabs.push({
      id: newId,
      title: title,
      content: content,
      active: true,
    });
    this.tabContainer.scrollToTab(newId);
  }
  onLogOut() {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (err) => {
        console.error(err.message);
      },
    });
  }
}
