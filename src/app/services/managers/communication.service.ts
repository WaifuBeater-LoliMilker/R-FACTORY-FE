import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Communication } from '../../models/communication';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {}
  getAll() {
    return this.http.get<Communication[]>(`${this.baseUrl}/communication`);
  }
  getById(Id: number) {
    return this.http.get<Communication[]>(`${this.baseUrl}/communication/${Id}`);
  }
  create(newCommunication: Communication) {
    return this.http.post<Communication[]>(`${this.baseUrl}/communication`, newCommunication);
  }
  update(Id: number, updatedCommunication: Communication) {
    return this.http.put<Communication[]>(`${this.baseUrl}/communication/${Id}`, updatedCommunication);
  }
  createOrUpdate(comm: Communication) {
    if (comm.Id === 0) return this.create(comm);
    else return this.update(comm.Id, comm);
  }
  deleteById(Id: number) {
    return this.http.delete<Communication[]>(`${this.baseUrl}/communication/${Id}`);
  }
}
