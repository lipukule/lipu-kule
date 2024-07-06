<script lang="ts">
	import { ijo, poki, type Bimap, type Files } from '$lib';
	import PageList from '$lib/PageList.svelte';
	import { i18n } from './i18n';

    export let data: {
        files: (Files & { idx: number })[]
        slugs: Bimap<string, number>
        tagSlugs: Bimap<string, string>
        pageNumber: number
        pages: number
        language: string
    }
    const ijoj = ijo.map(x => ({ nimi: x, kule: poki[x] }))

    const rawLeftSide = Math.max(data.pageNumber - 3, 0)
    const rightSide = Math.min(rawLeftSide + 5, data.pages+1)

    const leftSide = rightSide - rawLeftSide <= 5 ?
        Math.max(rightSide - 5, 0) :
        rawLeftSide

    const pages = Array.from(
        { length: (rightSide - leftSide - 1) },
        (_value, idx) => leftSide + idx + 1
    )
    const prefix = data.language === 'tok' ? '' : '/sp'
</script>

<style scoped>
    .pageItem {
        @apply py-2 px-4 rounded-full hover:bg-laso/50 inline-block;
    }
    .active {
        @apply bg-laso hover:bg-lasewi;
    }
    .disabled {
        @apply opacity-50 hover:bg-transparent cursor-default;
    }
</style>

<div class="flex justify-center">
    <div class="max-w-screen-2xl px-8 w-full">
        <div class="prose dark:prose-invert">
            <h1 class="mb-0">
                {i18n[data.language].index['lipu-sin']}
            </h1>

            <p class="mt-0">
                {i18n[data.language].index['o-lukin']}
            </p>
        </div>

        <div class="flex flex-row gap-2 pb-4">
            {#each ijoj as ijo}
                <a href='{prefix}/kule/{ijo.nimi}' class="rounded-full px-2 py-1 border-2 border-{ijo.kule} bg-{ijo.kule}/25">{i18n[data.language].kule[ijo.nimi]}</a>
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 max-w-screen-2xl">
        <PageList data={data.files} slugs={data.slugs} lang={data.language} tagSlugs={data.tagSlugs} root="post"/>
    </div>
</div>

<nav class="flex justify-center py-2">
    <div class="flex flex-row">
        <a class="pageItem" class:disabled={1 === data.pageNumber} href={1 === data.pageNumber ? undefined : `${prefix}/page/1`}>
            {i18n[data.language].pagination.open}
        </a>
        <a class="pageItem" class:disabled={1 === data.pageNumber} href={1 === data.pageNumber ? undefined : `${prefix}/page/${data.pageNumber-1}`}>
            {i18n[data.language].pagination.sin}
        </a>
        {#each pages as page}
            <a class="pageItem" class:active={page === data.pageNumber} href={page === data.pageNumber ? undefined : `${prefix}/page/${page}`}>{page}</a>
        {/each}
        <a class="pageItem" class:disabled={data.pages === data.pageNumber} href={data.pages === data.pageNumber ? undefined : `${prefix}/page/${data.pageNumber+1}`}>
            {i18n[data.language].pagination.majuna}
        </a>
        <a class="pageItem" class:disabled={data.pages === data.pageNumber} href={data.pages === data.pageNumber ? undefined : `${prefix}/page/${data.pages}`}>
            {i18n[data.language].pagination.pini}
        </a>
    </div>
</nav>
