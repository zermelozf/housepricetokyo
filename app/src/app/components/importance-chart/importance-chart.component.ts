import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-importance-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #importanceChart></canvas>
    </div>
  `,
  styles: [`
    .graph-container {
      width: 100%;
      height: 400px;
      margin: 2rem 0;
    }
  `]
})
export class ImportanceChartComponent implements AfterViewInit {
  @ViewChild('importanceChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model
  private readonly factorImportance = {
    'location': 237471.48,
    'land': 469938.90,
    'house': 372560.80,
    'building_type': 32624.77,
    'orientation': 28645.38,
    'land_shape': 25705.53,
    'age': 9493.81
  };

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Sort factors by importance
    const sortedFactors = Object.entries(this.factorImportance)
      .sort((a, b) => b[1] - a[1]);

    // Prepare data for the chart
    const labels = sortedFactors.map(([factor]) => this.formatLabel(factor));
    const values = sortedFactors.map(([_, value]) => value);
    
    // Generate gradient colors from high to low importance
    const colors = this.generateColors(values.length);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Importance (¥ per m²)',
            data: values,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.7', '1')),
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',  // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Relative Importance of Factors in Property Valuation',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `¥${value.toLocaleString('ja-JP')} per m²`;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Effect on Property Value (¥ per m²)'
            },
            ticks: {
              callback: (value) => `¥${Number(value).toLocaleString('ja-JP')}`
            }
          },
          y: {
            title: {
              display: false
            }
          }
        }
      }
    });
  }

  private formatLabel(factor: string): string {
    // Convert snake_case to Title Case with nice formatting
    const formattedLabels: Record<string, string> = {
      'location': 'Neighborhood',
      'land': 'Plot Size',
      'house': 'House Size',
      'building_type': 'Construction Type',
      'orientation': 'Property Orientation',
      'land_shape': 'Land Shape',
      'age': 'Building Age'
    };

    return formattedLabels[factor] || factor.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateColors(count: number): string[] {
    // Generate a gradient of colors from high importance (blue) to low importance (light blue)
    const baseColor = [75, 192, 192]; // RGB for teal/blue
    
    return Array.from({ length: count }, (_, i) => {
      const opacity = 0.9 - (i / count) * 0.4; // Gradient from 0.9 to 0.5 opacity
      return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.7)`;
    });
  }
} 