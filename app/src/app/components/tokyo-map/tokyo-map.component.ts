import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tokyo-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tokyo-map.component.html',
  styleUrls: ['./tokyo-map.component.scss']
})
export class TokyoMapComponent implements AfterViewInit {
  private map: L.Map | null = null;
  private readonly TOKYO_CENTER: L.LatLngExpression = [35.6762, 139.6503];
  private readonly DEFAULT_ZOOM = 11;
  private minValue: number = 0;
  private maxValue: number = 0;
  private colors: string[] = [];
  private geoJsonLayer: L.GeoJSON | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadGeoJson();
  }

  private async initializeMap(): Promise<void> {
    try {
      // Initialize map
      this.map = L.map('map', {
        center: this.TOKYO_CENTER,
        zoom: this.DEFAULT_ZOOM,
        zoomControl: true,
        maxZoom: 18,
        minZoom: 5,
        zoomSnap: 0.1,
        zoomDelta: 0.1,
        wheelPxPerZoomLevel: 120
      });

      // Add base layer - Stadia AlidadeSmooth
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 20
      }).addTo(this.map);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private initializeColors(): void {
    this.colors = [
      '#1a9850', // dark green
      '#91cf60', // light green
      '#d9ef8b', // yellow-green
      '#fee08b', // yellow
      '#fc8d59', // orange
      '#d73027'  // red
    ];
  }

  private getColor(d: number): string {
    if (d <= this.CUTOFF_VALUES[0]) return this.colors[0];
    if (d <= this.CUTOFF_VALUES[1]) return this.colors[1];
    if (d <= this.CUTOFF_VALUES[2]) return this.colors[2];
    if (d <= this.CUTOFF_VALUES[3]) return this.colors[3];
    if (d <= this.CUTOFF_VALUES[4]) return this.colors[4];
    return this.colors[5];
  }

  private style(feature: any) {
    const value = feature.properties.land_value || 0;
    return {
      fillColor: this.getColor(value),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  private highlightFeature(e: any) {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    layer.bringToFront();
  }

  private resetHighlight(e: any) {
    const layer = e.target;
    layer.setStyle(this.style(e.target.feature));
  }

  private zoomToFeature(e: any) {
    this.map?.fitBounds(e.target.getBounds());
  }

  private onEachFeature(feature: any, layer: L.Layer) {
    const value = feature.properties.land_value || 0;
    const formattedValue = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(value);

    layer.on({
      click: (e: any) => {
        this.zoomToFeature(e);
        layer.bindPopup(`
          <div>
            <strong>Land Value:</strong> ${formattedValue}
            ${feature.properties.trimmed_city ? `<br><strong>City:</strong> ${feature.properties.trimmed_city}` : ''}
            // ${feature.properties.name ? `<br><strong>Area:</strong> ${feature.properties.name}` : ''}
          </div>
        `).openPopup();
      }
    });
  }

  private addLegend(): void {
    if (!this.map) return;

    const legend = new L.Control({position: 'bottomright'});
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      
      div.innerHTML = '<strong>Land Value (JPY)</strong><br>';
      
      // Display ranges in reverse order (highest to lowest)
      const formatValue = (value: number) => new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0
      }).format(value);

      // Add the highest range
      div.innerHTML +=
        '<i style="background:' + this.colors[5] + '"></i> ' +
        formatValue(this.CUTOFF_VALUES[4]) + '+<br>';

      // Add middle ranges
      for (let i = this.CUTOFF_VALUES.length - 1; i > 0; i--) {
        div.innerHTML +=
          '<i style="background:' + this.colors[i] + '"></i> ' +
          formatValue(this.CUTOFF_VALUES[i-1]) + '&ndash;' + formatValue(this.CUTOFF_VALUES[i]) + '<br>';
      }

      // Add the lowest range
      div.innerHTML +=
        '<i style="background:' + this.colors[0] + '"></i> ' +
        '&lt;' + formatValue(this.CUTOFF_VALUES[0]) + '<br>';
      
      return div;
    };
    legend.addTo(this.map);
  }

  private readonly CUTOFF_VALUES = [
    307454.39529935,
    506038.30486301,
    669144.53113681,
    1001981.98169277,
    1746499.67217411
  ];

  private loadGeoJson(): void {
    this.http.get('plo.json').subscribe({
      next: (geojson: any) => {
        if (!this.map) return;

        // Calculate min and max values
        const values = geojson
          .map((f: any) => f.properties.land_value || 0)
          .filter((v: number) => !isNaN(v));
        
        this.minValue = Math.min(...values);
        this.maxValue = Math.max(...values);

        // Initialize colors after we have the value range
        this.initializeColors();

        // Remove existing layer if it exists
        if (this.geoJsonLayer) {
          this.map.removeLayer(this.geoJsonLayer);
        }

        // Create and add GeoJSON layer
        this.geoJsonLayer = L.geoJSON(geojson, {
          style: this.style.bind(this),
          onEachFeature: this.onEachFeature.bind(this)
        }).addTo(this.map);

        // Add legend
        this.addLegend();

        // Center and zoom the map to fit the GeoJSON bounds
        const bounds = this.geoJsonLayer.getBounds();
        this.map.fitBounds(bounds, {
          padding: [50, 50], // Add some padding around the bounds
          maxZoom: 12 // Limit the maximum zoom level
        });
      },
      error: (error) => {
        console.error('Error loading GeoJSON:', error);
      }
    });
  }
}
