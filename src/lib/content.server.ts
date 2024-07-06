import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {remark} from 'remark'
import {unified} from 'unified'
import {matter} from 'vfile-matter'
import fs from 'node:fs'
import path from 'node:path'
import { object, string, parse, array, type InferOutput, optional } from 'valibot'
import slugify from '@sindresorhus/slugify'
import { countWords } from 'alfaaz'
import { makeIndex, getOrCreateByBasename, makeSort, BimapOps, type Index, type Sorted, truncateToSentence } from '$lib'
import stripMarkdown from 'strip-markdown'
import remarkGfm from 'remark-gfm'

const frontMatterSchema = object({
	title: string(),
	janpali: array(string()),
	date: string(),
	kule: string(),
	poki: array(string()),
	summary: optional(string()),
})

async function load() {
	const categories = await fs.promises.readdir(`./src/content/`)
	const categoricalIndex: Record<string, Index & Sorted> = {}
	for (const category of categories) {
		const files = await fs.promises.readdir(`./src/content/${category}`)

		const index = makeIndex()

		for (const file of files) {
			const location = path.join(`./src/content/${category}`, file)

			const data = await fs.promises.readFile(location, { encoding: 'utf8' })

			const suffixes = path.basename(location, ".md").split(".")
			const language = suffixes.length === 2 ? suffixes[1] : "tok"
			const basename = suffixes[0]

			const parsed = await unified()
				.use(remarkParse)
				.use(remarkGfm)
				.use(remarkRehype, { allowDangerousHtml: true })
				.use(remarkFrontmatter)
				.use(() => (_tree, file) => matter(file))
				.use(rehypeStringify, { allowDangerousHtml: true })
				.process(data)

			const plaintext = await remark()
				.use(remarkGfm)
				.use(remarkFrontmatter)
				.use(stripMarkdown)
				.process(data)

			let result: InferOutput<typeof frontMatterSchema>
			try {
				result = parse(frontMatterSchema, parsed.data.matter)
			} catch (e) {
				console.warn(file, e)
				continue
			}

			const dateResult = Date.parse(result.date)
			if (isNaN(dateResult)) {
				console.warn(file, result.date)
				continue
			}
			const date = new Date(dateResult)

			const fileIDX = getOrCreateByBasename(index, basename)
			index.files[fileIDX][language as 'tok' | 'sp'] = {
				matter: result,
				content: String(parsed),
				wordCount: countWords(String(parsed)),
				date,
				summary: result.summary ?? truncateToSentence(String(plaintext), 70),
			}
			const slug = slugify(result.title)
			if (slug !== '') {
				const fullSlug = [date.getUTCFullYear(), (date.getUTCMonth() + 1).toString().padStart(2, '0'), (date.getUTCDate()).toString().padStart(2, '0'), slug].join("/")
				BimapOps.set(index.slugs, fullSlug, fileIDX)
			}
		}

		categoricalIndex[category] = { ...index, ...makeSort(index) }
	}

	return categoricalIndex
}

export const content = await load()
