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
  create(newDevice: Devices) {
    return this.http.post<Devices[]>(`${this.baseUrl}/devices`, newDevice);
  }
  update(Id: number, updatedDevice: Devices) {
    return this.http.put<Devices[]>(
      `${this.baseUrl}/devices/${Id}`,
      updatedDevice
    );
  }
  createOrUpdate(device: Devices) {
    if (device.Id === 0) return this.create(device);
    else return this.update(device.Id, device);
  }
  deleteById(Id: number) {
    return this.http.delete<Devices[]>(`${this.baseUrl}/devices/${Id}`);
  }
}
