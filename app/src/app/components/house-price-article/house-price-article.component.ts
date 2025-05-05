import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokyoMapComponent } from '../tokyo-map/tokyo-map.component';
import { DepreciationGraphComponent } from '../depreciation-graph/depreciation-graph.component';
import { FloorRatioChartComponent } from '../floor-ratio-chart/floor-ratio-chart.component';
import { BuildingRatioChartComponent } from '../building-ratio-chart/building-ratio-chart.component';
import { LandShapeChartComponent } from '../land-shape-chart/land-shape-chart.component';
import { LandOrientationChartComponent } from '../land-orientation-chart/land-orientation-chart.component';
import { WalkingTimeChartComponent } from '../walking-time-chart/walking-time-chart.component';
import { LandValueEvolutionChartComponent } from '../land-value-evolution-chart/land-value-evolution-chart.component';

@Component({
  selector: 'app-house-price-article',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TokyoMapComponent,
    DepreciationGraphComponent,
    FloorRatioChartComponent,
    BuildingRatioChartComponent,
    LandShapeChartComponent,
    LandOrientationChartComponent,
    WalkingTimeChartComponent,
    LandValueEvolutionChartComponent
  ],
  templateUrl: './house-price-article.component.html',
  styleUrls: ['./house-price-article.component.scss']
})
export class HousePriceArticleComponent {
  // Data for the depreciation graph
  readonly depreciationData = {
    wooden: [
      { age: 0, value: 100 },
      { age: 10, value: 70 },
      { age: 20, value: 50 },
      { age: 30, value: 35 },
      { age: 40, value: 25 },
      { age: 50, value: 15 }
    ],
    concrete: [
      { age: 0, value: 100 },
      { age: 10, value: 85 },
      { age: 20, value: 75 },
      { age: 30, value: 65 },
      { age: 40, value: 55 },
      { age: 50, value: 45 }
    ],
    steel: [
      { age: 0, value: 100 },
      { age: 10, value: 80 },
      { age: 20, value: 65 },
      { age: 30, value: 55 },
      { age: 40, value: 45 },
      { age: 50, value: 35 }
    ]
  };

  // Data for the location impact graph
  readonly locationImpactData = {
    labels: ['Central Tokyo', 'Suburban Tokyo', 'Outer Tokyo'],
    values: [150, 100, 70]
  };

  // Data for the land characteristics impact
  readonly landCharacteristicsData = {
    size: [
      { size: 50, value: 80 },
      { size: 100, value: 100 },
      { size: 150, value: 120 },
      { size: 200, value: 140 }
    ],
    orientation: {
      north: 90,
      east: 100,
      south: 110,
      west: 95
    }
  };
} 