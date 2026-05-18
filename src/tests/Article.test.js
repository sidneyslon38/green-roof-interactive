import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Headline from '$lib/components/Article/Headline.svelte';
import Kicker from '$lib/components/Article/Kicker.svelte';
import MultiImage from '$lib/components/Article/MultiImage.svelte';
import RelatedLinks from '$lib/components/Article/RelatedLinks.svelte';

describe('Headline', () => {
  it('renders the headline text', () => {
    render(Headline, { props: { text: 'Breaking News' } });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Breaking News'
    );
  });

  it('renders nothing when text is empty', () => {
    const { container } = render(Headline, { props: { text: '' } });
    expect(container.querySelector('h1')).toBeNull();
  });
});

describe('Kicker', () => {
  it('renders the kicker text', () => {
    render(Kicker, { props: { text: 'EXCLUSIVE' } });
    expect(screen.getByText('EXCLUSIVE')).toBeTruthy();
  });

  it('renders nothing when text is empty', () => {
    const { container } = render(Kicker, { props: { text: '' } });
    expect(container.querySelector('p')).toBeNull();
  });
});

describe('MultiImage', () => {
  const images = [
    {
      src: '/photos/storybook/steady.jpg',
      alt: 'First image',
      caption: 'First caption',
      credit: 'First credit',
    },
    {
      src: '/photos/storybook/lamp.jpg',
      alt: 'Second image',
      caption: 'Second caption',
      credit: 'Second credit',
    },
  ];

  it('renders multiple images in overlapping cards', () => {
    render(MultiImage, { props: { title: 'Gallery', images } });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Gallery'
    );
    expect(screen.getByAltText('First image')).toBeTruthy();
    expect(screen.getByAltText('Second image')).toBeTruthy();
  });

  it('renders captions and credits for each image', () => {
    render(MultiImage, { props: { images } });
    expect(screen.getByText('First caption')).toBeTruthy();
    expect(screen.getByText('First credit')).toBeTruthy();
    expect(screen.getByText('Second caption')).toBeTruthy();
    expect(screen.getByText('Second credit')).toBeTruthy();
  });

  it('renders nothing when no images are provided', () => {
    const { container } = render(MultiImage, { props: { images: [] } });
    expect(container.querySelector('section')).toBeNull();
  });
});

describe('RelatedLinks', () => {
  const links = [
    { headline: 'Story One', href: '/story-one' },
    { headline: 'Story Two', href: '/story-two' },
  ];

  it('renders a list of links', () => {
    render(RelatedLinks, { props: { links } });
    expect(screen.getByText('Story One')).toBeTruthy();
    expect(screen.getByText('Story Two')).toBeTruthy();
  });

  it('uses the default title', () => {
    render(RelatedLinks, { props: { links } });
    expect(screen.getByText('RELATED STORIES')).toBeTruthy();
  });

  it('accepts a custom title', () => {
    render(RelatedLinks, { props: { title: 'MORE NEWS', links } });
    expect(screen.getByText('MORE NEWS')).toBeTruthy();
  });

  it('renders nothing when links array is empty', () => {
    const { container } = render(RelatedLinks, { props: { links: [] } });
    expect(container.querySelector('aside')).toBeNull();
  });
});
