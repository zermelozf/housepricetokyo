import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-land-orientation-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #landOrientationChart></canvas>
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
export class LandOrientationChartComponent implements AfterViewInit {
  @ViewChild('landOrientationChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model, sorted by impact
  private readonly data = [
    { orientation: '接面道路無', value: -271131.19 },
    { orientation: '北西', value: -7407.48 },
    { orientation: '西', value: -6375.89 },
    { orientation: '北東', value: -5852.26 },
    { orientation: '南西', value: -1853.01 },
    { orientation: '北', value: 2615.61 },
    { orientation: '南東', value: 4668.67 },
    { orientation: '南', value: 4694.19 },
    { orientation: '東', value: 0 }
  ].sort((a, b) => a.value - b.value);

  private readonly referenceOrientation = '東';

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.map(d => d.orientation),
        datasets: [{
          label: '',
          data: this.data.map(d => d.value),
          backgroundColor: this.data.map(d => {
            if (d.orientation === this.referenceOrientation) return 'rgba(255, 99, 132, 0.8)'; // Highlight reference orientation
            return d.value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
          }),
          borderColor: this.data.map(d => {
            if (d.orientation === this.referenceOrientation) return 'rgb(255, 99, 132)';
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
          legend: {
            display: false
          },
          title: {
            display: true,
            text: `Impact of Land Orientation on Land Value (${this.referenceOrientation} as Reference)`,
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
                yMin: this.data.findIndex(d => d.orientation === this.referenceOrientation),
                yMax: this.data.findIndex(d => d.orientation === this.referenceOrientation),
                borderColor: 'rgba(0, 0, 0, 0.87)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: `Reference Orientation (${this.referenceOrientation})`,
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
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Land Orientation'
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