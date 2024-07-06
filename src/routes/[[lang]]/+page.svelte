<script lang="ts">
	import FrontPage from "$lib/FrontPage.svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	export let data: PageData

    onMount(() => {
        window.document.documentElement.lang = data.lang
    })
</script>

<FrontPage data={data}/>