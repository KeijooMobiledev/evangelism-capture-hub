import React from 'react';
import MapboxMap from '@/components/map/MapboxMap';

const MapPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold p-4">Carte des Évangélisations</h1>
      <div className="flex-1 relative">
        <MapboxMap accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!} />
      </div>
    </div>
  );
};

export default MapPage;
