import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

interface LocationPoint {
  id: string | number;
  title: string;
  description?: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];

  // Example locations
  locations: LocationPoint[] = [
    { id: 1, title: 'Place A', description: 'Details for A', lat: 22.5726, lng: 88.3639 },
    { id: 2, title: 'Place B', description: 'Details for B', lat: 22.5750, lng: 88.3700 },
    { id: 3, title: 'Place C', description: 'Details for C', lat: 22.5650, lng: 88.3500 }
  ];

  private resizeHandler = () => {
    if (this.map) {
      // pass true to also update internal pan/zoom
      this.map.invalidateSize(true);
    }
  };

  constructor(private router: Router) {
    // Ensure correct icon urls (must exist in src/assets/leaflet/)
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();

    // Force a reflow / re-render after layout settles (important for Angular layouts)
    // placed after init and adding markers
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true);
      }
    }, 500);

    // extra safety: invalidate again slightly later
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true);
      }
    }, 1200);

    // Add a single test marker and open popup to confirm marker rendering
    const testMarker = L.marker([22.5726, 88.3639])
      .addTo(this.map)
      .bindPopup('<b>Kolkata center</b><br>Test marker')
      .openPopup();

    // Keep the test marker in markers array if you want to remove later
    this.markers.push(testMarker);

    // handle window resizes (optional but helpful)
    window.addEventListener('resize', this.resizeHandler);
  }

  private initMap(): void {
    // center the map on the first location
    const centerLatLng: [number, number] = [this.locations[0].lat, this.locations[0].lng];

    this.map = L.map('map', {
      center: centerLatLng,
      zoom: 13,
      preferCanvas: false // true can be faster with many markers, keep false for now
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    // clear old markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    this.locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(this.map)
        .bindPopup(`<div><strong>${loc.title}</strong><p>${loc.description ?? ''}</p><a href="/locations/${loc.id}">View details</a></div>`);

      marker.on('click', () => {
        marker.openPopup();
        // If you want to navigate programmatically:
        // this.router.navigate(['/locations', loc.id]);
      });

      this.markers.push(marker);
    });
  }

  onMarkerClickNavigate(id: string | number) {
    this.router.navigate(['/locations', id]);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    if (this.map) {
      this.map.remove();
    }
  }
}
