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
  import Scroller from '@sveltejs/svelte-scroller';
  import { bbox } from '@turf/turf';

  let { data } = $props();
  const greenRoofs = $derived(data.greenRoofs);
  const greenRoofsPolygons = $derived.by(() => data.greenRoofsPolygons);

  // Map scroller state
  let scrollProgress = $state(0);

  // Neighborhood search state
  let searchValue = $state('');
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

      // Calculate center and zoom level
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
</script>

<div class="container">
  <ArticleHeader
    headline="Here's What It Takes For Your Roof To Go Green"
    byline="Sidney Slon"
    pubDate="2026-05-11"
  />
  <!-- Slide 1: Energy benefits -->
  <ArticleSlide 
  photoFileName="{base}/photos/green_roof_photos/green_roof_header.jpg"
  photoCredit="A green roof in New York City, 2015 / Lance Cheung, Wikimedia Commons"
  photoPosition="top"
  content="In the concrete jungle where dreams are made of, greenery is struggling to get its moment. It just might be over your head.<br><br>Green roofs are becoming increasingly relevant in New York City, especially since recent local laws now require new buildings, or old buildings replacing their roofs, to consider a green roof option. These rooftop green spaces exist on “less than 0.1%” of city buildings, according to Nature Conservancy estimates, but come with numerous benefits like flooding prevention, extreme heat mitigation and increased property values. If you’re a landlord or co-op board member, you’ve probably already heard of green roofs, but might not know where to start. Or, you might just be a city resident who wants to learn more about those nice looking roofs with plants growing on them.">
  </ArticleSlide>

  <!-- Slide 2: Summer/Winter savings -->
  <ArticleSlide 
  header="What are green roofs?"
  content="At the simplest level, a green roof is an outdoor area that supports vegetation, built on top of a space that people use like an apartment building, office, or even a parking garage. But they’re “a lot more than that,” says Dustin Partridge, director of conservation and science at NYC Bird Alliance. “They are highly engineered environments.”<br><br>Green roofs can vary dramatically, but they fall along a spectrum with two types at either end – intensive and extensive – which indicate soil depth. Extensive green roofs are very shallow, typically with soil no deeper than six inches, while intensive green roofs have much deeper soil, usually eight inches or more, according to Green Roof Technology. Semi-intensive roofs fall somewhere in the middle.<br><br>The amount of soil on a green roof determines everything else about it. Less soil means it weighs less, but only supports smaller, non-native plants. Roofs with thicker soil weigh more, but can support larger plants and even bird habitats, gardens or even recreational spaces. With the right amount of soil, a green roof can be a “really powerful tool for conservation,” says Partridge.">
  <div class="component-box">
  <SoilSlider />
  </div>
  </ArticleSlide>

  <ArticleSlide 
  header="Why should you consider a green roof for your building?"
  content="Green roofs come with a long list of benefits that only increase the more intensive they are. Alan Burchell, green roof educator and founder at Urban Strong considers them like a “swiss army knife” for your building.<br><br>On the environmental side, they cool and clean the air, sequester carbon and capture stormwater. As New York City faces wetter storms and hotter summers due to the effects of climate change, green roofs can help reduce flooding and the effects of extreme heat simultaneously. “On average, half the water that lands on a green roof never makes it down to the sewer,” Burchell says. The other half drains slowly, taking pressure off the city’s sewer system and preventing toxic overflows that end up in natural waterways.<br><br>Green roofs also have economic benefits. By cooling the surrounding air and insulating the roof, they can offer “2.2 to 16.7 percent less energy consumption than conventional roofs,” according to Environmental Protection Agency estimates. This insulation also prevents wear and tear on the building itself. “A green roof is a lot like a case on your phone,” says Burchell, as it encloses the rooftop and can more than double its lifespan.">
  <div class="component-box">
  <CostCalculator />
  </div>
  </ArticleSlide>

<ArticleSlide
content="Over time, the property value of a building can also increase after a green roof is installed. Green roofs aren’t one size fits all, so “it’s hard to elevator pitch the return-on-investment of a green roof,” but property value is the biggest selling point, says Burchell. Estimates list increases of up to 15% for certain buildings, and is often the largest return-on-investment for a green roof owner.">
</ArticleSlide>

  <ArticleSlide 
  header="How do you get a green roof?"
  content="Starting the installation process almost always begins with a design and structural integrity review of the roof, which can be conducted by NYC Department of Environmental Protection (DEP) engineers. New buildings may include green roofs in their design, but retrofitting a green roof on an older building often means determining the roof’s weight capacity, planning for emergency roof access and installing the necessary additional roof layers. The DEP lists about five-to-six necessary layers of a green roof; the root barrier, water-proofing layer, drainage layer, filter fabric, growing media and finally, the vegetation. If a building needs multiple adjustments to support a green roof, that can drive initial costs up.<br><br>In New York City, a simple extensive roof with thin soil can cost between $15 and $25 per square foot, whereas premium intensive roofs can cost $35 to $65 per square foot, or even more. More expensive versions can support people, gardens and amenity spaces, but most “green roofs are not typically meant to be walked on,” says Burchell.<br><br>Regardless of roof type, the city offers two routes to offset upfront costs. New Yorkers can apply for a one-time tax abatement, offering between $10 to $15 back per square foot, depending on the building’s location. The NYC Department of Environmental Protection also offers a green infrastructure grant for projects worth at least $50,000, although with higher standards to apply.">
  </ArticleSlide>

  <ArticleSlide 
  header="Is a green roof right for your property?"
  content="Once the roof is installed, there’s also maintenance to consider. Narendra Paramanand, sustainable facilities analyst at the NYC Department of Parks and Recreation, oversees 42 different green roofs and has separate maintenance schedules for all of them. In the first two years after installation, this is a crucial period to keep the roof functioning. This is because plants have a higher chance of dying in the first two years, so Paramanand recommends “a lot more watering” and weeding. After this initial period, watering the plants becomes less important, but continuous weeding and clearing the building’s drains becomes a priority. If drains become clogged, he says, “that may lead to standing water on the roof, which can lead to leaks.” Unwanted weeds can also damage roof layers, which is why green roofs are a time commitment.<br><br>Extensive roofs typically need to be checked about once a year, but intensive roofs with larger, or native plant types “require a lot more maintenance,” he says. In New York, green roof maintenance comes with a typical price tag of “$0.85 to $1.30 per square foot per year,” according to Urban Strong estimates.">
  <div class="component-box">
    <YearSlider />
  </div>
  </ArticleSlide>

  <ArticleSlide 
  header="How do green roofs differ from other forms of eco-friendly infrastructure?"
  content="Green infrastructure is the general term for a number of different eco-friendly structures, including various types of building roofs outlined by the DEP. For example, cool roofs are typically painted white to reflect hot sunlight, reducing heat. Blue roofs are designed to hold stormwater. Both are cheaper to install but don’t support vegetation, and green roofs provide the benefits of both.<br><br>Green roofs can also support solar panels. “Vegetation passively cools the air below the solar panel,” which increases panel performance, says Burchell. In warmer months, solar panels on green roofs can see a “ten-to-sixteen percent boost in electrical production,” compared to those on normal rooftops.">
  </ArticleSlide>

  <ArticleSlide 
  header="How many neighborhoods have green roofs?">
  </ArticleSlide>

  <Scroller top={0.1} bottom={0.9} bind:progress={scrollProgress}>
    <div slot="background" class="map-background">
      <div style="opacity: {1 - scrollProgress}; transition: opacity 0.3s ease;">
        <Map
          longitude={-73.92}
          latitude={40.74}
          zoom={9.7}
          minZoom={9.7}
          maxZoom={9.7}
          fitBoundsAtMinZoom={true}
          height={600}
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

      <div style="position: absolute; top: 0rem; left: 0; width: 100%; opacity: {scrollProgress}; transition: opacity 0.3s ease;">
        <Map
          longitude={-73.92}
          latitude={40.74}
          zoom={9.7}
          minZoom={9.5}
          maxZoom={14.5}
          fitBoundsAtMinZoom={true}
          height={600}
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
              'fill-opacity': ['case', ['==', ['get', 'pointCount'], 0], 0, 1.0],
              'fill-outline-color': ['case', ['==', ['get', 'pointCount'], 0], 'rgba(0,0,0,0)', '#123c0d'],
            }}
          />
        </Map>
      </div>
    </div>

    <div slot="foreground" class="map-foreground">
      <section style="margin-top: 0; min-height: 200vh;"></section>

      <section style="margin-top: 0;">
        <div class="text-overlay">
            <p>This map indicates every green roof in NYC, according to available data.</p>
          </div>
        </section>

      <section>
        <div class="text-overlay">
          <p>Despite recent citywide incentives, the number of NYC green roofs haven’t increased much in the last ten years.</p>
        </div>
      </section>

      <section>
        <div class="text-overlay">
          <p>In 2016, the Nature Conservancy estimated “730 buildings with green roofs.” <br><br>In 2026, there are 736 green roofs.</p>
        </div>
      </section>

      <section>
        <div class="text-overlay">
          <p>That's only six more than in 2016.</p>
        </div>
      </section>

      <section>
        <div class="text-overlay">
          <p>For New Yorkers looking to start the process, an easy first step is the NYC DEP website, which offers grant workshops to help determine eligibility and installation advice. Installing a green roof might feel daunting and costly, but it’s also adding to a small, growing list of rooftop greenspaces that offer a tremendous amount of benefits to the city and its residents.</p>
        </div>
      </section>
      <section style="min-height: 300vh;"></section>
    </div>
  </Scroller>

  {#if scrollProgress > 0.90}
    <div class="geocoder-container" style="opacity: {Math.min(1, (scrollProgress - 0.90) / 0.10)}; transition: opacity 0.3s ease;">
      <h2>Find Your Neighborhood</h2>
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
  {/if}

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
    width: 100%;
  }

  section {
    width: 100%;
    align-items: center;
    min-height: 120vh;
    padding: var(--spacing-lg) 0;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    justify-content: center;
  }

  .text-overlay {
    max-width: 500px;
    padding: var(--spacing-lg);
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .text-overlay h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1.5rem;
  }

  .text-overlay p {
    margin: 0;
    line-height: 1.6;
  }

  .component-box {
    background-color: #f0f9f7;
    border-radius: 12px;
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
  }

  .geocoder-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 500px;
    width: 90%;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    padding: var(--spacing-lg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 20;
    pointer-events: auto;

    h2 {
      margin: 0 0 var(--spacing-md) 0;
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
</style>
