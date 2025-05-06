import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceCalculatorComponent } from './components/price-calculator/price-calculator.component';
import { TokyoMapComponent } from './components/tokyo-map/tokyo-map.component';

const routes: Routes = [
  { path: '', component: PriceCalculatorComponent },
  { path: 'map', component: TokyoMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 