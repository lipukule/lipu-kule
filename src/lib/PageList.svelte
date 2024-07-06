<script lang="ts">
	import { poki, type Bimap, BimapOps, type SummaryFiles } from "$lib";
	import { i18n } from "./i18n";

	const classes = `
	bg-lojunu
	bg-loje
	bg-lojelo
	bg-jelo
	bg-graso
	bg-laso
	bg-blaso
	bg-lasewi
	bg-lasunu
	bg-unu

	bg-lojunu/25
	bg-loje/25
	bg-lojelo/25
	bg-jelo/25
	bg-graso/25
	bg-laso/25
	bg-blaso/25
	bg-lasewi/25
	bg-lasunu/25
	bg-unu/25

	dark:bg-lojunu/25
	dark:bg-loje/25
	dark:bg-lojelo/25
	dark:bg-jelo/25
	dark:bg-graso/25
	dark:bg-laso/25
	dark:bg-blaso/25
	dark:bg-lasewi/25
	dark:bg-lasunu/25
	dark:bg-unu/25

	border-lojunu
	border-loje
	border-lojelo
	border-jelo
	border-graso
	border-laso
	border-blaso
	border-lasewi
	border-lasunu
	border-unu
	`

	export let data: (SummaryFiles & { idx: number })[]
	export let slugs: Bimap<string, number>
	export let tagSlugs: Bimap<string, string>
	export let lang: string
	export let root: string

	const prefix = lang === 'tok' ? '/' : '/sp/'
</script>

{#each data as file}
	{@const variant = file[lang]}
    <div class="rounded-lg bg-{poki[variant.matter.kule]} dark:bg-{poki[variant.matter.kule]}/25">
    	{#if variant.matter.thumbnail}
        <div class="rounded-t-lg h-48 w-full bg-black/10 backdrop-saturate-150 relative text-white">
            <img class="rounded-t-lg h-48 w-full object-cover absolute -z-20" src="{variant.matter.thumbnail}" alt="Thumbnail"/>
            <div class="rounded-t-lg h-48 w-full absolute -z-10 bg-black/40"></div>
            <div class="flex px-4 pt-4 gap-4">
                {#each variant.matter.janpali as pali}
                <address class="not-italic">{i18n[lang]['jan-pali'][pali]}&nbsp;</address>
                {/each}
            </div>
            <h2 class="px-4 font-bold text-xl"><a href={`${prefix}${root}/` + BimapOps.getValue(slugs, file.idx)}>{variant.matter.title}</a></h2>
        </div>
    	{:else}
        <div class="rounded-t-lg h-48 w-full bg-black/10 backdrop-saturate-150">
            <div class="flex px-4 pt-4 gap-4">
                {#each variant.matter.janpali as pali}
                <address class="not-italic">{i18n[lang]['jan-pali'][pali]}&nbsp;</address>
                {/each}
            </div>
            <h2 class="px-4 font-bold text-xl"><a href={`${prefix}${root}/` + BimapOps.getValue(slugs, file.idx)}>{variant.matter.title}</a></h2>
        </div>
    	{/if}
        <p class="px-4 pt-2 text-gray-800 dark:text-white/70">
            {variant.summary}
        </p>
            <div class="px-4 pt-2 pb-4">
                {#each variant.matter.poki as poki}
                    <a class="bg-black/10 backdrop-saturate-150 px-2 py-1 rounded-full" href="{prefix}poki/{BimapOps.getValue(tagSlugs, poki)}">#{i18n[lang]['poki'][poki]}</a>{' '}
                {/each}
            </div>
    </div>
{/each}
