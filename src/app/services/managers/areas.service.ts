import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Areas } from '../../models/areas';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {}
  getAll() {
    return this.http.get<Areas[]>(`${this.baseUrl}/areas`);
  }
  getById(Id: number) {
    return this.http.get<Areas[]>(`${this.baseUrl}/areas/${Id}`);
  }
  create(newArea: Areas) {
    return this.http.post<Areas[]>(`${this.baseUrl}/areas`, newArea);
  }
  update(Id: number, updatedArea: Areas) {
    return this.http.put<Areas[]>(`${this.baseUrl}/areas/${Id}`, updatedArea);
  }
  createOrUpdate(area: Areas) {
    if (area.Id === 0) return this.create(area);
    else return this.update(area.Id, area);
  }
  deleteById(Id: number) {
    return this.http.delete<Areas[]>(`${this.baseUrl}/areas/${Id}`);
  }
}
