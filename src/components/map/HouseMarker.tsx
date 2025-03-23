
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface House {
  id: string;
  position: [number, number];
  receptivity: 'high' | 'medium' | 'low';
  notes?: string;
  visitedAt: string;
  evangelistId?: string;
}

interface HouseMarkerProps {
  map: mapboxgl.Map | null;
  houses: House[];
  visible: boolean;
}

const HouseMarker = ({ map, houses, visible }: HouseMarkerProps) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || !visible) {
      // Clean up any existing markers if we're hiding them
      markers.forEach(marker => marker.remove());
      setMarkers([]);
      return;
    }

    // Remove all existing markers
    markers.forEach(marker => marker.remove());

    // Create new markers
    const newMarkers = houses.map(house => {
      const el = document.createElement('div');
      el.className = 'house-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.background = 
        house.receptivity === 'high' ? '#10b981' : 
        house.receptivity === 'medium' ? '#f59e0b' : '#ef4444';
      el.style.border = '1px solid white';
      el.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
      el.style.borderRadius = '50%';
      
      return new mapboxgl.Marker(el)
        .setLngLat(house.position)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <strong>House Visit</strong><br>
            Receptivity: ${house.receptivity}<br>
            ${house.notes ? `Notes: ${house.notes}<br>` : ''}
            Visited: ${new Date(house.visitedAt).toLocaleString()}
          `))
        .addTo(map);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [map, houses, visible]);

  return null;
};

export default HouseMarker;
