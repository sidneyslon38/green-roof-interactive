<!--
@component
ArticleSlide.svelte — Individual text + graphic block

Renders a text section followed by an image/graphic.
Handles {newParagraph} markers to split text into multiple paragraphs.
-->
<script>
  let { header = '', content, photoFileName = '', photoCredit = '', photoPosition = 'bottom', children } = $props();
</script>

<section class="slide">
  {#if header}
    <h2 class="slide-header">{header}</h2>
  {/if}

  {#if photoPosition === 'top' && photoFileName}
    <div class="graphic">
      <img src={photoFileName} alt="Article illustration" />
      {#if photoCredit}
        <p class="photo-credit">{photoCredit}</p>
      {/if}
    </div>
  {/if}

  {#if content}
    <div class="text">
      <p>{@html content}</p>
    </div>
  {/if}

  {#if photoPosition === 'bottom' && photoFileName}
    <div class="graphic">
      <img src={photoFileName} alt="Article illustration" />
      {#if photoCredit}
        <p class="photo-credit">{photoCredit}</p>
      {/if}
    </div>
  {/if}

  {#if children}
    <div class="graphic">
      {@render children?.()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use '$lib/styles' as *;

  section.slide {
    padding: var(--spacing-2xl) 0;

    &:last-child {
      border-bottom: none;
    }
  }

  .slide-header {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark);
    margin: var(--spacing-xxl) 0 var(--spacing-lg) 0;
    text-align: left;
  }

  .text {
    margin: 0 auto var(--spacing-2xl);
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text);

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
  }

  .graphic {
    margin: var(--spacing-2xl) 0 0;

    img {
      margin-top: var(--spacing-lg);
      width: 100%;
      height: auto;
      display: block;
    }

    .photo-credit {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      font-style: italic;
      margin-top: var(--spacing-sm);
      line-height: var(--leading-tight);
    }
  }
</style>
