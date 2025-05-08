import { Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private analytics: Analytics) {}

  logTechnicalDetailsToggle(showTechnicalDetails: boolean) {
    logEvent(this.analytics, 'technical_details_toggle', {
      show_technical_details: showTechnicalDetails
    });
  }

  logPriceCalculation(propertyType: string, ward: string, totalPrice: number) {
    logEvent(this.analytics, 'price_calculation', {
      property_type: propertyType,
      ward: ward,
      total_price: totalPrice
    });
  }

  logPageView(pageName: string) {
    logEvent(this.analytics, 'page_view', {
      page_name: pageName
    });
  }
} 