import greenRoofs from '$lib/data/green_roofs_combined.json';
import greenRoofsPolygons from '$lib/data/green_roofs_combined_polygons.json';

function collectCoordinates(geometry, coordinates = []) {
  if (!geometry) return coordinates;

  if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    for (const ring of geometry.coordinates) {
      for (const coordinate of ring) {
        coordinates.push(coordinate);
      }
    }
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) {
        for (const coordinate of ring) {
          coordinates.push(coordinate);
        }
      }
    }
  }

  return coordinates;
}

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function countPointsInPolygon(point, geometry) {
  if (geometry.type === 'Polygon') {
    return pointInPolygon(point, geometry.coordinates[0]) ? 1 : 0;
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      if (pointInPolygon(point, polygon[0])) return 1;
    }
  }
  return 0;
}

function enrichPolygonsWithPointCounts(polygonCollection, pointCollection) {
  const enriched = {
    ...polygonCollection,
    features: polygonCollection.features.map((polygon) => {
      const count = pointCollection.features.filter((point) =>
        countPointsInPolygon(point.geometry.coordinates, polygon.geometry)
      ).length;

      return {
        ...polygon,
        properties: {
          ...polygon.properties,
          pointCount: count,
        },
      };
    }),
  };

  return enriched;
}

function getPolygonViewport(featureCollection) {
  let minLongitude = Infinity;
  let minLatitude = Infinity;
  let maxLongitude = -Infinity;
  let maxLatitude = -Infinity;

  for (const feature of featureCollection.features) {
    const coordinates = collectCoordinates(feature.geometry);
    for (const [longitude, latitude] of coordinates) {
      minLongitude = Math.min(minLongitude, longitude);
      minLatitude = Math.min(minLatitude, latitude);
      maxLongitude = Math.max(maxLongitude, longitude);
      maxLatitude = Math.max(maxLatitude, latitude);
    }
  }

  return {
    longitude: (minLongitude + maxLongitude) / 2,
    latitude: (minLatitude + maxLatitude) / 2,
    zoom: 9.3,
  };
}

export function load() {
  // Transform polygon features to point features using lat/lon from properties
  const greenRoofsPoints = {
    type: 'FeatureCollection',
    features: greenRoofs.features.map((feature) => ({
      type: 'Feature',
      properties: feature.properties,
      geometry: {
        type: 'Point',
        coordinates: [feature.properties.lon, feature.properties.lat],
      },
    })),
  };

  // Enrich polygons with point counts
  const enrichedPolygons = enrichPolygonsWithPointCounts(greenRoofsPolygons, greenRoofsPoints);

  return {
    // Set to false to hide the NYCity News Service header
    showHeader: false,
    // Set to false to hide the site footer
    showFooter: true,
    greenRoofs: greenRoofsPoints,
    greenRoofsPolygons: enrichedPolygons,
    polygonViewport: getPolygonViewport(enrichedPolygons),
  };
}
