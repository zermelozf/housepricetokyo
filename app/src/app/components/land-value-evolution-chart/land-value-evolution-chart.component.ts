import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-land-value-evolution-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #landValueEvolutionChart></canvas>
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
export class LandValueEvolutionChartComponent implements AfterViewInit {
  @ViewChild('landValueEvolutionChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Data from the model, sorted chronologically
  private readonly data = [
    { year: 2013, landValue: 425100.81, houseValue: 60522.78 },
    { year: 2014, landValue: 398549.73, houseValue: 120179.31 },
    { year: 2015, landValue: 417360.46, houseValue: 135508.05 },
    { year: 2016, landValue: 460072.34, houseValue: 123749.16 },
    { year: 2017, landValue: 472924.30, houseValue: 139000.82 },
    { year: 2018, landValue: 478180.56, houseValue: 156068.16 },
    { year: 2019, landValue: 461382.57, houseValue: 169096.50 },
    { year: 2020, landValue: 492800.38, houseValue: 149933.55 },
    { year: 2021, landValue: 534398.52, houseValue: 159117.28 },
    { year: 2022, landValue: 584582.72, houseValue: 171540.59 },
    { year: 2023, landValue: 609861.81, houseValue: 175655.47 },
    { year: 2024, landValue: 619905.77, houseValue: 180540.70 }
  ];

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.map(d => d.year.toString()),
        datasets: [
          {
            label: 'Land Value per m²',
            data: this.data.map(d => d.landValue),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'House Value per m²',
            data: this.data.map(d => d.houseValue),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1'
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
            text: 'Evolution of Land and House Values per Square Meter in Tokyo',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const datasetLabel = context.dataset.label;
                return `${datasetLabel}: ¥${value.toLocaleString('ja-JP')} per m²`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Land Value per m² (¥)'
            },
            ticks: {
              callback: (value) => `¥${Number(value).toLocaleString('ja-JP')}`
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'House Value per m² (¥)'
            },
            ticks: {
              callback: (value) => `¥${Number(value).toLocaleString('ja-JP')}`
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
} 