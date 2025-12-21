import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Abastecimento } from '../models/abastecimento.model';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  private readonly apiUrl = 'http://localhost:3000/abastecimentos';

  constructor(private http: HttpClient) {}

  getAbastecimentos(): Observable<Abastecimento[]> {
    return this.http.get<Abastecimento[]>(this.apiUrl);
  }
}
