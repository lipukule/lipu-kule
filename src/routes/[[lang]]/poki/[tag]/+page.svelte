<script lang="ts">
	import PageList from "$lib/PageList.svelte";
	import { onMount } from "svelte";
    import type { PageData } from "./$types";
	import { i18n } from "$lib/i18n";
	import { ijo, poki } from '$lib'
    export let data: PageData
    onMount(() => {
        window.document.documentElement.lang = data.language
    })
    const prefix = data.language === 'tok' ? '' : '/sp'
    const ijoj = ijo.map(x => ({ nimi: x, kule: poki[x] }))
</script>

<div class="flex justify-center">
    <div class="max-w-screen-2xl px-8 w-full">
        <div class="prose dark:prose-invert">
            <h1 class="mb-0">
                #{i18n[data.language].poki[data.poki]}
            </h1>

            <p class="mt-0">
            	{i18n[data.language].list["nanpa-lipu"].format({ nanpa: data.files.length })}
            </p>
        </div>

        <div class="flex flex-row gap-2 pb-4">
            {#each ijoj as ijo}
                <a href='{prefix}/kule/{ijo.nimi}' class="rounded-full px-2 py-1 border-2 border-{ijo.kule} {ijo.nimi === data.kule ? `bg-${ijo.kule}` : `bg-${ijo.kule}/25`}">{i18n[data.language].kule[ijo.nimi]}</a>
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 max-w-screen-2xl">
        <PageList data={data.files} slugs={data.slugs} lang={data.language} tagSlugs={data.tagSlugs} root="post"/>
    </div>
</div>
