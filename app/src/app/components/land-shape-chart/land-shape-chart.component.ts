import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-land-shape-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #landShapeChart></canvas>
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
export class LandShapeChartComponent implements AfterViewInit {
  @ViewChild('landShapeChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model, sorted by impact
  private readonly data = [
    { shape: '袋地等', value: -62303.79 },
    { shape: '不整形', value: -61348.87 },
    { shape: '台形', value: -15023.35 },
    { shape: 'ほぼ台形', value: -14777.03 },
    { shape: 'ほぼ正方形', value: -10234.35 },
    { shape: 'ほぼ整形', value: -7947.20 },
    { shape: '正方形', value: 0 },
    { shape: 'ほぼ長方形', value: 2551.74 },
    { shape: '長方形', value: 2887.39 }
  ].sort((a, b) => a.value - b.value);

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.map(d => d.shape),
        datasets: [{
          label: 'Impact on Land Value per m²',
          data: this.data.map(d => d.value),
          backgroundColor: this.data.map(d => {
            if (d.shape === '正方形') return 'rgba(255, 99, 132, 0.8)'; // Highlight reference shape
            return d.value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
          }),
          borderColor: this.data.map(d => {
            if (d.shape === '正方形') return 'rgb(255, 99, 132)';
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
            text: 'Impact of Land Shape on Land Value (正方形 as Reference)',
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
                yMin: '正方形',
                yMax: '正方形',
                borderColor: 'rgba(0, 0, 0, 0.87)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Reference Shape (正方形)',
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
              text: 'Land Shape'
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