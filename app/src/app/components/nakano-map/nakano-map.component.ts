import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nakano-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nakano-map.component.html',
  styleUrls: ['./nakano-map.component.scss']
})
export class NakanoMapComponent implements AfterViewInit {
  private map: L.Map | null = null;
  private readonly NAKANO_CENTER: L.LatLngExpression = [35.7074, 139.6638];
  private readonly DEFAULT_ZOOM = 15;
  private geoJsonLayer: L.GeoJSON | null = null;
  private leaflet: any;

  constructor(private http: HttpClient) {
    // Fix Leaflet's default marker path issues
    const iconRetinaUrl = 'marker-icon-2x.png';
    const iconUrl = 'marker-icon.png';
    const shadowUrl = 'marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadGeoJson();
  }

  private async initializeMap(): Promise<void> {
    try {
      // Dynamically import Leaflet
      this.leaflet = await import('leaflet');
      
      // Initialize map
      this.map = this.leaflet.map('map', {
        center: this.NAKANO_CENTER,
        zoom: this.DEFAULT_ZOOM,
        zoomControl: true,
        maxZoom: 18,
        minZoom: 14,
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
        fadeAnimation: true,
        markerZoomAnimation: true,
        transform3DLimit: 8388608,
        wheelPxPerZoomLevel: 30
      });

      // Add base layer - OpenStreetMap
      this.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private onEachFeature(feature: any, layer: L.Layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <div>
          <strong>${feature.properties.name}</strong><br>
          ${feature.properties.description || ''}
        </div>
      `);
    }

    // Add hover effect
    if (layer instanceof L.Path) {
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            fillOpacity: 0.7,
            weight: 3
          });
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle({
            fillOpacity: 0.4,
            weight: 2
          });
        }
      });
    }
  }

  private getRandomColor(): string {
    const colors = [
      '#FF9800', // Orange
      '#2196F3', // Blue
      '#4CAF50', // Green
      '#9C27B0', // Purple
      '#F44336', // Red
      '#009688', // Teal
      '#795548', // Brown
      '#607D8B'  // Blue Grey
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private loadGeoJson(): void {
    this.http.get('nakano.geojson').subscribe({
      next: (geojson: any) => {
        if (!this.map) return;

        // Remove existing layer if it exists
        if (this.geoJsonLayer) {
          this.map.removeLayer(this.geoJsonLayer);
        }

        // Create and add GeoJSON layer
        this.geoJsonLayer = L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor: this.getRandomColor(),
            color: '#333333',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.4,
            dashArray: '3',
            lineCap: 'round',
            lineJoin: 'round'
          }),
          onEachFeature: this.onEachFeature.bind(this)
        }).addTo(this.map);

        // Center and zoom the map to fit the GeoJSON bounds
        const bounds = this.geoJsonLayer.getBounds();
        this.map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 1
        });
      },
      error: (error) => {
        console.error('Error loading GeoJSON:', error);
      }
    });
  }
} 