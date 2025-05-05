import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-building-ratio-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #buildingRatioChart></canvas>
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
export class BuildingRatioChartComponent implements AfterViewInit {
  @ViewChild('buildingRatioChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model
  private readonly data = [
    { ratio: 30, value: -16401.25 },
    { ratio: 40, value: -8404.35 },
    { ratio: 50, value: -29085.37 },
    { ratio: 60, value: 0 }, // Reference point
    { ratio: 80, value: 35684.42 }
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
          label: 'Impact on Land Value per m²',
          data: this.data.map(d => d.value),
          backgroundColor: this.data.map(d => {
            if (d.ratio === 60) return 'rgba(255, 99, 132, 0.8)'; // Highlight reference ratio
            return d.value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
          }),
          borderColor: this.data.map(d => {
            if (d.ratio === 60) return 'rgb(255, 99, 132)';
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
            text: 'Impact of Building Ratio (建ぺい率) on Land Value',
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
                yMin: '60%',
                yMax: '60%',
                borderColor: 'rgba(0, 0, 0, 0.87)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Reference Ratio (60%)',
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
              text: 'Building Ratio (建ぺい率)'
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