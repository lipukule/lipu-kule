// place files you want to import through the `$lib` alias in this folder.

export type FrontMatter = {
	title: string
	janpali: string[]
	kule: string
	poki: string[]
	summary?: string
}

export type File = {
	matter: FrontMatter
	content: string
	wordCount: number
	date: Date
	summary: string
}

export type Files = {
	[language: string]: File
}

export type Index = {
	files: Files[]
	basenames: Bimap<string, number>
	slugs: Bimap<string, number>
}

export type Sorted = {
	filesByDate: number[]
}

export function makeIndex(): Index {
	return { files: [], slugs: BimapOps.make(), basenames: BimapOps.make() }
}

export function makeSort(index: Readonly<Index>): Sorted {
	const filesByDate = index.files.map((v, idx) => [v, idx] as const)
		.toSorted((a, b) => a[0].tok.date.getTime() - b[0].tok.date.getTime())
		.map((_, idx) => idx)
	return { filesByDate }
}

export function next(index: Sorted, file: number): number | undefined {
	const idx = index.filesByDate.findIndex(x => x === file)
	if (idx === -1) {
		return undefined
	}
	if (idx+1 >= index.filesByDate.length) {
		return undefined
	}
	return idx+1
}

export function prev(index: Sorted, file: number): number | undefined {
	const idx = index.filesByDate.findIndex(x => x === file)
	if (idx === -1) {
		return undefined
	}
	if (idx-1 < 0) {
		return undefined
	}
	return idx-1
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
