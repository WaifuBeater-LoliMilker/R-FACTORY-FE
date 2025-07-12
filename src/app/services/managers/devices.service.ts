import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Devices } from '../../models/devices';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {}
  getAll() {
    return this.http.get<Devices[]>(`${this.baseUrl}/devices`);
  }
  getById(Id: number) {
    return this.http.get<Devices[]>(`${this.baseUrl}/devices/${Id}`);
  }
  create(newArea: Devices) {
    return this.http.post<Devices[]>(`${this.baseUrl}/devices`, newArea);
  }
  update(Id: number, updatedArea: Devices) {
    return this.http.put<Devices[]>(
      `${this.baseUrl}/devices/${Id}`,
      updatedArea
    );
  }
  createOrUpdate(area: Devices) {
    if (area.Id === 0) return this.create(area);
    else return this.update(area.Id, area);
  }
  deleteById(Id: number) {
    return this.http.delete<Devices[]>(`${this.baseUrl}/devices/${Id}`);
  }
}
