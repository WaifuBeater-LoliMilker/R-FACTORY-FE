import { Component, Input, Output, EventEmitter, Type } from '@angular/core';

@Component({
  selector: 'dynamic-tabs',
  standalone: true,
  templateUrl: './dynamic-tabs.component.html',
})
export class DynamicTabsComponent<T> {
  @Input() tabs: Tab<T>[] = [];
  @Output() tabsChange = new EventEmitter<Tab<T>[]>();
  @Output() tabRemoved = new EventEmitter<string>();
  @Output() tabSelected = new EventEmitter<Tab<T>>();

  selectTab(tabId: string) {
    this.tabs = this.tabs.map((t) => ({
      ...t,
      active: t.id === tabId,
    }));
    this.tabsChange.emit(this.tabs);
    this.tabSelected.emit(this.tabs.find((t) => t.id === tabId)!);
  }

  removeTab(tabId: string) {
    const newTabs = [...this.tabs];
    const idx = newTabs.findIndex((t) => t.id === tabId);
    if (idx === -1) return;

    const wasActive = newTabs[idx].active;
    newTabs.splice(idx, 1);

    if (wasActive && newTabs.length) {
      const newIndex = idx < newTabs.length ? idx : newTabs.length - 1;
      newTabs.forEach((t) => (t.active = false));
      newTabs[newIndex].active = true;
    }

    this.tabs = newTabs;
    this.tabsChange.emit(this.tabs);
    this.tabRemoved.emit(tabId);
  }
}

export interface Tab<T> {
  id: string;
  title: string;
  content: string | Type<T>;
  active: boolean;
}
