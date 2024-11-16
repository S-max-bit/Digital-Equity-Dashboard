'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ data = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Initialize markers
      if (data && data.length > 0) {
        data.forEach(location => {
          L.marker([location.lat, location.lng])
            .bindPopup(`
              <b>${location.region}</b><br>
              Coverage: ${location.coverage}%<br>
              Provider: ${location.provider}<br>
              Speed: ${location.speed}
            `)
            .addTo(mapInstanceRef.current);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); 

  // Update markers when data changes
  useEffect(() => {
    if (mapInstanceRef.current && data) {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      // Add new markers
      data.forEach(location => {
        L.marker([location.lat, location.lng])
          .bindPopup(`
            <b>${location.region}</b><br>
            Coverage: ${location.coverage}%<br>
            Provider: ${location.provider}<br>
            Speed: ${location.speed}
          `)
          .addTo(mapInstanceRef.current);
      });
    }
  }, [data]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%', minHeight: '400px' }} />;
}