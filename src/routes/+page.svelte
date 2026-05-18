<script>
  import { base } from '$app/paths';
  import ArticleHeader from '$lib/components/Article/ArticleHeader.svelte';
  import ArticleSlide from '$lib/components/Article/ArticleSlide.svelte';
  import Map from '$lib/components/Maps/Map.svelte';
  import MapLayer from '$lib/components/Maps/MapLayer.svelte';
  import CostCalculator from '$lib/components/Data/CostCalculator.svelte';
  import YearSlider from '$lib/components/Data/YearSlider.svelte';
  import SoilSlider from '$lib/components/Data/SoilSlider.svelte';
  import SearchInput from '$lib/components/Forms/SearchInput.svelte';
  import Scroller from '$lib/components/Maps/Scroller.svelte';
  import MethodologyBox from '../lib/components/Article/MethodologyBox.svelte';
  import { bbox } from '@turf/turf';

  let { data } = $props();
  const greenRoofs = $derived(data.greenRoofs);
  const greenRoofsPolygons = $derived.by(() => data.greenRoofsPolygons);

  // Map scroller state
  let scrollProgress = $state(0);

  // Polygon map state for neighborhood zoom
  let polygonMapLng = $state(-73.92);
  let polygonMapLat = $state(40.74);
  let polygonMapZoom = $state(9.7);

  $effect(() => {
    const handleNeighborhoodSelect = (event) => {
      polygonMapLng = event.detail.longitude;
      polygonMapLat = event.detail.latitude;
      polygonMapZoom = event.detail.zoom;
    };

    window.addEventListener('neighborhood-selected', handleNeighborhoodSelect);

    return () => {
      window.removeEventListener('neighborhood-selected', handleNeighborhoodSelect);
    };
  });

  // Neighborhood search state
  let searchValue = $state('');
  let selectedNeighborhood = $state(null);

  let neighborhoods = $derived.by(() => {
    if (!greenRoofsPolygons?.features) return [];
    const names = greenRoofsPolygons.features
      .map(f => f.properties?.NTAName)
      .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
      .sort();
    return names;
  });

  let filteredNeighborhoods = $derived.by(() => {
    if (!searchValue) return neighborhoods;
    return neighborhoods.filter(name =>
      name.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const selectNeighborhood = (ntaName) => {
    if (!greenRoofsPolygons?.features) return;

    // Find the polygon with this NTA name
    const feature = greenRoofsPolygons.features.find(
      f => f.properties?.NTAName === ntaName
    );

    if (feature) {
      // Get bounds and zoom
      const bounds = bbox(feature);
      const [minLon, minLat, maxLon, maxLat] = bounds;

      // Update selected neighborhood
      selectedNeighborhood = {
        name: ntaName,
        greenRoofCount: feature.properties?.pointCount || 0
      };

      // Update the polygon map to zoom to this neighborhood
      window.dispatchEvent(new CustomEvent('neighborhood-selected', {
        detail: {
          longitude: (minLon + maxLon) / 2,
          latitude: (minLat + maxLat) / 2,
          zoom: 13,
          ntaName
        }
      }));

      searchValue = '';
    }
  };

  let wh = $state(0);
  let mapHeight = $derived(Math.round(wh * 0.85)); // 85vh

</script>

<svelte:window bind:innerHeight={wh} />

<div class="wide-container">
  <ArticleHeader
    headline="A New Yorker's Guide to Green Roofs"
    byline="Sidney Slon"
    pubDate="2026-05-11"
    hero={true}
    photoCredit="A green roof in New York City, 2015 / Lance Cheung, Wikimedia Commons"
  />
</div>

  <div class="container">

<ArticleSlide
  content="<strong>Green roofs are a powerful tool for combating the effects of climate change, like flooding prevention and extreme heat mitigation. They also can increase property values and lower energy costs in buildings.<br><br>But installing one is a complicated and expensive process in New York City. Throughout this article, you'll explore the benefits of green roofs, how to get one installed on your property, and where green roofs are currently located across the city.</strong><br><br><br>"
  photoFileName="/green_roof_photos/green roof gif.gif"
  photoCredit="Green roof illustration / Sidney Slon"
>
</ArticleSlide>

  <!-- Slide 2: Summer/Winter savings -->
  <ArticleSlide
  header="So, what are green roofs?"
  content='At the simplest level, a green roof is an outdoor area that supports vegetation, built on top of a space that people use like an apartment building, office, or even a parking garage. But they’re “a lot more than that,” says Dustin Partridge, director of conservation and science at NYC Bird Alliance. “They are highly engineered environments.”'
  photoFileName='/green_roof_photos/battery-park.jpg'
  photoCredit ='Battery Park City Green Roof / Natural Systems Utilities, Creative Commons'>
  </ArticleSlide>
  <ArticleSlide
  content='<br>Green roofs can vary dramatically, but they fall along a spectrum with two types at either end – intensive and extensive – which indicate soil depth. Extensive green roofs are very shallow, typically with soil no deeper than six inches, while intensive green roofs have much deeper soil, usually eight inches or more, according to Green Roof Technology. Semi-intensive roofs fall somewhere in the middle.<br><br>The amount of soil on a green roof determines everything else about it. Less soil means it weighs less, but only supports smaller, non-native plants. Roofs with thicker soil weigh more, but can support larger plants and even bird habitats, gardens or even recreational spaces. With the right amount of soil, a green roof can be a “really powerful tool for conservation,” says Partridge.'>
  </ArticleSlide>
  <div class="component-box">
  <SoilSlider
    imageSources={{ 
      2: base + '/photos/green_roof_photos/extensive_roof.jpg', 
      3: base + '/photos/green_roof_photos/extensive_roof.jpg', 
      4: base + '/photos/green_roof_photos/semi_intensive.jpg', 
      5: base + '/photos/green_roof_photos/semi_intensive.jpg', 
      6: base + '/photos/green_roof_photos/semi_intensive.jpg', 
      7: base + '/photos/green_roof_photos/semi_intensive.jpg', 
      8: base + '/photos/green_roof_photos/semi_intensive.jpg',
      9: base + '/photos/green_roof_photos/intensive roof.jpg', 
      10: base + '/photos/green_roof_photos/intensive roof.jpg', 
      11: base + '/photos/green_roof_photos/intensive roof.jpg', 
      12: base + '/photos/green_roof_photos/intensive roof.jpg',  
    }}
  />
  <p>Images credited to Karina Mazhukhina (Extensive Roof), Emmanuel Berrod (Semi-Intensive Roof), and Warsaw University (Intensive Roof). All images are licensed under Creative Commons.</p>
  </div>

  <ArticleSlide
    content="<br>Green roofs are becoming increasingly relevant in New York City, especially since recent local laws now require new buildings, or old buildings replacing their roofs, to consider a green roof option.">
    </ArticleSlide>

  <ArticleSlide
  header="How many green roofs does the city have?"
  content="This map shows the current number of green roofs in New York City, according to NYC Department of Environmental Protection and Nature Conservancy data. Each dot represents a different property.<br><br>">
  </ArticleSlide>

  <Scroller top={0.1} bottom={0.9} bind:progress={scrollProgress}>
    {#snippet background()}
    <div class="map-background" style="height: {mapHeight}px;">
      <div style="opacity: {1 - scrollProgress}; transition: opacity 0.3s ease;">
        <Map
          longitude={-73.92}
          latitude={40.74}
          zoom={9.7}
          minZoom={9.7}
          maxZoom={9.7}
          fitBoundsAtMinZoom={true}
          height={mapHeight}
          theme="positron"
          credit="OpenFreeMap / OpenStreetMap contributors"
        >
          <MapLayer
            id="greenRoofs"
            type="circle"
            data={greenRoofs}
            paint={{
              'circle-color': '#30c64b',
              'circle-opacity': 0.9,
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                3,
                14,
                6,
              ],
              'circle-stroke-color': '#123c0d',
              'circle-stroke-width': 1.2,
              'circle-stroke-opacity': 0.9,
            }}
          />
        </Map>
      </div>

      <div style="position: absolute; top: 0; left: 0; right: 0; opacity: {scrollProgress}; transition: opacity 0.3s ease;">
        <Map
          longitude={polygonMapLng}
          latitude={polygonMapLat}
          zoom={polygonMapZoom}
          minZoom={9.5}
          maxZoom={14.5}
          fitBoundsAtMinZoom={true}
          height={mapHeight}
          theme="positron"
          credit="OpenFreeMap / OpenStreetMap contributors"
          mapOpacity={0.2}
        >
          <MapLayer
            id="nta-fill"
            type="fill"
            data={greenRoofsPolygons}
            paint={{
              'fill-color': [
                'step',
                ['get', 'pointCount'],
                '#d0ffcc', // 0–5
                5,
                '#92f089', // 5–15
                15,
                '#5ad04f', // 15–30
                30,
                '#2da722', // 30–50
                50,
                '#117608', // 50–75
                75,
                '#064800', // 75+
              ],
              'fill-opacity': [
                'case',
                ['==', ['get', 'pointCount'], 0],
                0,
                selectedNeighborhood
                  ? ['case', ['==', ['get', 'NTAName'], selectedNeighborhood.name], 1.0, 0.2]
                  : 1.0,
              ],
              'fill-outline-color': ['case', ['==', ['get', 'pointCount'], 0], 'rgba(0,0,0,0)', '#123c0d'],
            }}
          />
        </Map>
      </div>
    </div>
    {/snippet}

    {#snippet foreground()}
    <div class="map-foreground">
      <section class="story-section scroller-spacer-start" style="margin-top: 0;"></section>

      <section class="story-section" style="margin-top: 0;">
        <p>In 2016, the Nature Conservancy estimated “730 buildings with green roofs.”</p>
      </section>

      <section class="story-section">
        <p>An independent analysis counts only 736 NYC green roofs in 2026.</p>
      </section>

      <section class="story-section">
        <p>Explore the map to see how many green roofs are in your neighborhood.</p>
      </section>

      <section class="story-section scroller-spacer-end"></section>

    </div>
    {/snippet}
  </Scroller>

  <section class="search-section below-scroller component-box-sm">
    {#if !selectedNeighborhood}
      <div class="search-container">
        <h2>Explore A Neighborhood</h2>
        <div class="search-wrapper">
          <SearchInput
            label="Search neighborhoods"
            placeholder="Start typing..."
            bind:value={searchValue}
          />
          {#if searchValue && filteredNeighborhoods.length > 0}
            <div class="neighborhood-dropdown">
              {#each filteredNeighborhoods as neighborhood}
                <button
                  class="neighborhood-item"
                  onclick={() => selectNeighborhood(neighborhood)}
                >
                  {neighborhood}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="neighborhood-info">
        <h2>{selectedNeighborhood.name}</h2>
        <p>{selectedNeighborhood.greenRoofCount === 1 ? 'There is: ' : 'There are: '}<strong>{selectedNeighborhood.greenRoofCount}</strong> {selectedNeighborhood.greenRoofCount === 1 ? 'green roof' : 'green roofs'} in this neighborhood.</p>
        <button class="reset-button" onclick={() => { selectedNeighborhood = null; polygonMapLng = -73.92; polygonMapLat = 40.74; polygonMapZoom = 9.7; }}>
          Back to Map
        </button>
      </div>
    {/if}
  </section>

  <div class="extra-space"></div>

  <ArticleSlide 
  header="How do green roofs help communities?"
  content="Green roofs come with a long list of benefits that only increase the more intensive they are. They're like a “swiss army knife” for your building, says Alan Burchell, green roof expert at Urban Strong, a green roof installation company."
  photoFileName='/green_roof_photos/brooklyn-grange.jpg'
  photoCredit='Brooklyn Grange rooftop farm / Ian Barlett, Creative Commons'>
</ArticleSlide>
<ArticleSlide
content="<br>On the environmental side, they cool and clean the air, sequester carbon and capture stormwater. As New York City faces wetter storms and hotter summers due to the effects of climate change, green roofs can help reduce flooding and the effects of extreme heat simultaneously. “On average, half the water that lands on a green roof never makes it down to the sewer,” Burchell says. The other half drains slowly, taking pressure off the city’s sewer system and preventing toxic overflows that end up in natural waterways.<br><br>Green roofs also have economic benefits. By cooling the surrounding air and insulating the roof, they can offer “2.2 to 16.7 percent less energy consumption than conventional roofs,” according to Environmental Protection Agency estimates. This insulation also prevents wear and tear on the building itself. “A green roof is a lot like a case on your phone,” says Burchell, as it encloses the rooftop and can more than double its lifespan.">
  <div class="component-box">
  <CostCalculator />
  </div>
  </ArticleSlide>

  <ArticleSlide
  content="Over time, the property value of a building can also increase after a green roof is installed. Green roofs aren’t one size fits all, so “it’s hard to elevator pitch the return-on-investment of a green roof,” but property value is the biggest selling point, says Burchell. Estimates list increases of up to 15% for certain buildings, and is often the largest return-on-investment for a green roof owner.">
  </ArticleSlide>

  <ArticleSlide 
  header="How do you get a green roof?"
  content="Starting the installation process almost always begins with a design and structural integrity review of the roof, which can be conducted by NYC Department of Environmental Protection (DEP) engineers. New buildings may include green roofs in their design, but retrofitting a green roof on an older building often means determining the roof’s weight capacity, planning for emergency roof access and installing the necessary additional roof layers. The DEP lists about five-to-six necessary layers of a green roof; the root barrier, water-proofing layer, drainage layer, filter fabric, growing media and finally, the vegetation. If a building needs multiple adjustments to support a green roof, that can drive initial costs up."
  photoFileName='/green_roof_photos/layers.jpg'
  photoCredit='Green roof layers / Wikimedia Commons'>
  </ArticleSlide>

  <ArticleSlide
  content="<br>In New York City, a simple extensive roof with thin soil can cost between $15 and $25 per square foot, whereas premium intensive roofs can cost $35 to $65 per square foot, or even more. More expensive versions can support people, gardens and amenity spaces, but most “green roofs are not typically meant to be walked on,” says Burchell.<br><br>Regardless of roof type, the city offers two routes to offset upfront costs. New Yorkers can apply for a one-time tax abatement, offering between $10 to $15 back per square foot, depending on the building’s location. The NYC Department of Environmental Protection also offers a green infrastructure grant for projects worth at least $50,000, although with higher standards to apply.">
  </ArticleSlide>

  <ArticleSlide 
  header="Is a green roof right for your property?"
  content="Once the roof is installed, there’s also maintenance to consider. Narendra Paramanand, sustainable facilities analyst at the NYC Department of Parks and Recreation, oversees 42 different green roofs and has separate maintenance schedules for all of them. In the first two years after installation, this is a crucial period to keep the roof functioning. This is because plants have a higher chance of dying in the first two years, so Paramanand recommends “a lot more watering” and weeding. After this initial period, watering the plants becomes less important, but continuous weeding and clearing the building’s drains becomes a priority. If drains become clogged, he says, “that may lead to standing water on the roof, which can lead to leaks.” Unwanted weeds can also damage roof layers, which is why green roofs are a time commitment.<br><br>Extensive roofs typically need to be checked about once a year, but intensive roofs with larger, or native plant types “require a lot more maintenance,” he says. In New York, green roof maintenance comes with a typical price tag of “$0.85 to $1.30 per square foot per year,” according to Urban Strong estimates.">
  <div class="component-box">
    <YearSlider />
  </div>
  </ArticleSlide>

  <ArticleSlide 
  header="What makes a green roof unique?"
  content="Green infrastructure is the general term for a number of different eco-friendly structures, including various types of building roofs outlined by the DEP. For example, cool roofs are typically painted white to reflect hot sunlight, reducing heat. Blue roofs are designed to hold stormwater. Both are cheaper to install but don’t support vegetation, and green roofs provide the benefits of both.<br><br>Green roofs can also support solar panels. “Vegetation passively cools the air below the solar panel,” which increases panel performance, says Burchell. In warmer months, solar panels on green roofs can see a “ten-to-sixteen percent boost in electrical production,” compared to those on normal rooftops.">
  </ArticleSlide>

  <ArticleSlide 
  header="Looking to learn more about green roofs?"
  content="For New Yorkers looking to start the process, an easy first step is the DEP <a href='https://www.nyc.gov/site/dep/water/green-infrastructure.page' target='_blank'>website</a>, which offers grant workshops to help determine eligibility and installation advice.<br><br>Installing a green roof might feel daunting and costly, but it’s also adding to a small, growing list of rooftop greenspaces that offer a tremendous amount of benefits to the city and its residents.<br><br>"
    photoFileName="/green_roof_photos/bird gif.gif"
    photoCredit="Building gif / Sidney Slon"
  >
  </ArticleSlide>

  <div class="space">
    <MethodologyBox>
    <p>Data sourced from NYC Department of Environmental Protection, Nature Conservancy, NYC Open Data, NYC Department of Parks and Recreation, NYC Department of Design and Construction.</p>
    <p>Map created with MapLibre GL JS.</p>
    <p>Data <a href='https://github.com/sidneyslon38/nyc_greenroof_data_analysis' target='_blank'>analyzed</a> in Jupyter Notebooks using the Pandas and Geopandas Python library.</p>
    <p>Green roof cost estimates and installation information sourced from Urban Strong, Environmental Protection Agency.</p>
    <p>Green roof maintenance information sourced from the NYC Department of Parks and Recreation.</p>
    </MethodologyBox>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles' as *;

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .map-background {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .map-foreground {
    margin: 0 auto 0;
    font-family: var(--font-serif);
    font-size: var(--font-size-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text);
    width: 100%;

    :global(p) {
      margin-bottom: var(--spacing-md);

      &:last-child {
        margin-bottom: 0;
      }
    }

    :global(a) {
      color: var(--color-dark);
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        color: var(--color-accent);
      }
    }

    :global(strong) {
      font-weight: var(--font-weight-semibold);
    }

    @include tablet {
      font-size: var(--font-size-lg);
      line-height: var(--leading-loose);
    }
    @include desktop {
      font-size: var(--font-size-2xl);
      line-height: var(--leading-relaxed);
    }
  }

  .story-section {
    width: 100%;
    align-items: center;
    min-height: auto;
    padding: var(--spacing-xl) 0;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    justify-content: center;
      :global(p) {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(4px);
        padding: var(--spacing-md) var(--spacing-lg);
        max-width: 420px;
        font-family: var(--font-serif);
        font-size: var(--font-size-lg);
        line-height: var(--leading-relaxed);
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
  }

  .story-section:not(.scroller-spacer-start):not(.scroller-spacer-end) {
    padding-top: 48vh;
    padding-bottom: 48vh;
  }

  .scroller-spacer-start,
  .scroller-spacer-end {
    padding: 0;
    gap: 0;
    justify-content: flex-start;
  }

  .scroller-spacer-start {
    min-height: 50vh;

    @include tablet {
      min-height: 60vh;
    }

    @include desktop {
      min-height: 80vh;
    }
  }

  .scroller-spacer-end {
   min-height: 95vh; // was 85vh — gives the background more travel room
   }

  .component-box {
    background-color: var(--color-component-bg);
    border: 8px double var(--color-accent);
    padding: var(--spacing-sm);
    padding-bottom: var(--spacing-xs);
    margin: var(--spacing-lg) 0;
  
    p {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      font-style: italic;
      margin-top: var(--spacing-sm);
      line-height: var(--leading-tight);
        @include mobile {
          font-size: var(--font-size-xs);
        }
    }

  }

    .component-box-sm {
    background-color: var(--color-component-bg);
    border: 8px double var(--color-accent);
    padding: var(--spacing-2xl);
    margin: 0;
  
    p {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-top: var(--spacing-sm);
      line-height: var(--leading-tight);
        @include mobile {
          font-size: var(--font-size-xs);
        }
    }

  }

  .search-section {
    position: relative;
    z-index: 10;
    margin-top: 0;
    display: flex;
    justify-content: center; // ← ensure the container centers horizontally
    width: 100%;
  }

  .below-scroller {
    margin-top: var(--spacing-2xl); // bump this up on all breakpoints

    @include tablet {
      margin-top: var(--spacing-2xl);
    }

    @include desktop {
      margin-top: var(--spacing-2xl);
    }
  }

  .search-container {
    max-width: 500px;
    width: 100%;
    margin: 0 auto; // ← add this, centers it within the padded box
    padding: var(--spacing-xs);

    h2 {
      font-family: var(--font-serif);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-5xl);
      margin: 0 0 var(--spacing-md);
      color: var(--color-dark);
      text-align: center;
    }
  }

  .search-wrapper {
    position: relative;
  }

  .neighborhood-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 4px;
    z-index: 21;
  }

  .neighborhood-item {
    display: block;
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    border: none;
    background: white;
    cursor: pointer;
    text-align: left;
    font-size: 0.95rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }

  .neighborhood-info {
    max-width: 500px;
    width: 100%;
    border-radius: 12px;
    padding: var(--spacing-lg);

    h2 {
      margin: 0 0 var(--spacing-md) 0;
      text-align: center;
      font-size: 1.75rem;
    }

    p {
      margin: 0 0 var(--spacing-md) 0;
      text-align: center;
      font-size: 1.1rem;
      color: var(--color-dark);
    }
  }

  .reset-button {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #117608;
    }
  }

  .extra-space {
    height: 8rem;
  }

  .space {
    margin-top: 8rem;
  }
</style>
