import { Injectable } from '@angular/core';
import { Property } from '../models/property';
import { HttpClient } from '@angular/common/http';
import { Observable, map, delay, tap, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

interface PriceResponse {
  total: number;
  land: {
    total: number;
    base: number;
    location: number;
  };
  building: {
    total: number;
    base: number;
    age: number;
  };
}

interface PriceBreakdown {
  total: number;
  land: {
    total: number;
    base: number;
    orientation: number;
    shape: number;
    station: number;
    road: number;
  };
  building: {
    total: number;
    base: number;
    type: number;
    age: number;
  };
}

interface ApiResponse {
  coef: string;
  value_x: number;
  value_y: number;
  m: number;
}

@Injectable({
  providedIn: 'root'
})
export class PriceCalculatorService {
  private apiUrl = environment.apiUrl;
  private isLoading = false;

  constructor(private http: HttpClient) {}

  getLoadingState(): boolean {
    return this.isLoading;
  }

  calculatePrice(formData: any): Observable<PriceResponse> {
    return this.http.post<PriceResponse>(`${this.apiUrl}/predict`, formData).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error calculating price:', error);
        return of({
          total: 0,
          land: {
            total: 0,
            base: 0,
            location: 0
          },
          building: {
            total: 0,
            base: 0,
            age: 0
          }
        });
      })
    );
  }

} 