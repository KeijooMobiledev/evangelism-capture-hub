
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon, XIcon, MapPinIcon } from 'lucide-react';

interface MapboxMapProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapLoaded?: () => void;
  onLocationAdded?: (location: { lng: number; lat: number; receptivity: 'high' | 'medium' | 'low' }) => void;
}

const MapboxMap = ({
  accessToken,
  initialCenter = [-74.006, 40.7128],
  initialZoom = 14,
  onMapLoaded,
  onLocationAdded
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapAddingMode, setMapAddingMode] = useState<'none' | 'house'>('none');
  const [newLocationReceptivity, setNewLocationReceptivity] = useState<'high' | 'medium' | 'low'>('medium');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current || !mapContainer.current || !accessToken) return;
    
    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      setIsMapLoaded(true);
      if (onMapLoaded) onMapLoaded();
    });
    
    map.current.on('click', (e) => {
      if (mapAddingMode === 'house') {
        const lngLat = e.lngLat;
        
        // Add marker
        const el = document.createElement('div');
        el.className = 'house-marker';
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.background = 
          newLocationReceptivity === 'high' ? '#10b981' : 
          newLocationReceptivity === 'medium' ? '#f59e0b' : '#ef4444';
        el.style.border = '1px solid white';
        el.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
        el.style.borderRadius = '50%';
        
        new mapboxgl.Marker(el)
          .setLngLat([lngLat.lng, lngLat.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <strong>House Visit</strong><br>
              Receptivity: ${newLocationReceptivity}<br>
              Added: ${new Date().toLocaleString()}
            `))
          .addTo(map.current!);
        
        if (onLocationAdded) {
          onLocationAdded({
            lng: lngLat.lng,
            lat: lngLat.lat,
            receptivity: newLocationReceptivity
          });
        }
        
        toast({
          title: 'Location added',
          description: `New house marked with ${newLocationReceptivity} receptivity`,
        });
        
        setMapAddingMode('none');
      }
    });
    
    return () => {
      map.current?.remove();
    };
  }, [accessToken, initialCenter, initialZoom, onMapLoaded]);

  useEffect(() => {
    // This effect handles changes to the adding mode
    if (!map.current) return;
    
    if (mapAddingMode === 'house') {
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = '';
    }
  }, [mapAddingMode]);

  const addHouseMarker = () => {
    setMapAddingMode('house');
  };

  const cancelAddingMode = () => {
    setMapAddingMode('none');
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Adding Mode Controls */}
      <div className="absolute top-4 left-4 z-10">
        {mapAddingMode === 'house' ? (
          <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
            <span className="text-sm">Click on map to add house</span>
            <select 
              className="text-sm bg-background border border-input rounded p-1"
              value={newLocationReceptivity}
              onChange={(e) => setNewLocationReceptivity(e.target.value as 'high' | 'medium' | 'low')}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={cancelAddingMode}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={addHouseMarker} className="shadow-md">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Add Visited House
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapboxMap;
