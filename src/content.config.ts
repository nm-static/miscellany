import { file, glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

// docs
const docsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/docs/data/docs" }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			sidebar: z
				.object({
					label: z.string().optional(),
					order: z.number().optional(),
					badge: z
						.object({
							text: z.string(),
							variant: z.enum(["note", "tip", "caution", "danger", "info"]).default("note"),
						})
						.optional(),
				})
				.optional(),
			tableOfContents: z
				.object({
					minHeadingLevel: z.number().min(1).max(6).optional(),
					maxHeadingLevel: z.number().min(1).max(6).optional(),
				})
				.optional(),
			pagefind: z.boolean().optional(),
			mappingKey: z.string().optional(),
			draft: z.boolean().optional(),
		}),
});

export const collections = {
	docs: docsCollection,
};
