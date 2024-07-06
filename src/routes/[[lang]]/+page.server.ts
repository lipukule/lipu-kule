import { BimapOps, type Files } from '$lib'
import { content } from '$lib/content.server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const index = content.post
	const pageSize = 6
	const page = Number(params.number)
	const pagesOfLanguage = index.files.filter(x => (params.lang ?? 'tok') in x)
	const pageIndices = index.filesByDate.filter(idx => (params.lang ?? 'tok') in content.post.files[idx]).toReversed().slice((page-1) * pageSize, page * pageSize)

	return {
		files: pageIndices.map(idx => ({ ...index.files[idx], idx } as Files & { idx: number })),
		slugs: BimapOps.filterValue(index.slugs, idx => pageIndices.includes(idx)),
		pageNumber: page,
		pages: (pagesOfLanguage.length / pageSize)|0,
		language: params.lang ?? 'tok',
	}
}
