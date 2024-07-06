import { BimapOps, ijo, truncateFiles, type SummaryFiles } from '$lib'
import { content } from '$lib/content.server'
import type { EntryGenerator, PageServerLoad, RouteParams } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const index = content.post
	const pageIndices = index.filesByDate.filter(idx => (params.lang ?? 'tok') in content.post.files[idx] && content.post.files[idx].tok.matter.kule === params.kule).toReversed()

	return {
		files: pageIndices.map(idx => ({ ...truncateFiles(index.files[idx]), idx } as SummaryFiles & { idx: number })),
		slugs: BimapOps.filterValue(index.slugs, idx => pageIndices.includes(idx)),
		tagSlugs: index.tagSlugs,
		language: params.lang ?? 'tok',
		kule: params.kule,
	}
}

export const entries: EntryGenerator = () => {
	const ret: RouteParams[] = []
	for (const kule of ijo) {
		ret.push({
			lang: 'sp',
			kule,
		})
		ret.push({
			lang: undefined,
			kule,
		})
	}
	return ret
}
