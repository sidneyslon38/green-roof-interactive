<!--
@component
ArticleHeader.svelte — NYCity News Service Style Article Header

Displays the headline and metadata line with icons in the NYCity style:
- Optional kicker (eyebrow label) above the headline
- Large serif headline (via Headline subcomponent)
- Bordered metadata box with date (via Pubdate) and authors (via Byline)

USAGE EXAMPLE:
<ArticleHeader
  headline="City Council Approves New Budget"
  kicker="City Hall"
  byline="Jane Smith, John Doe"
  pubDate="2024-01-15"
/>
-->
<script>
  import Kicker from './Kicker.svelte';
  import Headline from './Headline.svelte';
  import Byline from './Byline.svelte';
  import Pubdate from './Pubdate.svelte';

  import { base } from '$app/paths';

  let {
    headline, // Required: The main title of the article
    kicker = '', // Optional: Eyebrow label rendered above the headline
    byline = '', // Optional: The author's name(s)
    pubDate = '', // Optional: Publication date in YYYY-MM-DD format
    photoFileName = `${base}/photos/green_roof_photos/green_roof_header.jpg`, // Optional hero image
    photoCredit = '',
    hero = false, // Whether to render the hero banner
    photoPosition = 'center',
  } = $props();
</script>

{#if hero}
  <header class="article-hero">
    <div
      class="hero"
      style="background-image: url({photoFileName});"
      role="img"
      aria-label="Article hero image"
    >
      <div class="hero-overlay">
        <Kicker text={kicker} />
        <Headline text={headline} />

        {#if byline || pubDate}
          <div class="meta hero-meta">
            {#if byline}
              <div class="meta-item meta-byline">
                <Byline {byline} />
              </div>
            {/if}
            {#if pubDate}
              <div class="meta-item meta-date">
                <Pubdate date={pubDate} />
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    {#if photoCredit}
      <div class="hero-credit">{photoCredit}</div>
    {/if}
  </header>
{:else}
  <header class="article-header">
    <Kicker text={kicker} />
    <Headline text={headline} />

    {#if byline || pubDate}
      <div class="meta">
        {#if byline}
          <div class="meta-item meta-byline">
            <svg
              class="meta-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            <Byline {byline} />
          </div>
        {/if}

        {#if pubDate}
          <div class="meta-item meta-date">
            <svg
              class="meta-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 6v6l4 2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <Pubdate date={pubDate} />
          </div>
        {/if}
      </div>
    {/if}
  </header>
{/if}

<style lang="scss">
  @use '../../styles' as *;

  .article-header {
    margin-bottom: var(--spacing-md);
  }

  .meta {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
    padding: var(--font-size-xs) var(--spacing-sm);
    border-left: var(--border-width-accent) solid var(--color-accent);
    background-color: var(--color-light-gray);
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .meta-icon {
    color: var(--color-accent);
    flex-shrink: 0;
  }

  /* Override Byline styles inside the meta box */
  .meta-byline :global(.byline) {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-dark);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    margin: 0;
  }

  /* Override Pubdate styles inside the meta box */
  .meta-date :global(.pubdate) {
    font-size: var(--font-size-sm);
    color: var(--color-medium-gray);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    margin: 0;
  }

  /* Tablet and up: inline meta */
  @include tablet {
    .meta {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacing-sm);
    }
  }

  /* Hero styles */
  .article-hero {
    margin-bottom: var(--spacing-md);
  }

  .hero {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    position: relative;
    margin-left: calc(-50vw + 50%);
  }

  .hero-overlay {
    width: 100%;
    max-width: 600px;
    color: var(--color-white);
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 20%;
    margin-right: auto;
    margin-top: -150px;
    position: sticky;
    top: 315px;
    z-index: 10;
  }

  .hero .kicker,
  .hero .headline {
    text-align: left;
  }

  .hero .meta {
    background-color: transparent;
    border-left: none;
    padding: 0;
  }

  .hero .meta-byline :global(.byline) {
    color: var(--color-dark);
  }

  .hero .meta-date :global(.pubdate) {
    color: var(--color-dark);
  }

  .hero-credit {
    font-size: var(--font-size-sm);
    text-align: right;
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    margin-right: var(--spacing-lg);
    margin-left: auto;
    max-width: 600px;
  }

  @include mobile {
    .hero {
      height: clamp(180px, 30vh, 300px);
      align-items: flex-end; /* keep text lower on small screens */
    }

    .hero-overlay {
      padding: var(--spacing-sm);
    }
  }
</style>
