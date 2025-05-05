import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-walking-time-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #walkingTimeChart></canvas>
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
export class WalkingTimeChartComponent implements AfterViewInit {
  @ViewChild('walkingTimeChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model coefficients, sorted by walking time
  private readonly data = [
    { minutes: 0, value: (-78912.92 + 517200.28) / 2 },
    { minutes: 1, value: (95931.60 + 124757.98) / 2 },
    { minutes: 2, value: (75811.93 + 121571.14) / 2 },
    { minutes: 3, value: (68981.20 + 92052.47) / 2 },
    { minutes: 4, value: (72546.75 + 98464.53) / 2 },
    { minutes: 5, value: (52133.66 + 85075.72) / 2 },
    { minutes: 6, value: (39956.41 + 83108.83) / 2 },
    { minutes: 7, value: (24213.76 + 33554.56) / 2 },
    { minutes: 8, value: (21709.70 + 55017.85) / 2 },
    { minutes: 9, value: (3859.22 + 54359.72) / 2 },
    { minutes: 10, value: (0 + 57362.19) / 2 }, // Reference point
    { minutes: 11, value: (-15638.93 + 20022.32) / 2 },
    { minutes: 12, value: (-35550.13 + 20120.43) / 2 },
    { minutes: 13, value: (-45517.37 + -2524.13) / 2 },
    { minutes: 14, value: (-50623.64 + 78090.83) / 2 },
    { minutes: 15, value: (-71470.39 + -52459.00) / 2 },
    { minutes: 16, value: (-82663.60 + -92036.69) / 2 },
    { minutes: 17, value: -96428.28 },
    { minutes: 18, value: (-101181.41 + -168444.18) / 2 },
    { minutes: 19, value: (-116036.75 + -232268.75) / 2 },
    { minutes: 20, value: (-122580.28 + -503570.96) / 2 },
    { minutes: 21, value: -133365.79 },
    { minutes: 22, value: -69718.08 },
    { minutes: 23, value: -148758.19 },
    { minutes: 24, value: -150372.29 },
    { minutes: 25, value: -155397.06 },
    { minutes: 26, value: -170968.00 },
    { minutes: 27, value: -140931.21 },
    { minutes: 28, value: (-165968.77 + 126967.80) / 2 },
    { minutes: 29, value: -174119.20 }
  ].sort((a, b) => a.minutes - b.minutes);

  ngAfterViewInit() {
    this.createChart();
  }

  private calculateLinearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Calculate linear regression
    const x = this.data.map(point => point.minutes);
    const y = this.data.map(point => point.value);
    const { slope, intercept } = this.calculateLinearRegression(x, y);
    
    // Generate trend line points
    const trendLineData = Array.from({ length: 31 }, (_, i) => ({
      x: i,
      y: slope * i + intercept
    }));

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Land Value Impact',
            data: this.data.map(point => ({
              x: point.minutes,
              y: point.value
            })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Trend Line',
            data: trendLineData,
            type: 'line',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: 'Impact of Walking Time to Station on Land Value (10 minutes as Reference)',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const point = context.raw as { x: number; y: number };
                const prefix = point.y >= 0 ? '+' : '';
                return `${context.dataset.label === 'Trend Line' ? 'Trend: ' : ''}${point.x} minutes: ${prefix}¥${point.y.toLocaleString('ja-JP')} per m²`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Walking Time to Station (minutes)'
            },
            min: 0,
            max: 30
          },
          y: {
            title: {
              display: true,
              text: 'Value Impact per m² (¥)'
            },
            ticks: {
              callback: (value) => {
                const numValue = Number(value);
                const prefix = numValue >= 0 ? '+' : '';
                return `${prefix}¥${numValue.toLocaleString('ja-JP')}`;
              }
            }
          }
        }
      }
    });
  }
} 