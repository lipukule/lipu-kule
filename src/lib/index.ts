// place files you want to import through the `$lib` alias in this folder.

import slugify from "@sindresorhus/slugify"

export type FrontMatter = {
	title: string
	janpali: string[]
	kule: string
	poki: string[]
	summary?: string
	thumbnail?: string
}

export type File = {
	matter: FrontMatter
	content: string
	wordCount: number
	date: Date
	summary: string
}

export type SummaryFile = {
	matter: FrontMatter
	summary: string
	date: Date
	content?: never
}

export function truncate({ matter, summary, date }: File): SummaryFile {
	return { matter, summary, date }
}

export type Files = {
	[language: string]: File
}

export type SummaryFiles = {
	[language: string]: SummaryFile
}

export function truncateFiles(files: Files): SummaryFiles {
	return Object.fromEntries(Object.entries(files).map(([k, v]) => [k, truncate(v)]))
}

type Slugged = string & { __slugged: unknown }
type Raw = string & { __raw: unknown }

export type Index = {
	files: Files[]
	basenames: Bimap<string, number>
	slugs: Bimap<string, number>
}

export type Sorted = {
	filesByDate: number[]
}

export type Tagged = {
	tags: Map<string, Set<number>>
	tagSlugs: Bimap<Slugged, Raw>
}

export function makeIndex(): Index {
	return { files: [], slugs: BimapOps.make(), basenames: BimapOps.make() }
}

export function makeTag(index: Readonly<Index>): Tagged {
	const tagged: Tagged = { tags: new Map(), tagSlugs: BimapOps.make() }
	index.files.forEach((files, idx) => {
		const tags = new Set<string>()
		Object.values(files).forEach((file) => {
			file.matter.poki.forEach(x => tags.add(x))
		})
		for (const tag of tags) {
			if (!tagged.tags.has(tag)) {
				tagged.tags.set(tag, new Set())
			}
			tagged.tags.get(tag)!.add(idx)
			const slugged = slugify(tag)
			BimapOps.set(tagged.tagSlugs, slugged, tag)
		}
	})
	return tagged
}

export function makeSort(index: Readonly<Index>): Sorted {
	const filesByDate = index.files.map((v, idx) => [v, idx] as const)
		.toSorted((a, b) => a[0].tok.date.getTime() - b[0].tok.date.getTime())
		.map((_, idx) => idx)
	return { filesByDate }
}

export function next(index: Index & Sorted, file: number, language: string): number | undefined {
	const theseFiles = index.filesByDate.filter(x => language in index.files[x])
	const idx = theseFiles.findIndex(x => x === file)
	if (idx === -1) {
		return undefined
	}
	if (idx+1 >= theseFiles.length) {
		return undefined
	}
	return theseFiles[idx+1]
}

export function prev(index: Index & Sorted, file: number, language: string): number | undefined {
	const theseFiles = index.filesByDate.filter(x => language in index.files[x])
	const idx = theseFiles.findIndex(x => x === file)
	if (idx === -1) {
		return undefined
	}
	if (idx-1 < 0) {
		return undefined
	}
	return theseFiles[idx-1]
}

export function getOrCreateByBasename(index: Index, basename: string): number {
	if (!BimapOps.hasKey(index.basenames, basename)) {
		index.files.push({} as any)
		BimapOps.set(index.basenames, basename, index.files.length-1)
	}
	return BimapOps.getKey(index.basenames, basename)!
}

export type Bimap<K, V> = {
	from: Map<K, V>
	to: Map<V, K>
}

export const BimapOps = {
	make<K, V>(): Bimap<K, V> {
		return { from: new Map(), to: new Map() }
	},
	hasKey<K, V>(self: Bimap<K, V>, it: K) {
		return self.from.has(it)
	},
	hasValue<K, V>(self: Bimap<K, V>, it: V) {
		return self.to.has(it)
	},
	getKey<K, V>(self: Bimap<K, V>, it: K) {
		return self.from.get(it)
	},
	getValue<K, V>(self: Bimap<K, V>, it: V) {
		return self.to.get(it)
	},
	set<K, V>(self: Bimap<K, V>, k: K, v: V) {
		self.from.set(k, v)
		self.to.set(v, k)
	},
	filterKey<K, V>(self: Bimap<K, V>, predicate: (it: K) => boolean): Bimap<K, V> {
		const entries = Array.from(self.from.entries()).filter(([k]) => predicate(k))
		return {
			from: new Map(entries),
			to: new Map(entries.map(([a, b]) => [b, a]))
		}
	},
	filterValue<K, V>(self: Bimap<K, V>, predicate: (it: V) => boolean): Bimap<K, V> {
		const entries = Array.from(self.to.entries()).filter(([k]) => predicate(k))
		return {
			from: new Map(entries.map(([a, b]) => [b, a])),
			to: new Map(entries)
		}
	}
}

const space = /\s/g

function isEndOfSentence(r: string): boolean {
	return r == '.' || r == '?' || r == '!' || r == '"' || r == '\n' || r === '　'
}

export function truncateToSentence(str: string, limit: number) {
	let wordCount = 0
	let lastWordIndex = -1

	const strA = Array.from(str)
	for (let idx = 0; idx < strA.length; idx++) {
		const rune = strA[idx]
		if (space.test(rune)) {
			wordCount++
			lastWordIndex = idx

			if (wordCount >= limit) {
				break
			}
		}
	}

	if (lastWordIndex === -1) {
		return str
	}

	let endIndex = -1

	const strASliced = strA.slice(lastWordIndex)
	for (let idx = 0; idx < strASliced.length; idx++) {
		const rune = strASliced[idx]
		if (isEndOfSentence(rune)) {
			endIndex = idx + lastWordIndex + 1
			break
		}
	}

	if (endIndex === -1) {
		return str
	}

	return strA.slice(0, endIndex).join('').trim()
}

export const poki = {
	'toki': 'lojunu',
	'ilo': 'loje',
	'sona': 'lojelo',
	'moku': 'graso',
	'musi': 'laso',
	'lon': 'lasewi',
	'ante': 'lasunu',
} as Record<string, string>

export const ijo = ['toki', 'ilo', 'sona', 'moku', 'musi', 'lon', 'ante']
