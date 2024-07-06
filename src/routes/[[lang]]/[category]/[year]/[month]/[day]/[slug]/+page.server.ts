import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { BimapOps, next, prev, type Index, type Sorted } from '$lib'
import { content } from '$lib/content.server';

function card(n: number, category: string, index: Sorted & Index, language: string): { title: string; url: string } {
	return {
		title: index.files[n][language].matter.title,
		url: '/' + category + '/' + BimapOps.getValue(index.slugs, n)!
	}
}

export const load: PageServerLoad = async ({ parent, params }) => {
	const index = content[params.category]

	const basename = BimapOps.getKey(index.slugs, `${params.year}/${params.month}/${params.day}/${params.slug}`)
	if (basename === undefined) {
		error(404, 'not found')
	}
	const nextIndex = next(index, basename, params.lang ?? 'tok')
	const prevIndex = prev(index, basename, params.lang ?? 'tok')
	if (!((params.lang ?? 'tok') in index.files[basename])) {
		error(404, 'not found')
	}

	return {
		file: index.files[basename][params.lang as 'tok'|'sp' ?? 'tok'],
		next: nextIndex ? card(nextIndex, params.category, index, params.lang ?? 'tok') : undefined,
		prev: prevIndex ? card(prevIndex, params.category, index, params.lang ?? 'tok') : undefined,
		lang: params.lang as 'tok'|'sp' ?? 'tok',
	}
}
