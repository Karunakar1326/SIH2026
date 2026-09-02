/**
 * GraphHopper Routing & GIS Service
 * Utilizes GraphHopper API for evacuation routing, road distance calculation,
 * travel time estimation, and route polyline visualization.
 */

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteInstruction {
  text: string;
  distance_m: number;
  time_ms: number;
}

export interface GraphHopperRouteResult {
  distance_km: number;
  time_minutes: number;
  coordinates: [number, number][]; // [lng, lat] for MapLibre GeoJSON
  instructions: RouteInstruction[];
  isFallback?: boolean;
}

const getApiKey = (): string => {
  return (
    import.meta.env.VITE_GRAPHHOPPER_API_KEY ||
    import.meta.env.GRAPHHOPPER_API_KEY ||
    'cf81f75d-3dec-414c-afbf-7af4da386d45'
  );
};

/**
 * Fetch optimal driving/evacuation route between two coordinates using GraphHopper Routing API
 */
export async function getGraphHopperRoute(
  start: RoutePoint,
  end: RoutePoint,
  vehicle: 'car' | 'small_truck' | 'foot' = 'car'
): Promise<GraphHopperRouteResult> {
  const apiKey = getApiKey();
  const url = `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=${vehicle}&locale=en&key=${apiKey}&points_encoded=false&instructions=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`GraphHopper API returned HTTP ${res.status}`);
    }
    const data = await res.json();

    if (data.paths && data.paths.length > 0) {
      const path = data.paths[0];
      const coords: [number, number][] = path.points.coordinates.map(
        (pt: number[]) => [pt[0], pt[1]] // [lng, lat]
      );

      const instructions: RouteInstruction[] = (path.instructions || []).map(
        (inst: { text: string; distance: number; time: number }) => ({
          text: inst.text,
          distance_m: inst.distance,
          time_ms: inst.time,
        })
      );

      return {
        distance_km: parseFloat((path.distance / 1000).toFixed(2)),
        time_minutes: Math.ceil(path.time / 60000),
        coordinates: coords,
        instructions,
        isFallback: false,
      };
    }
  } catch (err) {
    console.warn('GraphHopper API route fetch failed, using fallback line:', err);
  }

  // Fallback straight-line interpolation with terrain jitter if API fails/quota
  return generateFallbackRoute(start, end);
}

/**
 * Generate fallback multi-segment route between origin and destination
 */
function generateFallbackRoute(start: RoutePoint, end: RoutePoint): GraphHopperRouteResult {
  const pointsCount = 12;
  const coords: [number, number][] = [];
  
  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    // Linear interpolation
    let lng = start.lng + (end.lng - start.lng) * t;
    let lat = start.lat + (end.lat - start.lat) * t;

    // Slight curvature offset to simulate road curves
    if (i > 0 && i < pointsCount) {
      const offset = Math.sin(t * Math.PI) * 0.008;
      lng += offset;
      lat += offset * 0.5;
    }
    coords.push([lng, lat]);
  }

  // Calculate approximate geodesic distance
  const R = 6371; // Earth radius km
  const dLat = ((end.lat - start.lat) * Math.PI) / 180;
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((start.lat * Math.PI) / 180) *
      Math.cos((end.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = parseFloat((R * c * 1.25).toFixed(2)); // 1.25 winding factor

  return {
    distance_km: distKm,
    time_minutes: Math.ceil((distKm / 40) * 60), // 40 km/h avg speed
    coordinates: coords,
    instructions: [
      { text: `Depart from origin coordinates (${start.lat.toFixed(3)}, ${start.lng.toFixed(3)})`, distance_m: 500, time_ms: 60000 },
      { text: `Proceed along primary evacuation arterial corridor`, distance_m: distKm * 1000, time_ms: (distKm / 40) * 3600000 },
      { text: `Arrive at designated safe relocation site (${end.lat.toFixed(3)}, ${end.lng.toFixed(3)})`, distance_m: 200, time_ms: 30000 },
    ],
    isFallback: true,
  };
}
