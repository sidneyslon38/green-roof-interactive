<!--
@component
CostCalculator.svelte — Green roof energy savings calculator

Shows potential heating and cooling savings based on energy bill input
and heating/cooling split (default 56% heating, 1% cooling per EIA data).
-->
<script>
  let monthlyValue = $state(100); // Editable when isMonthlyActive
  let annualValue = $state(1200); // Editable when not isMonthlyActive
  let isMonthlyActive = $state(true); // Which input is active/editable
  let hasInteracted = $state(false); // Show results only after user interaction

  // Sync values based on which one is actively being edited
  $effect(() => {
    if (isMonthlyActive) {
      annualValue = Math.round(monthlyValue * 12 * 100) / 100;
    } else {
      monthlyValue = Math.round(annualValue / 12 * 100) / 100;
    }
  });

  // Use the annual value for calculations
  const activeAnnualBill = $derived(isMonthlyActive ? monthlyValue * 12 : annualValue);

  // Hardcoded savings range: 2.2% to 16.7%
  const savingsLow = $derived(activeAnnualBill * 0.022);
  const savingsHigh = $derived(activeAnnualBill * 0.167);

  // Monthly/annual display
  const displaySavingsLow = $derived(isMonthlyActive ? savingsLow / 12 : savingsLow);
  const displaySavingsHigh = $derived(isMonthlyActive ? savingsHigh / 12 : savingsHigh);
  const timeframe = $derived(isMonthlyActive ? 'per month' : 'per year');
</script>

<div class="calculator">
<div class="header">
<h2>Explore Green Roof Savings</h2>
<p>Type in a bill amount to calculate green roof savings on heating and cooling.</p>
</div>
  <div class="input-section">
    <div
      class="input-box"
      role="button"
      tabindex="0"
      onclick={() => (isMonthlyActive = true)}
      onkeydown={(e) => e.key === 'Enter' && (isMonthlyActive = true)}
    >
      <label class:inactive={!isMonthlyActive}>
        Estimated Monthly Energy Cost
        <input
          type="number"
          bind:value={monthlyValue}
          min="0"
          step="0.01"
          disabled={!isMonthlyActive}
          onchange={() => (hasInteracted = true)}
        />
      </label>
    </div>

    <div
      class="input-box"
      role="button"
      tabindex="0"
      onclick={() => (isMonthlyActive = false)}
      onkeydown={(e) => e.key === 'Enter' && (isMonthlyActive = false)}
    >
      <label class:inactive={isMonthlyActive}>
        Estimated Annual Energy Cost
        <input
          type="number"
          bind:value={annualValue}
          min="0"
          step="0.01"
          disabled={isMonthlyActive}
          onchange={() => (hasInteracted = true)}
        />
      </label>
    </div>
  </div>

  {#if hasInteracted}
    <div class="results">
      <div class="result-box">
        <h4>A green roof could reduce costs by...</h4>
        <div class="range">
          <p class="min">${displaySavingsLow.toFixed(2)}</p>
          <p class="dash">–</p>
          <p class="max">${displaySavingsHigh.toFixed(2)}</p>
        </div>
        <p class="label">{timeframe}</p>
        <p class="description">
          Green roof savings are based on <a href="https://www.epa.gov/green-infrastructure/lower-building-energy-demands">Environmental Protection Agency (EPA)</a> data, which estimates energy savings on heating and cooling by approximately 2 to 16%.
        </p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '$lib/styles' as *;

  .calculator {
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
  }

  .header {
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

  .input-section {
    margin: var(--spacing-lg) 0;
    margin-bottom: var(--spacing-lg);
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    width: 100%;

    .input-box {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-lg);
      cursor: pointer;
      transition: background-color 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      flex: 1;

      &:hover {
        background-color: #9ab48a;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-sm);
        text-align: center;
        align-items: center;

        &.inactive {
          opacity: 0.5;
          color: var(--color-text-secondary);
        }

        input {
          padding: var(--spacing-sm);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          font-size: var(--font-size-base);
          width: 120px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;

          &:disabled {
            background: var(--color-bg-secondary);
            color: var(--color-text-secondary);
            cursor: pointer;
            border-color: transparent;
          }

          &:enabled {
            background: white;
            color: var(--color-text);

            &:focus {
              outline: none;
              border-color: var(--color-accent);
              box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
            }

            &:hover {
              border-color: var(--color-accent);
            }
          }
        }
      }
    }
  }

  .results {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  .result-box {
    background: white;
    padding: var(--spacing-md);
    border-radius: 20px;
    border: 1px solid var(--color-border);
    text-align: center;

    h4 {
      font-family: var(--font-sans);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-normal);
      margin: 0 0 var(--spacing-sm);
      color: var(--color-dark);
    }

    .range {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);

      p {
        margin: 0;
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent);
      }

      .dash {
        color: var(--color-text-secondary);
      }
    }

    .label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0;
    }

    .description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: var(--spacing-sm) 0 0;
      line-height: var(--leading-normal);
    }
  }

  @include mobile {
    .calculator {
      padding: var(--spacing-md);
    }

    .header h3 {
      font-size: var(--font-size-xl);
    }

    .input-section {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .input-box {
      padding: var(--spacing-md);
      flex: none;
      width: 100%;
    }

    .input-box label input {
      width: 100%;
      max-width: 100%;
    }

    .result-box .range p {
      font-size: var(--font-size-xl);
    }

    .result-box h4 {
      font-size: var(--font-size-base);
    }
  }
</style>