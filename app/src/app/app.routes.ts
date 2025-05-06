import { Routes } from '@angular/router';
import { PriceCalculatorComponent } from './components/price-calculator/price-calculator.component';
import { TokyoMapComponent } from './components/tokyo-map/tokyo-map.component';
import { HousePriceArticleComponent } from './components/house-price-article/house-price-article.component';

export const routes: Routes = [
  { path: '', component: PriceCalculatorComponent },
  { path: 'map', component: TokyoMapComponent },
  { path: 'article', component: HousePriceArticleComponent },
  { path: 'story', component: HousePriceArticleComponent },
  { path: '**', redirectTo: '' }
]; 