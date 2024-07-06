import { BimapOps, type Files } from '$lib'
import { content } from '$lib/content.server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const index = content.post
	const poki = BimapOps.getKey(index.tagSlugs, params.tag)!
	const pageIndices = index.filesByDate.filter(idx => (params.lang ?? 'tok') in content.post.files[idx] && content.post.files[idx].tok.matter.poki.includes(poki)).toReversed()

	return {
		files: pageIndices.map(idx => ({ ...index.files[idx], idx } as Files & { idx: number })),
		slugs: BimapOps.filterValue(index.slugs, idx => pageIndices.includes(idx)),
		tagSlugs: index.tagSlugs,
		language: params.lang ?? 'tok',
		poki,
	}
}
