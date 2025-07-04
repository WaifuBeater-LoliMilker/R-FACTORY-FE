import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../app.config';
import { Factories } from '../../models/factories';

@Injectable({
  providedIn: 'root',
})
export class ManagersService {
  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {}
  getAllFactories() {
    return this.http.get<Factories[]>(`${this.baseUrl}/factories`);
  }
}
