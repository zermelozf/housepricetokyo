import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-depreciation-graph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #depreciationChart></canvas>
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
export class DepreciationGraphComponent implements AfterViewInit {
  @ViewChild('depreciationChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Updated data from the model based on the latest coefficients
  private readonly data = {
    rc: {
      baseValue: 409244.65,          // C(building_type, contr.treatment('NA'))[ＲＣ]:house_m2
      depreciationRate: -13275.21    // C(building_type, contr.treatment('NA'))[ＲＣ]:age:house_m2
    },
    lightSteel: {
      baseValue: 231687.26,          // C(building_type, contr.treatment('NA'))[軽量鉄骨造]:house_m2
      depreciationRate: -12480.87    // C(building_type, contr.treatment('NA'))[軽量鉄骨造]:age:house_m2
    },
    src: {
      baseValue: 231613.18,          // C(building_type, contr.treatment('NA'))[ＳＲＣ]:house_m2
      depreciationRate: -10521.48    // C(building_type, contr.treatment('NA'))[ＳＲＣ]:age:house_m2
    },
    steel: {
      baseValue: 268189.09,          // C(building_type, contr.treatment('NA'))[鉄骨造]:house_m2
      depreciationRate: -9128.38     // C(building_type, contr.treatment('NA'))[鉄骨造]:age:house_m2
    },
    wooden: {
      baseValue: 152503.54,          // C(building_type, contr.treatment('NA'))[木造]:house_m2
      depreciationRate: -8325.36     // C(building_type, contr.treatment('NA'))[木造]:age:house_m2
    }
  };

  private readonly maxAge = 50;

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Generate data points for each building type
    const ages = Array.from({ length: this.maxAge + 1 }, (_, i) => i);
    
    const rcData = ages.map(age => 
      Math.max(0, this.data.rc.baseValue + (this.data.rc.depreciationRate * age))
    );
    
    const lightSteelData = ages.map(age => 
      Math.max(0, this.data.lightSteel.baseValue + (this.data.lightSteel.depreciationRate * age))
    );
    
    const srcData = ages.map(age => 
      Math.max(0, this.data.src.baseValue + (this.data.src.depreciationRate * age))
    );
    
    const steelData = ages.map(age => 
      Math.max(0, this.data.steel.baseValue + (this.data.steel.depreciationRate * age))
    );
    
    const woodenData = ages.map(age => 
      Math.max(0, this.data.wooden.baseValue + (this.data.wooden.depreciationRate * age))
    );

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ages.map(age => `${age}年`),
        datasets: [
          {
            label: 'ＲＣ',
            data: rcData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: '軽量鉄骨造',
            data: lightSteelData,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'ＳＲＣ',
            data: srcData,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: '鉄骨造',
            data: steelData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: '木造',
            data: woodenData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
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
            text: 'Building Value Depreciation by Type',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ¥${value.toLocaleString('ja-JP')} per m²`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Age (years)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value per m² (¥)'
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