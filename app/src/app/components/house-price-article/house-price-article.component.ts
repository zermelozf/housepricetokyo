import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { ModelScoresHistogramComponent } from '../model-scores-histogram/model-scores-histogram.component';

// Add MathJax type declaration
declare global {
  interface Window {
    MathJax?: {
      typeset: (elements: Array<Element>) => void;
    };
  }
}

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
    LandValueEvolutionChartComponent,
    ModelScoresHistogramComponent
  ],
  templateUrl: './house-price-article.component.html',
  styleUrls: ['./house-price-article.component.scss']
})
export class HousePriceArticleComponent implements AfterViewInit {
  @ViewChild('formulaContainer') formulaContainer!: ElementRef;
  @ViewChild('houseFormulaContainer') houseFormulaContainer!: ElementRef;
  @ViewChild('landFormulaContainer') landFormulaContainer!: ElementRef;
  @ViewChild('articleContainer') articleContainer!: ElementRef;

  ngAfterViewInit() {
    this.renderFormulas();
  }

  private renderFormulas() {
    // Render main formula
    if (this.formulaContainer && window.MathJax) {
      this.formulaContainer.nativeElement.textContent = `$$
      \\begin{align}
      y =&  \\space \\text{P}(\\text{house}) + \\text{P}(\\text{land})
      \\end{align}
      $$`;
    }

    // Render house price formula
    if (this.houseFormulaContainer && window.MathJax) {
      this.houseFormulaContainer.nativeElement.textContent = `$$
      \\begin{align}
      \\text{P}(\\text{house}) =& \\Big[\\sum_{m \\in \\text{material}}\\Big(\\alpha^1_m - \\alpha_m^2 \\cdot \\text{age} \\Big) + \\sum_{y \\in \\text{year}}\\alpha_y \\Big] \\cdot m^2_h
      \\end{align}
      $$`;
    }

    // Render land price formula
    if (this.landFormulaContainer && window.MathJax) {
      this.landFormulaContainer.nativeElement.textContent = `$$
      \\begin{align}
      \\text{P}(\\text{land}) =& \\Big[\\sum_{t\\in{\\text{type}}}\\beta_t + \\sum_{c \\in \\text{city}}\\beta_{c} + \\sum_{o \\in \\text{orient}}\\beta_o + \\sum_{s \\in \\text{shape}}\\beta_s + \\sum_{y \\in \\text{year}}\\beta_y \\Big] \\cdot m^2_l.
      \\end{align}
      $$`;
    }

    // Tell MathJax to typeset all formulas
    setTimeout(() => {
      if (window.MathJax && window.MathJax.typeset) {
        // First process all formula containers
        const formulaElements = [
          this.formulaContainer.nativeElement,
          this.houseFormulaContainer.nativeElement,
          this.landFormulaContainer.nativeElement
        ].filter(el => el != null);
        
        window.MathJax.typeset(formulaElements);
        
        // Then process the inline math elements
        const mathElements = document.querySelectorAll('.math');
        if (mathElements.length > 0) {
          window.MathJax.typeset(Array.from(mathElements));
        }
      }
    }, 100); // Slightly longer timeout to ensure the DOM is ready
  }

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