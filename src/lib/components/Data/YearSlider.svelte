<!--
@component
YearSlider.svelte — Building age and green roof capacity guide

Users slide to their building's construction year to see what types of green roofs
are structurally feasible based on historical construction standards.
-->
<script>
  import { base } from '$app/paths';

  let yearIndex = $state(0); // 0 = Pre-1900, 1-126 = 1900-2026
  let hasInteracted = $state(false); // Show info only after user interaction
  let typedYear = $state('');

  const minYear = 1900;
  const maxYear = 2026;

  // Create year options: Pre-1900, then 1900-2026
  const years = ['Pre-1900', ...Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)];
  const year = $derived(years[yearIndex]);

  $effect(() => {
    typedYear = year === 'Pre-1900' ? '' : String(year);
  });

  const applyTypedYear = () => {
    const parsedYear = Number.parseInt(typedYear, 10);

    if (Number.isNaN(parsedYear)) {
      return;
    }

    hasInteracted = true;

    if (parsedYear < minYear) {
      yearIndex = 0;
      return;
    }

    const clampedYear = Math.min(parsedYear, maxYear);
    yearIndex = clampedYear - minYear + 1;
    typedYear = String(clampedYear);
  };

  const getInfo = (y) => {
    if (y === 'Pre-1900' || y < 1968) {
      return {
        era: 'Pre-1900 to 1968',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        large: {
          type: "6+ stories (Apartments/Offices)",
          construction: 'Heavy masonry',
          capacity: 'High',
          roofType: 'Intensive roof',
          notes: 'Larger pre-1968 buildings were often <a href="{base}/https://www.sciencedirect.com/science/article/abs/pii/S1364032117313680">built</a> with heavy masonry construction, and can support heavier roof loads. It\'s a "myth" that older buildings can\'t support green roofs, says Burchell.',
          image: `${base}/photos/green_roof_photos/prewar-large.jpg`,
          credit: 'Pre-War Apartment Building / Charles Parker, Creative Commons',
        },
        small: {
          type: "1-6 stories (Townhouse)",
          construction: 'Timber roof joints, masonry walls',
          capacity: 'Low',
          roofType: 'Extensive roof or alternative system',
          notes: 'Unlike larger buildings, townhouses were not originally <a href="{base}/https://fontanarchitecture.com/adding-a-roof-deck-to-a-townhouse-in-nyc/">designed</a> for heavy loads, so lightweight extensive systems or alternative green roof solutions are recommended.',
          image: `${base}/photos/green_roof_photos/townhouse.jpg`,
          credit: 'Chelsea Townhouse / Wikimedia Commons',
        },
      };
    } else if (y < 1980) {
      return {
        era: '1968–1980',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        type: 'Post-1968 Construction Code',
        construction: 'Standard steel and concrete',
        capacity: 'Moderate',
        roofType: 'Lightweight extensive roof',
        notes: '1968 construction code <a href="{base}/https://up.codes/viewer/new_york_city/nyc-building-code-2022/chapter/16/structural-design#16">standardized</a> factors like wind and seismic loads, as well as rooftop weight capacity. Buildings built during this time period were more lightweight, with minimal reinforcement. They benefit from green roofs, because they waste more energy on heating and cooling due to poor insulation, but generally have a lower weight capacity without structural reinforcement.',
        image: `${base}/photos/green_roof_photos/modern.jpg`,
        credit: 'AT&T Long Lines Building, 1974 construction / Wikimedia Commons',
      };
    } else if (y < 2002) {
      return {
        era: '1980–2002',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        type: '"Transition Era"',
        construction: 'Steel or concrete deck',
        capacity: 'Moderate to High',
        roofType: 'Extensive or Semi-intensive roof',
        notes: 'In the 1980s, the city took a more proactive approach to building safety and began including more <a href="{base}/https://nychazardmitigation.com/documentation/nyc-hazard-environment/built/">hazard</a> considerations into construction, like flood risks. Buildings were slowly "transitioning" to higher efficiency and more structurally sound designs, and many built during this era can support semi-intensive or extensive green roofs, <a href="{base}/https://www.nyc.gov/html/ddc/downloads/pdf/cool_green_roof_man.pdf">according</a> to the NYC Department of Design and Construction. Like 1970s era buildings, they also tend to be less energy efficient, and can benefit more from green roofs in that aspect.',
        image: `${base}/photos/green_roof_photos/lipstick.jpg`,
        credit: 'The Lipstick Building, 1986 construction / Wikimedia Commons',
      };
    } else if (y < 2019) {
      return {
        era: '2002–2019',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        type: 'Modern Energy Code Era',
        construction: 'Steel or concrete with 2002 NYSECCC standards',
        capacity: 'High',
        roofType: 'Lightweight extensive recommended',
        notes: 'After the city adopted new energy efficiency standards in 2002, <a href="{base}/https://www.nyc.gov/html/ddc/downloads/pdf/cool_green_roof_man.pdf">buildings</a> were built to be better insulated, but were not yet designed for larger green infrastructure projects like green roofs. Modern steel or concrete decks built during this era can generally <a href="{base}/https://urbanstrong.com/green-roofs">support</a> semi-intensive or lighter extensive roofs, and construction code documented maximum roof load, so retrofitting for green roofs is more straightforward. Green roofs can still provide energy benefits, but the impact may be less significant than on older, less efficient buildings.',
        image: `${base}/photos/green_roof_photos/nyt.jpg`,
        credit: 'New York Times Building, 2007 construction / Scott Beale, Laughing Squid',
      };
    } else {
      return {
        era: '2019–Present',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        type: 'Sustainability Era',
        construction: 'Modern standards with pre-verified capacity',
        capacity: 'High',
        roofType: 'Pre-verified for green roof',
        notes: 'NYC Local Laws 92 and 94 of 2019 <a href="{base}/https://www.nyc.gov/site/buildings/codes/ll92-solar-green-roofs.page">require</a> roof weight capacity to be pre-verified during design phase for fully saturated systems. They also require new buildings or rooftop renovations to consider a green roof or solar system. Today\'s buildings can support any form of green roof with the right planning.',
        image: `${base}/photos/green_roof_photos/new.jpg`,
        credit: 'J.P. Morgan Chase Tower, 2025 construction / Wikimedia Commons',
      };
    }
  };

  const info = $derived(getInfo(year));
</script>

<div class="header">
  <h2>Explore Building Capacities</h2>
  <p>Type or slide to a construction year to see what types of green roofs are structurally feasible based on historical construction standards.</p>
</div>
<div class="year-slider">
  <div class="year-input">
    <label>
      <input
        class="year-display typed-year-input"
        type="text"
        bind:value={typedYear}
        placeholder={year}
        inputmode="numeric"
        pattern="[0-9]*"
        onblur={applyTypedYear}
        onkeydown={(event) => {
          if (event.key === 'Enter') {
            applyTypedYear();
          }
        }}
      />
      <input
        type="range"
        bind:value={yearIndex}
        min="0"
        max="127"
        step="1"
        onchange={() => (hasInteracted = true)}
      />
      <span class="range-label">Pre-1900 to 2026</span>
    </label>
  </div>

  {#if hasInteracted}
    <div class="info-section" class:two-boxes={!!info.large}>
    <div class="era-badge">Your building was built: {year}</div>
    <div class:muted-header={!info.large} class="type-header" aria-hidden={!info.large}>{info.typeHeader}</div>

    {#if info.large}
      <div class="building-info stacked-photo">
        <div class="building-info-copy">
          <div class="building-type">
            <h4>{info.large.type}</h4>
            <p class="construction">{info.large.construction}</p>
          </div>
          <div class="capacity-badge capacity-{info.large.capacity.toLowerCase()}">
            Capacity: {info.large.capacity}
          </div>
          <div class="recommendation">
            <p><strong>Green Roof Type:</strong> {info.large.roofType}</p>
            <p>{@html info.large.notes}</p>
          </div>
        </div>
        <div class="photo-slot" aria-hidden="true">
          {#if info.large.image}
            <img src={info.large.image} alt={info.era} />
          {/if}
          {#if info.large.credit}
            <p class="photo-credit">{info.large.credit}</p>
          {/if}
        </div>
      </div>

      <div class="building-info stacked-photo">
        <div class="building-info-copy">
          <div class="building-type">
            <h4>{info.small.type}</h4>
            <p class="construction">{info.small.construction}</p>
          </div>
          <div class="capacity-badge capacity-{info.small.capacity.toLowerCase()}">
            Capacity: {info.small.capacity}
          </div>
          <div class="recommendation">
            <p><strong>Green Roof Type:</strong> {info.small.roofType}</p>
            <p>{@html info.small.notes}</p>
          </div>
        </div>
        <div class="photo-slot" aria-hidden="true">
          {#if info.small.image}
            <img src={info.small.image} alt={info.era} />
          {/if}
          {#if info.small.credit}
            <p class="photo-credit">{info.small.credit}</p>
          {/if}
        </div>
      </div>
    {:else}
      <div class="building-info">
        <div class="building-info-copy">
          <div class="building-type">
            <h4>{info.type}</h4>
            <p class="construction">{info.construction}</p>
          </div>
          <div class="capacity-badge capacity-{info.capacity.toLowerCase()}">
            Capacity: {info.capacity}
          </div>
          <div class="recommendation">
            <p><strong>Green Roof Type:</strong> {info.roofType}</p>
            <p>{@html info.notes}</p>
          </div>
        </div>
        <div class="photo-slot" aria-hidden="true">
          {#if info.image}
            <img src={info.image} alt={info.era} />
          {/if}
          {#if info.credit}
            <p class="photo-credit">{info.credit}</p>
          {/if}
        </div>
      </div>
    {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '$lib/styles' as *;

  .header {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);

    h2 {
      font-family: var(--font-serif);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-5xl);
      margin: 0 0 var(--spacing-md);
      color: var(--color-dark);
      text-align: center;
    }

    p {
      font-size: var(--font-size-base);
      font-family: var(--font-sans);
      color: var(--color-text);
      margin-left: var(--spacing-lg);
    }
  }

  .year-slider {
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
  }

  .year-input {
    margin-bottom: var(--spacing-lg);

    label {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      font-weight: var(--font-weight-semibold);
    }

    .year-display {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
      text-align: center;
      padding: var(--spacing-md);
      background: white;
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
    }

    .typed-year-input {
      width: 100%;
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
      font: inherit;
      color: var(--color-accent);

      &::placeholder {
        color: var(--color-text-secondary);
      }

      &:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    input[type="range"] {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: var(--color-border);
      outline: none;
      appearance: none;
      -webkit-appearance: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-accent);
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-accent);
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    .range-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      text-align: center;
      font-weight: var(--font-weight-normal);
    }
  }

  .info-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);

    &.two-boxes {
      grid-template-columns: 1fr 1fr;
    }
  }

  .era-badge {
    display: inline-block;
    background: var(--color-accent);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    width: fit-content;
    grid-column: 1 / -1;
  }

  .type-header {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-muted);
    font-style: italic;
    margin: var(--spacing-sm) 0 0;
    line-height: var(--leading-tight);
    grid-column: 1 / -1;
  }

  .muted-header {
    visibility: hidden;
  }

  .era-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-normal);
    margin-top: var(--spacing-xs);
    grid-column: 1 / -1;
  }

  .building-info {
    background: white;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(140px, 220px);
    gap: var(--spacing-md);
    align-items: center;
  }

  .building-info-copy {
    min-width: 0;
  }

  .photo-slot {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background:
      linear-gradient(135deg, rgba(48, 198, 75, 0.14), rgba(18, 60, 13, 0.22)),
      linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.45));
    background-blend-mode: screen;
    justify-self: end;
    align-self: center;
    overflow: visible;
    display: flex;
    flex-direction: column;

    img {
      width: 100%;
      flex: 1;
      object-fit: cover;
      display: block;
      border-radius: 4px 4px 0 0;
    }

    .photo-credit {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-style: italic;
      padding: var(--spacing-xs);
      margin: 0;
      background: white;
      border-radius: 0 0 4px 4px;
      border-top: 1px solid var(--color-border);
      line-height: var(--leading-tight);
    }
  }

  .stacked-photo {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .photo-slot {
      justify-self: start;
      margin-top: auto;
      align-self: flex-start;
    }
  }

  .stacked-photo .building-info-copy {
    flex: 1;
  }

  .building-type {
    margin-bottom: var(--spacing-md);

    h4 {
      font-family: var(--font-sans);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-normal);
      margin: 0 0 var(--spacing-xs);
      color: var(--color-dark);
    }

    .construction {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0;
    }
  }

  .capacity-badge {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-md);

    &.capacity-low {
      background: #ffe8e8;
      color: #c41e3a;
    }

    &.capacity-moderate {
      background: #fff4e6;
      color: #d97706;
    }

    &.capacity-high {
      background: #e8f5e9;
      color: #2e7d32;
    }
  }

  .recommendation {
    font-size: var(--font-size-sm);
    line-height: var(--leading-normal);
    color: var(--color-text);

    p {
      margin: 0 0 var(--spacing-xs);

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        font-weight: var(--font-weight-semibold);
      }
    }
  }

  @include mobile {
    .year-slider {
      padding: var(--spacing-md);
    }

    .year-input .year-display {
      font-size: var(--font-size-2xl);
      padding: var(--spacing-sm);
    }

    .building-info {
      padding: var(--spacing-sm);
      grid-template-columns: 1fr;
    }

    .photo-slot {
      justify-self: start;
      width: min(100%, 240px);
    }

    .building-type h4 {
      font-size: var(--font-size-base);
    }

    .capacity-badge {
      font-size: var(--font-size-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
    }

    .info-section.two-boxes {
      grid-template-columns: 1fr; /* stack vertically on small screens */
    }
  }
</style>
