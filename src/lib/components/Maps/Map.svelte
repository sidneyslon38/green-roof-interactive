<!--
@component
Map.svelte — Interactive map using MapLibre GL JS

Renders a pannable, zoomable map using OpenFreeMap basemap tiles.
Provides a Svelte context so child MapLayer components can register
their own GeoJSON sources and layers on the shared map instance.

USAGE EXAMPLE:
<Map
  longitude={-74.006}
  latitude={40.7128}
  zoom={10}
  theme="liberty"
>
  <MapLayer
    id="my-points"
    type="circle"
    data={geojsonData}
    paint={{ 'circle-radius': 6, 'circle-color': '#0033A1' }}
  />
</Map>
-->
<script>
  import { onMount, setContext } from 'svelte';
  import 'maplibre-gl/dist/maplibre-gl.css';

  /** Maps theme names to OpenFreeMap style URLs */
  const THEME_URLS = {
    liberty: 'https://tiles.openfreemap.org/styles/liberty',
    bright: 'https://tiles.openfreemap.org/styles/bright',
    positron: 'https://tiles.openfreemap.org/styles/positron',
    fiord: 'https://tiles.openfreemap.org/styles/fiord',
    dark: 'https://tiles.openfreemap.org/styles/dark',
  };

  let {
    longitude = -74.006, // Map center longitude (default: NYC)
    latitude = 40.7128, // Map center latitude
    zoom = 10, // Initial zoom level (0–22)
    minZoom = 0, // Minimum zoom level
    maxZoom = 22, // Maximum zoom level
    maxBounds = null, // Constrain panning to a bounding box: [[minLng, minLat], [maxLng, maxLat]]
    fitBoundsAtMinZoom = false, // Auto-fit bounds to viewport at minZoom
    theme = 'liberty', // Basemap theme: 'liberty' | 'bright' | 'positron' | 'fiord' | 'dark'
    interactive = true, // Allow panning and zooming
    dragPan = true, // Allow dragging to pan
    border = false, // Show an accent border around the map
    width = null, // Optional explicit width in pixels
    height = null, // Optional explicit height in pixels
    aspectRatio = '4 / 3', // Aspect ratio when no explicit height is given
    caption = '', // Optional caption below the map
    credit = 'OpenFreeMap / OpenStreetMap contributors',
    mapOpacity = 1, // Opacity of the map background (0–1, higher = clearer)
    children, // Snippet for nested MapLayer components
  } = $props();

  const styleUrl = $derived(THEME_URLS[theme] ?? THEME_URLS.liberty);

  let mapContainer;
  let map = $state(null);
  let mapReady = $state(false);

  // Tracks the style URL currently applied, to avoid redundant setStyle calls
  let appliedStyleUrl = $state(null);

  // Build a descriptive label for screen readers
  const ariaLabel = $derived(
    caption
      ? `Interactive map: ${caption}`
      : `Interactive map centered at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  );

  // Provide the map instance via context so child MapLayer components can use it
  const mapContext = {
    getMap: () => map,
    isReady: () => mapReady,
    /** Subscribe to style.load events for layer (re-)registration */
    onStyleLoad: (fn) => {
      if (!map) return;
      map.on('style.load', fn);
    },
    offStyleLoad: (fn) => {
      if (!map) return;
      map.off('style.load', fn);
    },
  };
  setContext('maplibre-map', mapContext);

  onMount(() => {
    let mounted = true;

    import('maplibre-gl')
      .then(({ Map: MaplibreMap }) => {
        if (!mounted) return;

        const instance = new MaplibreMap({
          container: mapContainer,
          style: styleUrl,
          center: [longitude, latitude],
          zoom,
          interactive,
          minZoom,
          maxZoom,
          maxBounds,
          dragPan,
          attributionControl: credit ? false : { compact: true },
        });

        instance.on('style.load', () => {
          if (!mounted) return;

          // Add filter layer right after basemap loads, before children render
          try {
            if (!instance.getSource('__filter-source')) {
              instance.addSource('__filter-source', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'Polygon',
                        coordinates: [
                          [
                            [-180, -85],
                            [180, -85],
                            [180, 85],
                            [-180, 85],
                            [-180, -85],
                          ],
                        ],
                      },
                    },
                  ],
                },
              });
            }

            if (!instance.getLayer('__basemap-filter')) {
              instance.addLayer({
                id: '__basemap-filter',
                type: 'fill',
                source: '__filter-source',
                paint: {
                  'fill-color': '#ffffff',
                  'fill-opacity': 1 - mapOpacity,
                },
              });
            }
          } catch (e) {
            console.warn('Could not add filter layer:', e);
          }

          mapReady = true;

          // Auto-capture bounds at minZoom if requested
          if (fitBoundsAtMinZoom) {
            instance.setZoom(minZoom);
            setTimeout(() => {
              const bounds = instance.getBounds();
              instance.setMaxBounds([
                [bounds.getWest(), bounds.getSouth()],
                [bounds.getEast(), bounds.getNorth()],
              ]);
              // Restore original zoom
              instance.setZoom(zoom);
            }, 100);
          }
        });

        map = instance;
        appliedStyleUrl = styleUrl;
      })
      .catch((err) => {
        console.error('Map: failed to load maplibre-gl', err);
      });

    return () => {
      mounted = false;
      if (map) map.remove();
      map = null;
      mapReady = false;
    };
  });

  // Reactively update center and zoom when props change
  $effect(() => {
    if (!map) return;

    const center = map.getCenter();
    const centerChanged =
      Math.abs(center.lng - longitude) > 0.0001 ||
      Math.abs(center.lat - latitude) > 0.0001;
    const zoomChanged = Math.abs(map.getZoom() - zoom) > 0.01;

    if (!centerChanged && !zoomChanged) return;

    map.flyTo({
      center: [longitude, latitude],
      zoom,
      essential: true,
    });
  });

  // Track basemap layer IDs and filter layer status
  let filterLayerAdded = $state(false);

  // Reactively update the basemap style when theme changes
  $effect(() => {
    const url = styleUrl;
    if (!map || url === appliedStyleUrl) return;
    appliedStyleUrl = url;
    mapReady = false;
    filterLayerAdded = false;
    map.setStyle(url);
  });

  // Update filter layer opacity reactively
  $effect(() => {
    if (!map || !mapReady) return;
    try {
      map.setPaintProperty('__basemap-filter', 'fill-opacity', 1 - mapOpacity);
    } catch (e) {
      // Filter layer might not exist yet
    }
  });
</script>

<figure class="map-figure" style:width={width ? `${width}px` : undefined}>
  <div
    class="map-container"
    class:has-border={border}
    bind:this={mapContainer}
    role="application"
    aria-label={ariaLabel}
    style:width={width ? `${width}px` : undefined}
    style:height={height ? `${height}px` : undefined}
    style:aspect-ratio={!height ? aspectRatio : undefined}
  ></div>
  {#if caption || credit}
    <figcaption class="caption-container">
      {#if caption}
        <span class="caption">{caption}</span>
      {/if}
      {#if credit}
        <span class="credit">{credit}</span>
      {/if}
    </figcaption>
  {/if}
</figure>

{#if mapReady && children}
  {@render children()}
{/if}

<style lang="scss">
  @use '../../styles' as *;

  .map-figure {
    margin: var(--spacing-sm) 0;
    padding: 0;
    width: 100%;

    @include tablet {
      margin: var(--spacing-sm) 0;
    }
  }

  .map-container {
    width: 100%;
    display: block;

    &.has-border {
      border: var(--border-width-accent) solid var(--color-accent);
      border-radius: var(--border-radius-sm);
    }
  }

  .caption-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding-top: var(--spacing-xxs);
    margin-top: var(--spacing-xxs);
  }

  .caption {
    font-size: var(--font-size-sm);
    line-height: var(--leading-caption);
    color: var(--color-text);
  }

  .credit {
    font-size: 8px;
    color: var(--color-medium-gray);
  }
</style>
