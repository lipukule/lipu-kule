import type { LayoutServerLoad } from './$types'
import { content } from '$lib/content.server'
import { BimapOps, poki } from '$lib'

export const load: LayoutServerLoad = async ({ params }) => {
	let kule: string | undefined = undefined
	if (params.category !== undefined && params.year !== undefined && params.month !== undefined && params.day !== undefined && params.slug !== undefined) {
		const idx = BimapOps.getKey(content[params.category].slugs, `${params.year}/${params.month}/${params.day}/${params.slug}`)
		if (idx !== undefined) {
			kule = content[params.category].files[idx][params.lang ?? 'tok']?.matter?.kule
		}
	}

	return {
		lang: params.lang ?? 'tok',
		kule: kule ? poki[kule] : undefined,
	}
}
