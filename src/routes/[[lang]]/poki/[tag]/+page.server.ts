import { BimapOps, truncateFiles, type SummaryFiles } from '$lib'
import { content } from '$lib/content.server'
import type { EntryGenerator, PageServerLoad, RouteParams } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const index = content.post
	const poki = BimapOps.getKey(index.tagSlugs, params.tag)!
	const pageIndices = index.filesByDate.filter(idx => (params.lang ?? 'tok') in content.post.files[idx] && content.post.files[idx].tok.matter.poki.includes(poki)).toReversed()

	return {
		files: pageIndices.map(idx => ({ ...truncateFiles(index.files[idx]), idx } as SummaryFiles & { idx: number })),
		slugs: BimapOps.filterValue(index.slugs, idx => pageIndices.includes(idx)),
		tagSlugs: index.tagSlugs,
		language: params.lang ?? 'tok',
		poki,
	}
}

export const entries: EntryGenerator = () => {
	const result = [] as RouteParams[]
	const index = content.post
	for (const language of [undefined, 'sp']) {
		for (const key of index.tagSlugs.from.keys()) {
			result.push({
				lang: language,
				tag: key,
			})
		}
	}
	return result
}
