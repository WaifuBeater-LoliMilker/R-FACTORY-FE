import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../runtime';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    protected http: HttpClient,
    @Inject(BASE_URL) protected baseUrl: string
  ) {}
  protected buildTree(data: TreeNode[]) {
    const map: { [key: number]: TreeNode } = {};
    const roots: TreeNode[] = [];

    data.forEach((item) => {
      map[item.Id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.ParentId && map[item.ParentId]) {
        map[item.ParentId].children!.push(map[item.Id]);
      } else {
        roots.push(map[item.Id]);
      }
    });

    return roots;
  }
}
export interface TreeNode {
  Id: number;
  ParentId?: number;
  [key: string]: any;
  children?: TreeNode[];
}
