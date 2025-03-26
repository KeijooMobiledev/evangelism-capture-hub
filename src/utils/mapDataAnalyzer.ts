
interface GeoPoint {
  lat: number;
  lng: number;
  intensity?: number;
  receptivity?: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  hotspots: GeoPoint[];
  lowActivityAreas: GeoPoint[];
  recommendedAreas: GeoPoint[];
  statistics: {
    totalVisited: number;
    highReceptivity: number;
    mediumReceptivity: number;
    lowReceptivity: number;
    averageReceptivityScore: number;
    coveragePercentage: number;
  };
}

/**
 * Analyzes geographic evangelization data to identify patterns and opportunities
 */
export const analyzeMapData = (points: GeoPoint[], boundaryArea?: number): AnalysisResult => {
  // Default statistics
  const stats = {
    totalVisited: points.length,
    highReceptivity: 0,
    mediumReceptivity: 0,
    lowReceptivity: 0,
    averageReceptivityScore: 0,
    coveragePercentage: 0
  };
  
  // Calculate receptivity statistics
  points.forEach(point => {
    if (point.receptivity === 'high') {
      stats.highReceptivity++;
    } else if (point.receptivity === 'medium') {
      stats.mediumReceptivity++;
    } else if (point.receptivity === 'low') {
      stats.lowReceptivity++;
    }
  });
  
  // Calculate average receptivity score (3 for high, 2 for medium, 1 for low)
  const totalScore = (stats.highReceptivity * 3) + (stats.mediumReceptivity * 2) + (stats.lowReceptivity * 1);
  stats.averageReceptivityScore = points.length > 0 ? totalScore / points.length : 0;
  
  // Estimate coverage percentage (simplified calculation)
  stats.coveragePercentage = boundaryArea ? Math.min(100, (points.length / boundaryArea) * 10000) : 0;
  
  // Identify hotspots (areas with high concentration of high receptivity)
  const hotspots = identifyHotspots(points);
  
  // Identify low activity areas
  const lowActivityAreas = identifyLowActivityAreas(points);
  
  // Generate recommended areas for future evangelization
  const recommendedAreas = generateRecommendedAreas(points, hotspots, lowActivityAreas);
  
  return {
    hotspots,
    lowActivityAreas,
    recommendedAreas,
    statistics: stats
  };
};

/**
 * Identifies areas with high concentration of high-receptivity points
 */
const identifyHotspots = (points: GeoPoint[]): GeoPoint[] => {
  const highReceptivityPoints = points.filter(p => p.receptivity === 'high');
  
  // This is a simplified version for demonstration
  // In a real implementation, you would use clustering algorithms
  return highReceptivityPoints.map(point => ({
    lat: point.lat,
    lng: point.lng,
    intensity: 0.8 // High intensity for visualization
  }));
};

/**
 * Identifies areas with low evangelization activity
 */
const identifyLowActivityAreas = (points: GeoPoint[]): GeoPoint[] => {
  // This is a simplified placeholder for demonstration
  // In a real implementation, you would identify gaps in the point distribution
  
  // For demo purposes, we'll just create some points far from existing ones
  if (points.length === 0) return [];
  
  // Find the center of all points
  const center = points.reduce(
    (acc, point) => {
      acc.lat += point.lat;
      acc.lng += point.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );
  
  center.lat /= points.length;
  center.lng /= points.length;
  
  // Create some "low activity" points in different directions from center
  return [
    { lat: center.lat + 0.01, lng: center.lng + 0.01, intensity: 0.3 },
    { lat: center.lat - 0.01, lng: center.lng - 0.01, intensity: 0.3 },
    { lat: center.lat + 0.01, lng: center.lng - 0.01, intensity: 0.3 },
    { lat: center.lat - 0.01, lng: center.lng + 0.01, intensity: 0.3 },
  ];
};

/**
 * Generates recommended areas for future evangelization
 */
const generateRecommendedAreas = (
  points: GeoPoint[],
  hotspots: GeoPoint[],
  lowActivityAreas: GeoPoint[]
): GeoPoint[] => {
  // This is a simplified implementation
  // In a real scenario, this would incorporate demographic data, 
  // accessibility, past success rates, etc.
  
  // For demo purposes, we'll recommend areas near hotspots but not fully covered
  return hotspots.map(hotspot => ({
    lat: hotspot.lat + 0.005,
    lng: hotspot.lng - 0.005,
    intensity: 0.6 // Medium-high intensity for recommended areas
  }));
};

/**
 * Generates a heatmap data array compatible with Mapbox
 */
export const generateHeatmapData = (points: GeoPoint[]): number[][] => {
  return points.map(point => [
    point.lng,
    point.lat,
    point.intensity || 
    (point.receptivity === 'high' ? 1.0 : 
     point.receptivity === 'medium' ? 0.6 : 0.3)
  ]);
};

export default { analyzeMapData, generateHeatmapData };
