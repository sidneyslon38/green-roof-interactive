<!--
@component
YearSlider.svelte — Building age and green roof capacity guide

Users slide to their building's construction year to see what types of green roofs
are structurally feasible based on historical construction standards.
-->
<script>
  let yearIndex = $state(0); // 0 = Pre-1900, 1-126 = 1900-2026
  let hasInteracted = $state(false); // Show info only after user interaction

  // Create year options: Pre-1900, then 1900-2026
  const years = ['Pre-1900', ...Array.from({ length: 127 }, (_, i) => 1900 + i)];
  const year = $derived(years[yearIndex]);

  const getInfo = (y) => {
    if (y === 'Pre-1900' || y < 1968) {
      return {
        era: 'Pre-1900 to 1968',
        typeHeader: '"Prior-Code" Construction includes buildings built before the 1968 Building Code was implemented.',
        large: {
          type: "6+ stories (Apartments/Offices)",
          construction: 'Heavy masonry, "over-engineered"',
          capacity: 'High',
          roofType: 'Heavy intensive green roof',
          notes: 'Often designed to support heavy loads.',
        },
        small: {
          type: "1-6 stories (Townhouse)",
          construction: 'Timber roof joints, masonry walls',
          capacity: 'Low',
          roofType: 'Extensive or alternative system',
          notes: 'Not designed for heavy loads. Extensive roofs (5–25 psf) or other sustainable types recommended.',
        },
      };
    } else if (y < 1980) {
      return {
        era: '1968–1980',
        type: '"Pre-Modern" Construction',
        construction: 'Standard steel and concrete',
        capacity: 'Moderate',
        roofType: 'Lightweight extensive (16–35 psf)',
        notes: 'Lower weight capacities than pre-1968. Lightweight extensive systems work with minimal reinforcement. Heavier intensive systems (60–200 psf) almost always require significant structural reinforcement.',
      };
    } else if (y < 2002) {
      return {
        era: '1980–2002',
        type: '"Transition Era" Construction',
        construction: 'Steel or concrete deck',
        capacity: 'Moderate to High',
        roofType: 'Semi-intensive (35–60 psf)',
        notes: 'Building code was slowly transitioning to adopt modern efficiency standards. Baseline capacity typically accommodates semi-intensive systems without major reinforcement.',
      };
    } else if (y < 2019) {
      return {
        era: '2002–2019',
        type: 'Modern Energy Code Era',
        construction: 'Steel or concrete with 2002 NYSECCC standards',
        capacity: 'High',
        roofType: 'Lightweight extensive recommended',
        notes: 'Built to 2002 New York State Energy Conservation Construction Code. Easier to measure weight capacity for lightweight green roofs.',
      };
    } else {
      return {
        era: '2019–Present',
        type: '"Sustainable Roofing" Era',
        construction: 'Modern standards with pre-verified capacity',
        capacity: 'High',
        roofType: 'Pre-verified for green roof',
        notes: 'NYC LL 92 and 94 of 2019 require roof weight capacity to be pre-verified during design phase for fully saturated systems. Likely designed to support at least a lightweight extensive green roof.',
      };
    }
  };

  const info = $derived(getInfo(year));
</script>

<div class="header">
  <h3>Select Your Building Age</h3>
  <p>Slide to your building's construction year to see what types of green roofs are structurally feasible based on historical construction standards.</p>
</div>
<div class="year-slider">
  <div class="year-input">
    <label>
      <div class="year-display">{year}</div>
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
    <div class="type-header">{info.typeHeader}</div>

    {#if info.large}
      <div class="building-info">
        <div class="building-type">
          <h4>{info.large.type}</h4>
          <p class="construction">{info.large.construction}</p>
        </div>
        <div class="capacity-badge capacity-{info.large.capacity.toLowerCase()}">
          Capacity: {info.large.capacity}
        </div>
        <div class="recommendation">
          <p><strong>Green Roof Type:</strong> {info.large.roofType}</p>
          <p>{info.large.notes}</p>
        </div>
      </div>

      <div class="building-info">
        <div class="building-type">
          <h4>{info.small.type}</h4>
          <p class="construction">{info.small.construction}</p>
        </div>
        <div class="capacity-badge capacity-{info.small.capacity.toLowerCase()}">
          Capacity: {info.small.capacity}
        </div>
        <div class="recommendation">
          <p><strong>Green Roof Type:</strong> {info.small.roofType}</p>
          <p>{info.small.notes}</p>
        </div>
      </div>
    {:else}
      <div class="building-info">
        <div class="building-type">
          <h4>{info.type}</h4>
          <p class="construction">{info.construction}</p>
        </div>
        <div class="capacity-badge capacity-{info.capacity.toLowerCase()}">
          Capacity: {info.capacity}
        </div>
        <div class="recommendation">
          <p><strong>Green Roof Type:</strong> {info.roofType}</p>
          <p>{info.notes}</p>
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

    h3 {
      font-family: var(--font-sans);
      font-weight: var(--font-weight-normal);
      margin: 0 0 var(--spacing-md);
      color: var(--color-dark);
      text-align: center;
    }

    p {
      font-size: var(--font-size-base);
      color: var(--color-text);
      margin: 0;
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
    color: var(--color-dark);
    margin: 0;
    grid-column: 1 / -1;
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
