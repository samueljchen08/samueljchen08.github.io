import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const figure = z.object({ value: z.string(), caption: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    question: z.string(),
    period: z.string(),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    paper: z.string().url().optional(),
    stack: z.array(z.string()).min(1),
    headline: figure,
    results: z.array(figure).min(3).max(4),
    limits: z.string(),
  }),
});

export const collections = { projects };
