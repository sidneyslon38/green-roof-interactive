<!--
@component
SiteFooter.svelte — Site Footer Component (NYCity News Service Style)

A professional news-organization-style footer with multi-column layout,
CUNY branding, navigation links, and copyright notice.

USAGE EXAMPLE:
<SiteFooter />
-->
<script>
  import IconEmail from '$lib/components/Icons/IconEmail.svelte';
  import IconGitHub from '$lib/components/Icons/IconGitHub.svelte';
  import IconLinkedIn from '$lib/components/Icons/IconLinkedIn.svelte';
  import IconInstagram from '$lib/components/Icons/IconInstagram.svelte';
let {
    email = 'sidslon@gmail.com',
    github = 'sidneyslon38',
    linkedin = 'sidslon',
    instagram = 'sidslon',
    myName = 'Sidney Slon',
  } = $props();
const contacts = $derived(
    [
      email
        ? {
            href: `mailto:${email}`,
            label: 'Email',
            external: false,
            icon: IconEmail,
          }
        : null,
      github
        ? {
            href: `https://github.com/${github}`,
            label: 'GitHub',
            external: true,
            icon: IconGitHub,
          }
        : null,
      linkedin
        ? {
            href: `https://linkedin.com/in/${linkedin}`,
            label: 'LinkedIn',
            external: true,
            icon: IconLinkedIn,
          }
        : null,
      instagram
        ? {
            href: `https://instagram.com/${instagram}`,
            label: 'Instagram',
            external: true,
            icon: IconInstagram,
          }
        : null,
    ].filter(Boolean)
  );
const currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-main">
    <div class="footer-container">
      <div class="footer-col">
        <h3 class="footer-heading">Contact</h3>
        {#if contacts.length > 0}
          <nav aria-label="Footer contact links">
            <ul class="footer-list">
              {#each contacts as contact (contact.label)}
                {@const Icon = contact.icon}
                <li>
                  <a
                    href={contact.href}
                    class="footer-link"
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                  >
                    <Icon />
                    <span>{contact.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </nav>
        {/if}
      </div>
    </div>
  </div>

  <!-- Bottom bar with copyright -->
  <div class="footer-bottom">
    <div class="footer-container">
      <p class="footer-copyright">&copy; {myName}, {currentYear}</p>
    </div>
  </div>
</footer>

<style lang="scss">
  @use '../../styles' as *;

  .site-footer {
    margin-top: var(--spacing-xxl);
  }

  .footer-main {
    background-color: var(--color-dark-background);
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .footer-container {
    max-width: var(--max-width-wide);
    margin: 0 auto;
  }

  /* Column headings */
  .footer-heading {
    text-align: center;
    color: var(--color-white);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    margin-bottom: var(--spacing-sm);
    padding-bottom: var(--spacing-xs);
  }

  /* Link lists */
  .footer-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: 0;
    margin-bottom: var(--spacing-xl);
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-border);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    letter-spacing: var(--letter-spacing-wider);
    transition: var(--transition-color);
    white-space: nowrap;
  }

  .footer-link:hover {
    color: var(--color-white);
  }

  .footer-link :global(svg) {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }

  /* Bottom copyright bar */
  .footer-bottom {
    background-color: var(--color-dark-background);
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: center;
  }

  .footer-copyright {
    color: var(--color-border);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    letter-spacing: var(--letter-spacing-wide);
    margin: 0;
  }

  /* Tablet and up: multi-column layout */
  @include tablet {
    .footer-list {
      gap: var(--spacing-md);
    }
  }
</style>
