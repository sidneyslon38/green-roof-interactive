<!--
@component
SoilSlider.svelte — Soil depth selection for green roof types

Vertical slider to select soil depth (2-12+ inches) and see what types of 
green roofs are suitable at each depth range.
-->
<script>
  let depthIndex = $state(0); // 0-100 scale mapped to 2-12+ inches

  // Map slider value to actual depth and display
  const depths = [
    { display: '2"', value: 2, type: 'Extensive Roof' },
    { display: '3"', value: 3, type: 'Extensive Roof' },
    { display: '4"', value: 4, type: 'Semi-Intensive Roof' },
    { display: '5"', value: 5, type: 'Semi-Intensive Roof' },
    { display: '6"', value: 6, type: 'Semi-Intensive Roof' },
    { display: '7"', value: 7, type: 'Semi-Intensive Roof' },
    { display: '8"', value: 8, type: 'Semi-Intensive Roof' },
    { display: '9"', value: 9, type: 'Intensive Roof' },
    { display: '10"', value: 10, type: 'Intensive Roof' },
    { display: '11"', value: 11, type: 'Intensive Roof' },
    { display: '12+"', value: 12, type: 'Intensive Roof' },
  ];

  const currentDepth = $derived(depths[depthIndex]);

  const getInfo = (depth) => {
    if (depth.value <= 4) {
      return {
        type: 'Extensive Green Roof',
        weightCapacity: '5–25 psf',
        vegetation: 'Sedum, sedge, moss, hardy groundcovers',
        maintenance: 'Low. Minimal watering after establishment.',
        cost: 'Low to moderate',
        benefits: 'Lightweight, ideal for retrofits and older buildings',
        description: 'Thin soil layer supporting hardy, drought-tolerant plants. Minimal weight and maintenance.',
      };
    } else if (depth.value <= 8) {
      return {
        type: 'Semi-Intensive Green Roof',
        weightCapacity: '35–60 psf',
        vegetation: 'Grasses, small shrubs, mixed perennials',
        maintenance: 'Moderate. Regular watering and seasonal care needed.',
        cost: 'Moderate',
        benefits: 'Good plant variety, balances weight and functionality',
        description: 'Medium soil depth supporting a wider range of vegetation. Balance between weight and aesthetic appeal.',
      };
    } else {
      return {
        type: 'Intensive Green Roof',
        weightCapacity: '60–200+ psf',
        vegetation: 'Trees, shrubs, perennials, grasses',
        maintenance: 'High. Regular irrigation, pruning, and management required.',
        cost: 'High',
        benefits: 'Near-garden experience, maximum insulation and biodiversity',
        description: 'Deep soil layer supporting trees and varied planting. Requires significant structural support and ongoing maintenance.',
      };
    }
  };

  const info = $derived(getInfo(currentDepth));
</script>

<div class="header">
  <h3>Choose Your Desired Roof Type</h3>
  <p>Slide to increase soil depth, and see how green roofs can differ.</p>
</div>

<div class="soil-slider">
  <div class="slider-box">
    <div class="depth-display">
      <div class="depth-value">{currentDepth.display}</div>
      <div class="depth-type">
        <p>Soil Depth</p>
      </div>
    </div>

    <input
      type="range"
      bind:value={depthIndex}
      min="0"
      max={depths.length - 1}
      step="1"
      class="vertical-slider"
    />
  </div>

  <div class="info-section">
    <div class="info-header">
      <h3>{info.type}</h3>
      <div class="weight-badge">{info.weightCapacity} capacity</div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <h4>Vegetation</h4>
        <p>{info.vegetation}</p>
      </div>

      <div class="info-item">
        <h4>Maintenance</h4>
        <p>{info.maintenance}</p>
      </div>

      <div class="info-item">
        <h4>Cost</h4>
        <p>{info.cost}</p>
      </div>

      <div class="info-item">
        <h4>Best For</h4>
        <p>{info.benefits}</p>
      </div>
    </div>

    <div class="info-description">
      <p>{info.description}</p>
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles' as *;

  .header {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);

    h3 {
      font-family: var(--font-sans);
      font-weight: var(--font-weight-medium);
      margin: 0 0 var(--spacing-md);
      color: var(--color-dark);
      text-align: center;
    }

    p {
      font-size: var(--font-size-base);
      font-family: var(--font-sans);
      color: var(--color-text);
      margin: 0;
    }
  }

  .soil-slider {
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
    display: flex;
    gap: var(--spacing-lg);
    align-items: stretch;

    @include mobile {
      flex-direction: column;
    }
  }

  .slider-box {
    display: flex;
    flex-direction: column;
    align-items: center;    justify-content: flex-end;    gap: var(--spacing-md);
    flex-shrink: 0;
    background: white;
    border: 2px solid var(--color-border);
    border-radius: 20px;
    padding: var(--spacing-lg);
    width: 120px;

    @include mobile {
      margin-bottom: var(--spacing-lg);
      width: 100%;
    }
  }

  .depth-display {
    text-align: center;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .depth-value {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
      margin-bottom: var(--spacing-md);
      height: 48px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .depth-type {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-normal);
      height: 40px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
  }

  .vertical-slider {
    width: 8px;
    height: 200px;
    border-radius: 4px;
    background: var(--color-border);
    outline: none;
    appearance: slider-vertical;
    -webkit-appearance: slider-vertical;
    flex-shrink: 0;
    accent-color: var(--color-accent);

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-accent);
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      border: none;
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

  .info-section {
    background: white;
    padding: var(--spacing-lg);
    border-radius: 20px;
    border: 1px solid var(--color-border);
    flex: 1;
    min-height: 420px;
  }

  .info-header {
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-md);

    h3 {
      font-family: var(--font-sans);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-normal);
      margin: 0;
      color: var(--color-dark);
    }

    .weight-badge {
      display: inline-block;
      background: var(--color-accent);
      color: white;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  .info-item {
    h4 {
      font-family: var(--font-sans);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-normal);
      margin: 0 0 var(--spacing-xs);
      color: var(--color-dark);
    }

    p {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      line-height: var(--leading-normal);
      margin: 0;
    }
  }

  .info-description {
    border-top: 1px solid var(--color-border);
    padding-top: var(--spacing-md);

    p {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      line-height: var(--leading-normal);
      margin: 0;
    }
  }
</style>
