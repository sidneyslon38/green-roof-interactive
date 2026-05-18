<script>
  import { onMount } from 'svelte';

  let {
    background,
    foreground,
    top = 0,
    bottom = 1,
    threshold = 0.5,
    query = 'section',
    parallax = false,
    index = $bindable(0),
    count = $bindable(0),
    offset = $bindable(0),
    progress = $bindable(0),
    visible = $bindable(false)
  } = $props();

  let outer;
  let foregroundEl;
  let backgroundEl;
  let sections = [];
  let outerHeight = $state(0);
  let wh = $state(0);
  let fixed = $state(false);
  let offsetTop = $state(0);
  let width = $state(1);
  let inverted = false;

  const style = $derived(`position: ${fixed ? 'fixed' : 'absolute'}; top: 0; transform: translate(0, ${offsetTop}px); z-index: ${inverted ? 3 : 1};`);
  const widthStyle = $derived(fixed ? `width:${width}px;` : '');

  onMount(() => {
    sections = foregroundEl.querySelectorAll(query);
    count = sections.length;

    const updateAndMeasure = () => update();
    updateAndMeasure();

    window.addEventListener('scroll', updateAndMeasure);
    window.addEventListener('resize', updateAndMeasure);

    return () => {
      window.removeEventListener('scroll', updateAndMeasure);
      window.removeEventListener('resize', updateAndMeasure);
    };
  });

  function update() {
    if (!foregroundEl || !backgroundEl || !outer) return;

    const outerBounds = outer.getBoundingClientRect();
    width = outerBounds.right - outerBounds.left;

    const foregroundBounds = foregroundEl.getBoundingClientRect();
    outerHeight = foregroundBounds.bottom - foregroundBounds.top;
    outer.style.height = `${outerHeight}px`;

    const backgroundBounds = backgroundEl.getBoundingClientRect();

    visible = foregroundBounds.top < wh && foregroundBounds.bottom > 0;

    const foregroundHeight = foregroundBounds.bottom - foregroundBounds.top;
    const backgroundHeight = backgroundBounds.bottom - backgroundBounds.top;
    const topPx = Math.round(top * wh);
    const bottomPx = Math.round(bottom * wh);
    const thresholdPx = Math.round(threshold * wh);
    const availableSpace = bottomPx - topPx;

    progress = (topPx - foregroundBounds.top) / (foregroundHeight - availableSpace);

    if (progress <= 0) {
      offsetTop = 0;
      fixed = false;
    } else if (progress >= 1) {
      offsetTop = parallax
        ? foregroundHeight - backgroundHeight
        : foregroundHeight - availableSpace;
      fixed = false;
    } else {
      offsetTop = parallax
        ? Math.round(topPx - progress * (backgroundHeight - availableSpace))
        : topPx;
      fixed = true;
    }

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      const { top: sectionTop } = section.getBoundingClientRect();

      const next = sections[i + 1];
      const sectionBottom = next ? next.getBoundingClientRect().top : foregroundBounds.bottom;

      offset = (thresholdPx - sectionTop) / (sectionBottom - sectionTop);

      if (sectionBottom >= thresholdPx) {
        index = i;
        break;
      }
    }
  }
</script>

<svelte:window bind:innerHeight={wh} />

<svelte-scroller-outer bind:this={outer}>
  <svelte-scroller-background-container class="background-container" style="{style}{widthStyle}">
    <svelte-scroller-background bind:this={backgroundEl}>
      {@render background?.()}
    </svelte-scroller-background>
  </svelte-scroller-background-container>

  <svelte-scroller-foreground bind:this={foregroundEl}>
    {@render foreground?.()}
  </svelte-scroller-foreground>
</svelte-scroller-outer>

<style>
  svelte-scroller-outer {
    display: block;
    position: relative;
  }

  svelte-scroller-background {
    display: block;
    position: relative;
    width: 100%;
  }

  svelte-scroller-foreground {
    display: block;
    position: relative;
    z-index: 2;
  }

  svelte-scroller-foreground::after {
    content: ' ';
    display: block;
    clear: both;
  }

  svelte-scroller-background-container {
    display: block;
    position: absolute;
    width: 100%;
    max-width: 100%;
    pointer-events: none;
    will-change: transform;
  }
</style>
