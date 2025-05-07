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
    { year: 2013, landValue: 419391.27 },
    { year: 2014, landValue: 381048.37 },
    { year: 2015, landValue: 418888.90 },
    { year: 2016, landValue: 462905.53 },
    { year: 2017, landValue: 471387.26 },
    { year: 2018, landValue: 476492.59 },
    { year: 2019, landValue: 453696.27 },
    { year: 2020, landValue: 492416.90 },
    { year: 2021, landValue: 534521.14 },
    { year: 2022, landValue: 581930.05 },
    { year: 2023, landValue: 612402.41 },
    { year: 2024, landValue: 615161.57 }
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
            pointHoverRadius: 6
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
            text: 'Evolution of Land Values per Square Meter in Tokyo',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `Land Value: ¥${value.toLocaleString('ja-JP')} per m²`;
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
            title: {
              display: true,
              text: 'Land Value per m² (¥)'
            },
            ticks: {
              callback: (value) => `¥${Number(value).toLocaleString('ja-JP')}`
            }
          }
        }
      }
    });
  }
} 