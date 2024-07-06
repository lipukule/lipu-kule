import { BimapOps, type Files } from '$lib'
import { content } from '$lib/content.server'

export async function load({ params }: { params: {
	lang?: string
	number?: string
}}) {
	const index = content.post
	const pageSize = 6
	const page = params.number ? Number(params.number) : 1
	const pagesOfLanguage = index.files.filter(x => (params.lang ?? 'tok') in x)
	const pageIndices = index.filesByDate.filter(idx => (params.lang ?? 'tok') in content.post.files[idx]).toReversed().slice((page-1) * pageSize, page * pageSize)

	return {
		files: pageIndices.map(idx => ({ ...index.files[idx], idx } as Files & { idx: number })),
		slugs: BimapOps.filterValue(index.slugs, idx => pageIndices.includes(idx)),
		tagSlugs: index.tagSlugs,
		pageNumber: page,
		pages: Math.ceil(pagesOfLanguage.length / pageSize),
		language: params.lang ?? 'tok',
	}
}