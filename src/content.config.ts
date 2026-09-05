import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const figure = z.object({ value: z.string(), caption: z.string() });

/**
 * An off-site destination. Links render in the order a project writes them, after the
 * internal `read` link, and each carries its own label — one project's primary artifact
 * is a repository, another's is a hosted report, and the row should say which.
 */
const link = z.object({
  label: z.string(),
  href: z.string().url(),
  /** The one link the whole card follows when clicked. Exactly one per project. */
  primary: z.boolean().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    question: z.string(),
    period: z.string(),
    links: z
      .array(link)
      .min(1)
      .refine((list) => list.filter((l) => l.primary).length === 1, {
        message: 'Exactly one link must be marked `primary` — it is the one the card links to.',
      }),
    stack: z.array(z.string()).min(1),
    headline: figure,
    results: z.array(figure).min(3).max(4),
    limits: z.string(),
  }),
});

export const collections = { projects };
