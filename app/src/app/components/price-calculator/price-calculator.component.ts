import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PriceCalculatorService } from '../../services/price-calculator.service';
import { AreaService } from '../../services/area.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';
import { AnalyticsService } from '../../services/analytics.service';
import { RouterModule } from '@angular/router';

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

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.css']
})
export class PriceCalculatorComponent implements OnInit {
  propertyForm: FormGroup;
  priceBreakdown: PriceResponse | null = null;
  isLoading = false;
  areas: string[] = [];
  showModal = false;

  // Property type options
  propertyTypes = ['Land', 'House & Land'];

  // Location options
  wards: string[] = [];
  cities: string[] = [];

  buildingTypes = ['木造', '軽量鉄骨造', '鉄骨造', 'NA'];
  orientations = ['北', '南', '西', '南西', '東', '南東', '北西', '北東', '接面道路無'];
  shapes = ['台形', 'ほぼ長方形', '袋地等', 'ほぼ正方形', '不整形', '長方形', 'ほぼ整形', 'ほぼ台形', '正方形'];
  floorRatios = [150, 200, 300];
  buildingRatios = [60, 80];

  constructor(
    private fb: FormBuilder,
    private priceCalculatorService: PriceCalculatorService,
    private areaService: AreaService,
    private dialog: MatDialog,
    private analyticsService: AnalyticsService
  ) {
    this.propertyForm = this.fb.group({
      propertyType: ['House & Land', Validators.required],
      ward: ['渋谷区', Validators.required],
      city: ['渋谷', Validators.required],
      landArea: [100, [Validators.required, Validators.min(0)]],
      buildingArea: [100, [Validators.required, Validators.min(0)]],
      yearBuilt: [2020, [Validators.required, Validators.min(1900)]],
      buildingType: ['木造', Validators.required],
      nearest: [10, [Validators.required, Validators.min(0)]],
      houseRatio: [60, [Validators.required, Validators.pattern('^(60|80)$')]],
      landRatio: [150, [Validators.required, Validators.pattern('^(150|200|300)$')]],
      road: [4, [Validators.required, Validators.min(0)]],
      orientation: ['南', Validators.required],
      shape: ['正方形', Validators.required]
    });
  }

  ngOnInit(): void {
    this.wards = this.areaService.getWards();

    if (this.wards.length > 0) {
      this.propertyForm.patchValue({ ward: this.wards[0] });
      this.updateCities();
    }

    // Watch for ward changes to update cities
    this.propertyForm.get('ward')?.valueChanges.subscribe(ward => {
      this.updateCities();
    });

    // Watch for form changes to calculate price
    this.propertyForm.valueChanges.subscribe(() => {
      if (this.propertyForm.valid) {
        this.calculatePrice();
      }
    });
  }

  private updateCities(): void {
    const ward = this.propertyForm.get('ward')?.value;
    if (ward) {
      this.cities = this.areaService.getCities(ward);
      // Set default city if available
      if (this.cities.length > 0) {
        this.propertyForm.patchValue({ city: this.cities[0] });
      }
    }
  }

  private calculatePrice(): void {
    this.isLoading = true;

    // Transform form data to match backend expectations
    const formData = this.propertyForm.value;
    const requestData = {
      is_new: formData.yearBuilt === new Date().getFullYear(),
      is_house: formData.propertyType === 'House & Land',
      house_m2: formData.buildingArea,
      land_m2: formData.landArea,
      building_type: formData.buildingType,
      age: new Date().getFullYear() - formData.yearBuilt,
      nearest_station_name: formData.city, // Using city as station name for now
      nearest_station_minutes: formData.nearest,
      building_ratio: `${formData.houseRatio}.0`,
      floor_ratio: `${formData.landRatio}.0`,
      land_shape: formData.shape,
      orientation: formData.orientation,
      road: formData.road,
      date: new Date().getFullYear() - 2020
    };

    this.priceCalculatorService.calculatePrice(requestData).subscribe({
      next: (response) => {
        this.priceBreakdown = response;
        this.isLoading = false;
        if (this.priceBreakdown) {
          this.analyticsService.logPriceCalculation(
            this.propertyForm.get('propertyType')?.value,
            this.propertyForm.get('ward')?.value,
            this.priceBreakdown.total
          );
        }
      },
      error: (error) => {
        console.error('Error calculating price:', error);
        this.isLoading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    const percentage = (value / total) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  getBarWidth(value: number, total: number): number {
    if (!total) return 0;
    return this.getPercentage(this.getAbsoluteValue(value), total);
  }

  getBarClass(value: number): string {
    if (!value) return '';
    return value > 0 ? 'positive' : 'negative';
  }

  openModal(msg: string) {
    this.dialog.open(DialogComponent, {
      data: {
        message: msg
      }
    });
  }
}