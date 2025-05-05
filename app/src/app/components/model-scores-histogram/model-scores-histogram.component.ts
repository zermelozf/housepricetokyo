import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import annotationPlugin from 'chartjs-plugin-annotation';

interface ScoreData {
  model: string;
  test_neg_mean_absolute_percentage_error: number;
}

@Component({
  selector: 'app-model-scores-histogram',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <canvas #modelScoresHistogram></canvas>
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
export class ModelScoresHistogramComponent implements AfterViewInit {
  @ViewChild('modelScoresHistogram') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  private data: ScoreData[] = [];

  constructor(private http: HttpClient) {
    // Register the annotation plugin
    Chart.register(annotationPlugin);
  }

  ngAfterViewInit() {
    this.loadData();
  }

  private loadData() {
    this.http.get('/scores.csv', { responseType: 'text' })
      .subscribe(
        (csv) => {
          this.processData(csv);
          this.createChart();
        },
        (error) => {
          console.error('Error loading CSV data:', error);
        }
      );
  }

  private processData(csv: string) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const errorIndex = headers.indexOf('test_neg_mean_absolute_percentage_error');
    const modelIndex = headers.indexOf('model');

    if (errorIndex === -1 || modelIndex === -1) {
      console.error('CSV file does not contain required headers');
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      
      const values = lines[i].split(',');
      if (values.length > 1) {
        this.data.push({
          model: values[modelIndex],
          test_neg_mean_absolute_percentage_error: parseFloat(values[errorIndex])
        });
      }
    }
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedValues.length / 2);
    
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[midIndex - 1] + sortedValues[midIndex]) / 2;
    } else {
      return sortedValues[midIndex];
    }
  }

  private createChart() {
    if (!this.chartRef) return;
    
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Separate data by model
    const modelData = this.data.filter(item => item.model === 'model');
    const baselineData = this.data.filter(item => item.model === 'baseline');

    // Get error values (negate them since they are negative values)
    const modelErrors = modelData.map(item => -item.test_neg_mean_absolute_percentage_error);
    const baselineErrors = baselineData.map(item => -item.test_neg_mean_absolute_percentage_error);

    // Calculate median errors
    const modelMedian = this.calculateMedian(modelErrors);
    const baselineMedian = this.calculateMedian(baselineErrors);

    // Create histogram bins - using fixed range of 0 to 1 with 30 bins
    const numBins = 30;
    const minError = 0;
    const maxError = 1;
    const binWidth = (maxError - minError) / numBins;
    
    const bins = Array.from({ length: numBins }, (_, i) => minError + i * binWidth);
    
    // Count values in each bin
    const modelCounts = Array(numBins).fill(0);
    const baselineCounts = Array(numBins).fill(0);
    
    modelErrors.forEach(error => {
      // Clamp values to our range
      const clampedError = Math.max(minError, Math.min(maxError, error));
      const binIndex = Math.min(Math.floor((clampedError - minError) / binWidth), numBins - 1);
      modelCounts[binIndex]++;
    });
    
    baselineErrors.forEach(error => {
      // Clamp values to our range
      const clampedError = Math.max(minError, Math.min(maxError, error));
      const binIndex = Math.min(Math.floor((clampedError - minError) / binWidth), numBins - 1);
      baselineCounts[binIndex]++;
    });

    // Create labels for the chart
    const labels = bins.map(bin => (bin * 100).toFixed(1));

    // Find the index that's closest to the median values
    const modelMedianIndex = Math.min(Math.floor((modelMedian - minError) / binWidth), numBins - 1);
    const baselineMedianIndex = Math.min(Math.floor((baselineMedian - minError) / binWidth), numBins - 1);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'This Article\'s Model',
            data: modelCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Basic Linear Regression',
            data: baselineCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Model Error Distribution (MAPE %)',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const item = tooltipItems[0];
                const binStart = parseFloat(item.label) / 100;
                const binEnd = binStart + binWidth;
                return `Error range: ${(binStart * 100).toFixed(1)}% - ${(binEnd * 100).toFixed(1)}%`;
              },
              label: (context) => {
                return `${context.dataset.label}: ${context.raw} samples`;
              }
            }
          },
          annotation: {
            annotations: {
              modelMedianLine: {
                type: 'line',
                xMin: modelMedianIndex,
                xMax: modelMedianIndex,
                yMin: 0,
                yMax: Math.max(...modelCounts, ...baselineCounts),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: `This Article\'s Model Median: ${(modelMedian * 100).toFixed(1)}%`,
                  position: 'start',
                  backgroundColor: 'rgba(75, 192, 192, 0.8)',
                  font: {
                    weight: 'bold'
                  }
                }
              },
              baselineMedianLine: {
                type: 'line',
                xMin: baselineMedianIndex,
                xMax: baselineMedianIndex,
                yMin: 0,
                yMax: Math.max(...modelCounts, ...baselineCounts),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: `Basic Linear Regression Median: ${(baselineMedian * 100).toFixed(1)}%`,
                  position: 'end',
                  backgroundColor: 'rgba(255, 99, 132, 0.8)',
                  font: {
                    weight: 'bold'
                  }
                }
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mean Absolute Percentage Error (%)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 20,
              callback: function(value: any, index: number) {
                // Show fewer tick labels for better readability
                return index % 3 === 0 ? this.getLabelForValue(value) : '';
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Frequency'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
} 