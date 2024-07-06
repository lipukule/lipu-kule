<script lang="ts">
	import { i18n } from '$lib/i18n';
	import './app.css';
	import type { PageData } from './$types';
	import { setContext } from 'svelte';

	const classes = `
	to-lojunu
	to-loje
	to-lojelo
	to-jelo
	to-graso
	to-laso
	to-blaso
	to-lasewi
	to-lasunu
	to-unu

	dark:to-lojunu/25
	dark:to-loje/25
	dark:to-lojelo/25
	dark:to-jelo/25
	dark:to-graso/25
	dark:to-laso/25
	dark:to-blaso/25
	dark:to-lasewi/25
	dark:to-lasunu/25
	dark:to-unu/25
	`;

	export let data: PageData;
</script>

<div
	class={data.kule
		? `
	bg-fixed bg-gradient-to-tr dark:text-white overflow-auto h-screen w-screen
	bg-cream
	from-cream via-cream to-${data.kule}
	dark:bg-dark-cream
	dark:from-dark-cream dark:via-dark-cream dark:to-${data.kule}/25
	`
		: `
	bg-fixed bg-gradient-to-tr dark:text-white overflow-auto h-screen w-screen
	bg-cream
	from-cream-orange via-cream to-cream-red
	dark:bg-dark-cream
	dark:from-dark-cream-orange dark:via-dark-cream dark:to-dark-cream-red`}
	lang={data.lang}
>
	<header class="flex flex-row justify-between p-6">
		<div class="flex flex-row space-x-4">
			<a href="{data.lang === 'tok' ? '/' : '/sp'}"><h1>{i18n[data.lang].header['lipu-kule']}</h1></a>
			<!-- <a onclick="opensearch()"><h1>{{ i18n "header.ilo-alasa" }}</h1></a> -->
		</div>
		<a href="https://discord.gg/TmReVRxG8Z"><h1>{i18n[data.lang].header['o-kama-sitelen']}</h1></a
		>
	</header>

	<slot />

	<footer class="flex flex-col content-center justify-center items-center py-4">
		<div class="max-w-screen-2xl px-8 w-full flex justify-between">
			<div>
				<p>
					<a class="underline" href="https://discord.gg/TmReVRxG8Z"
						>{i18n[data.lang].footer.discord}</a
					>
				</p>
				<p>
					<a class="underline" href="https://t.me/lipukule">{i18n[data.lang].footer.telegram}</a>
				</p>
			</div>
			<div class="text-right">
				<p>
					{i18n[data.lang].footer.license}
				</p>
				<p>
					{i18n[data.lang].footer['toki-pona']}
				</p>
			</div>
		</div>
	</footer>
</div>
