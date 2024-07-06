<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
    onMount(() => {
        window.document.documentElement.lang = data.lang
    })
    const prefix = data.lang === 'tok' ? '' : '/sp'
</script>

<svelte:head><title>{data.file.matter.title} | lipu kule</title></svelte:head>
<div class="flex justify-center">
	<div class="w-full max-w-2xl px-4">
		<div class="flex gap-4">
			<address class="not-italic">{i18n[data.lang].list['jan-pali'].format({ janpali: data.file.matter.janpali.map(x => i18n[data.lang]['jan-pali'][x]).join("　")})}</address>
		<span>{i18n[data.lang].list['nanpa-nimi'].format({ nanpa: data.file.wordCount })}</span>
		</div>
		<h2 class="font-bold text-3xl">{data.file.matter.title}</h2>
    	{#if data.file.matter.thumbnail}
	    <img class="rounded-lg h-48 w-full object-cover" src="{data.file.matter.thumbnail}" alt="Thumbnail" />
    	{/if}
		<div class="prose prose-lg dark:prose-invert">
			{@html data.file.content}
		</div>
		<div class="w-full flex justify-between">
			{#if data.next}
			<a class="p-2 bg-black/10 backdrop-saturate-150 rounded-lg" href={prefix}{data.next.url}>
				{i18n[data.lang].previous}{data.next.title}
			</a>
			{:else}
			<div></div>
			{/if}
			{#if data.prev}
			<a class="p-2 bg-black/10 backdrop-saturate-150 rounded-lg" href="{prefix}{data.prev.url}">
				{i18n[data.lang].next}{data.prev.title}
			</a>
			{:else}
			<div></div>
			{/if}
		</div>
	</div>
</div>
