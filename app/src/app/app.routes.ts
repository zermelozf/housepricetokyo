import { Routes } from '@angular/router';
import { PriceCalculatorComponent } from './components/price-calculator/price-calculator.component';

export const routes: Routes = [
  { path: '', component: PriceCalculatorComponent },
  { path: '**', redirectTo: '' }
]; 