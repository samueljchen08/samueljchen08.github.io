import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    /** Workpaper index. This is the sheet's address across the whole site. */
    index: z.string(),
    title: z.string(),
    /** The question the project set out to answer, in one line. */
    question: z.string(),
    /** What it established — the sentence that earns the click. */
    answer: z.string(),
    period: z.string(),
    repo: z.string().url(),
    live: z.string().url().optional(),
    stack: z.array(z.string()),
    /** The headline measurement, transcribed exactly, with its source. */
    measured: z.object({
      value: z.string(),
      unit: z.string().optional(),
      source: z.string(),
      href: z.string().url(),
    }),
    /** Limits the author published himself. Load-bearing, never omitted. */
    disclosure: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects };
