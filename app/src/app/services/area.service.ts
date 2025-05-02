import { Injectable } from '@angular/core';
import areaData from './area.json';
import { Observable, of } from 'rxjs';

export interface AreaData {
  [ward: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private areaData: AreaData = areaData;
  private areas: string[] = [
    'Minato-ku',
    'Shibuya-ku',
    'Shinjuku-ku',
    'Chiyoda-ku',
    'Chuo-ku',
    'Meguro-ku',
    'Setagaya-ku',
    'Bunkyo-ku',
    'Taito-ku',
    'Sumida-ku'
  ];

  getWards(): string[] {
    return Object.keys(this.areaData);
  }

  getCities(ward: string): string[] {
    return this.areaData[ward] || [];
  }

  getAreas(): Observable<string[]> {
    return of(this.areas);
  }
} 