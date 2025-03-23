
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface HeatmapLayerProps {
  map: mapboxgl.Map | null;
  sourceId: string;
  layerId: string;
  data: GeoJSON.FeatureCollection;
  visible: boolean;
}

const HeatmapLayer = ({ 
  map, 
  sourceId, 
  layerId, 
  data, 
  visible 
}: HeatmapLayerProps) => {
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Check if the source already exists
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: data
      });
    } else {
      // Update the source data
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(data);
    }

    // Check if the layer already exists
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'heatmap',
        source: sourceId,
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 255, 255, 0.5)',
            0.4, 'rgba(0, 255, 0, 0.5)',
            0.6, 'rgba(255, 255, 0, 0.5)',
            0.8, 'rgba(255, 0, 0, 0.5)'
          ],
          'heatmap-radius': 20,
          'heatmap-opacity': 0.7
        },
        layout: {
          visibility: visible ? 'visible' : 'none'
        }
      });
    } else {
      // Update layer visibility
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }

    return () => {
      if (map && map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map && map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, sourceId, layerId, data, visible]);

  return null;
};

export default HeatmapLayer;
