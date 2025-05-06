import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-floor-ratio-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #floorRatioChart></canvas>
    </div>
  `,
  styles: [`
    .graph-container {
      width: 100%;
      height: 600px;
      margin: 2rem 0;
    }
  `]
})
export class FloorRatioChartComponent implements AfterViewInit {
  @ViewChild('floorRatioChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model
  private readonly data = [
    { ratio: 60, value: -20479.21 },
    { ratio: 80, value: -80902.06 },
    { ratio: 100, value: -29110.95 },
    { ratio: 150, value: 0 }, // Reference point
    { ratio: 200, value: 27530.03 },
    { ratio: 300, value: 96412.94 },
    { ratio: 400, value: 361883.46 },
    { ratio: 500, value: 812684.55 },
    { ratio: 600, value: 1023642.55 },
    { ratio: 700, value: 1468429.83 },
    { ratio: 800, value: 1760246.32 }
  ].sort((a, b) => a.ratio - b.ratio);

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.map(d => `${d.ratio}%`),
        datasets: [{
          label: '',
          data: this.data.map(d => d.value),
          backgroundColor: this.data.map(d => {
            if (d.ratio === 150) return 'rgba(255, 99, 132, 0.8)'; // Highlight reference ratio
            return d.value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
          }),
          borderColor: this.data.map(d => {
            if (d.ratio === 150) return 'rgb(255, 99, 132)';
            return d.value >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)';
          }),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: 'Impact of Floor Ratio (容積率) on Land Value',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const prefix = value >= 0 ? '+' : '';
                return `${prefix}¥${value.toLocaleString('ja-JP')} per m²`;
              }
            }
          },
          annotation: {
            annotations: {
              referenceLine: {
                type: 'line',
                yMin: '150%',
                yMax: '150%',
                borderColor: 'rgba(0, 0, 0, 0.87)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Reference Ratio (150%)',
                  display: true,
                  position: 'start',
                  backgroundColor: 'transparent',
                  font: {
                    size: 12
                  },
                  color: 'rgba(0, 0, 0, 0.87)',
                  yAdjust: -10
                }
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Floor Ratio (容積率)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Impact on Land Value per m² (¥)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
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