<!--
@component
MultiImage.svelte — Overlapping image stack

Renders two or more images as boxed cards that partially overlap.
Useful for before/after comparisons, small galleries, and visual callouts.

USAGE EXAMPLE:
<MultiImage
	title="Green roof details"
	description="A small stack of images can add visual context inside an article section."
	images={[
		{ src: '/photos/storybook/steady.jpg', alt: 'A close-up of a rooftop scene', caption: 'Close-up detail', credit: 'Photo credit' },
		{ src: '/photos/storybook/lamp.jpg', alt: 'A second related image', caption: 'Supporting image', credit: 'Photo credit' },
	]}
/>
-->
<script>
	import { asset } from '$app/paths';

	let {
		title = '',
		description = '',
		images = [],
		overlap = 'right',
	} = $props();

	const resolvedImages = $derived(
		images.map((image) => ({
			...image,
			resolvedSrc:
				image.src.startsWith('/') && !image.src.startsWith('//')
					? asset(image.src)
					: image.src,
		}))
	);
</script>

{#if resolvedImages.length > 0}
	<section
		class="multi-image"
		aria-label={title || 'Image stack'}
	>
		{#if title || description}
			<div class="multi-image__intro">
				{#if title}
					<h3>{title}</h3>
				{/if}

				{#if description}
					<p>{description}</p>
				{/if}
			</div>
		{/if}

		<div class="multi-image__stack" class:stack-left={overlap === 'left'}>
			{#each resolvedImages as image, index}
				<figure
					class="multi-image__card"
					style={`z-index: ${resolvedImages.length - index};`}
				>
					<div class="multi-image__frame">
						<img src={image.resolvedSrc} alt={image.alt} loading="lazy" />
					</div>

					{#if image.caption || image.credit}
						<figcaption class="multi-image__caption">
							{#if image.caption}
								<span class="multi-image__caption-text">{image.caption}</span>
							{/if}

							{#if image.credit}
								<span class="multi-image__credit">{image.credit}</span>
							{/if}
						</figcaption>
					{/if}
				</figure>
			{/each}
		</div>
	</section>
{/if}

<style lang="scss">
	@use '../../styles' as *;

	.multi-image {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		margin: var(--spacing-lg) 0;
	}

	.multi-image__intro {
		max-width: 56rem;
		text-align: center;

		h3 {
			margin: 0 0 var(--spacing-xs);
			font-family: var(--font-sans);
			font-size: var(--font-size-xl);
			font-weight: var(--font-weight-semibold);
			color: var(--color-dark);
		}

		p {
			margin: 0;
			color: var(--color-text);
			line-height: var(--leading-relaxed);
		}
	}

	.multi-image__stack {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		overflow: visible;
	}

	.multi-image__card {
		width: min(100%, 340px);
		margin: 0;
		padding: calc(var(--spacing-xs) * 0.75);
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: 18px;
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
		transition: transform 0.2s ease, box-shadow 0.2s ease;

		&:not(:first-child) {
			margin-left: -2.5rem;
			transform: translateY(1.05rem);
		}

		&:hover {
			box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
			transform: translateY(0.35rem);
		}

		&:nth-child(3) {
			transform: translateY(-0.1rem);
		}
	}

	.stack-left .multi-image__card {
		&:not(:first-child) {
			margin-left: 0;
			margin-right: -2.5rem;
		}
	}

	.multi-image__frame {
		overflow: hidden;
		border-radius: 12px;
		background: var(--color-light-gray);
		aspect-ratio: 4 / 3;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	.multi-image__caption {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) * 0.5);
		padding: calc(var(--spacing-xs) * 0.75) calc(var(--spacing-xs) * 0.5) 0;
	}

	.multi-image__caption-text {
		font-size: var(--font-size-sm);
		line-height: var(--leading-caption);
		color: var(--color-text);
	}

	.multi-image__credit {
		font-size: var(--font-size-xs);
		color: var(--color-medium-gray);
		font-style: italic;
	}

	@include mobile {
		.multi-image__stack {
			flex-direction: column;
			align-items: center;
		}

		.multi-image__card {
			width: 100%;
			max-width: 340px;

			&:not(:first-child) {
				margin-left: 0;
				margin-right: 0;
				margin-top: -0.75rem;
				transform: none;
			}

			&:hover {
				transform: none;
			}
		}
	}
</style>
