<!--
  MultiImage.stories.svelte

  Stories for the MultiImage component.
  MultiImage renders 2+ boxed images with a slight overlap.
-->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MultiImage from '$lib/components/Article/MultiImage.svelte';

  const { Story } = defineMeta({
    title: 'Article/MultiImage',
    component: MultiImage,
    tags: ['autodocs'],
    argTypes: {
      title: {
        control: 'text',
        description: 'Optional heading above the image stack',
      },
      description: {
        control: 'text',
        description: 'Optional intro text above the images',
      },
      overlap: {
        control: { type: 'radio' },
        options: ['right', 'left'],
        description: 'Controls which side the images overlap toward',
      },
      images: {
        control: 'object',
        description: 'Array of 2+ image objects with src, alt, caption, and credit',
      },
    },
    args: {
      title: 'A small image stack',
      description:
        'Use this component anywhere in a page to present two or more images as overlapping boxed cards.',
      overlap: 'right',
      images: [
        {
          src: '/photos/storybook/steady.jpg',
          alt: 'A person holding a camera on a rooftop',
          caption: 'Rooftop detail one',
          credit: 'CUNY J-School',
        },
        {
          src: '/photos/storybook/lamp.jpg',
          alt: 'A lamp lit in a newsroom-style setting',
          caption: 'Rooftop detail two',
          credit: 'CUNY J-School',
        },
      ],
    },
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Two-image stack',
    description: 'A simple overlapping pair that can fit inside an article body.',
    images: [
      {
        src: '/photos/storybook/steady.jpg',
        alt: 'First example image',
        caption: 'First card caption',
        credit: 'Example credit',
      },
      {
        src: '/photos/storybook/lamp.jpg',
        alt: 'Second example image',
        caption: 'Second card caption',
        credit: 'Example credit',
      },
    ],
  }}
/>

<Story
  name="Three Images"
  args={{
    title: 'Three-image stack',
    description: 'More than two images will continue the same overlapping treatment.',
    images: [
      {
        src: '/photos/storybook/crusher.jpg',
        alt: 'First example image',
        caption: 'First',
      },
      {
        src: '/photos/storybook/glasses.jpg',
        alt: 'Second example image',
        caption: 'Second',
      },
      {
        src: '/photos/storybook/glazer.jpg',
        alt: 'Third example image',
        caption: 'Third',
      },
    ],
  }}
/>

<Story
  name="Left Overlap"
  args={{
    title: 'Left overlap',
    overlap: 'left',
    images: [
      {
        src: '/photos/storybook/steady.jpg',
        alt: 'First example image',
        caption: 'First card caption',
      },
      {
        src: '/photos/storybook/lamp.jpg',
        alt: 'Second example image',
        caption: 'Second card caption',
      },
    ],
  }}
/>