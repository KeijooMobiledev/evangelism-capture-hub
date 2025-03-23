
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface Evangelist {
  id: string;
  name: string;
  position: [number, number];
  color: string;
  online: boolean;
  lastActive: string;
}

interface EvangelistMarkerProps {
  map: mapboxgl.Map | null;
  evangelists: Evangelist[];
  visible: boolean;
}

const EvangelistMarker = ({ map, evangelists, visible }: EvangelistMarkerProps) => {
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
    const newMarkers = evangelists.map(evangelist => {
      const el = document.createElement('div');
      el.className = 'evangelist-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.background = evangelist.color;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      
      if (evangelist.online) {
        const pulse = document.createElement('div');
        pulse.className = 'pulse';
        pulse.style.position = 'absolute';
        pulse.style.width = '100%';
        pulse.style.height = '100%';
        pulse.style.borderRadius = '50%';
        pulse.style.background = evangelist.color;
        pulse.style.opacity = '0.4';
        pulse.style.animation = 'pulse 1.5s infinite';
        el.appendChild(pulse);
      }
      
      return new mapboxgl.Marker(el)
        .setLngLat(evangelist.position)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <strong>${evangelist.name}</strong><br>
            ${evangelist.online ? 'Online now' : 'Last active: ' + new Date(evangelist.lastActive).toLocaleTimeString()}
          `))
        .addTo(map);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [map, evangelists, visible]);

  return null;
};

export default EvangelistMarker;
