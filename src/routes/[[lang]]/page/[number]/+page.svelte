<script lang="ts">
	import { ijo, poki } from '$lib';
	import PageList from '$lib/PageList.svelte';
    import type { PageData } from './$types';

    export let data: PageData
    const ijoj = ijo.map(x => ({ nimi: x, kule: poki[x] }))

    const rawLeftSide = Math.max(data.pageNumber - 3, 0)
    const rightSide = Math.min(rawLeftSide + 5, data.pages+1)

    const leftSide = rightSide - rawLeftSide <= 5 ?
        Math.max(rightSide - 5, 0) :
        rawLeftSide

    const pages = Array.from(
        { length: (rightSide - leftSide) },
        (_value, idx) => leftSide + idx + 1
    )
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
                lipu sin pi lipu kule
            </h1>

            <p class="mt-0">
                ni li lipu sin pi lipu kule. o lukin e ona!
            </p>
        </div>

        <div class="flex flex-row gap-2 pb-4">
            {#each ijoj as ijo}
                <a href='.' class="rounded-full px-2 py-1 border-2 border-{ijo.kule} bg-{ijo.kule}/25">{ijo.nimi}</a>
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 max-w-screen-2xl">
        <PageList data={data.files} slugs={data.slugs} lang={data.language} root="post"/>
    </div>
</div>

<nav class="flex justify-center py-2">
    <div class="flex flex-row">
        <a class="pageItem" class:disabled={1 === data.pageNumber} href={1 === data.pageNumber ? undefined : '1'}>open</a>
        <a class="pageItem" class:disabled={1 === data.pageNumber} href={1 === data.pageNumber ? undefined : `${data.pageNumber-1}`}>sin</a>
        {#each pages as page}
            <a class="pageItem" class:active={page === data.pageNumber} href={page === data.pageNumber ? undefined : `${page}`}>{page}</a>
        {/each}
        <a class="pageItem" class:disabled={data.pages === data.pageNumber} href={data.pages === data.pageNumber ? undefined : `${data.pageNumber+1}`}>majuna</a>
        <a class="pageItem" class:disabled={data.pages === data.pageNumber} href={data.pages === data.pageNumber ? undefined : `${data.pages}`}>pini</a>
    </div>
</nav>
