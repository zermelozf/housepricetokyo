import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PriceResponse {
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
  found: boolean;
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
          },
          found: true
        });
      })
    );
  }

} 