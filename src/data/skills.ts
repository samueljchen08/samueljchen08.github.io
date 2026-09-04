import { getCollection } from 'astro:content';
import { skills } from './profile';

/**
 * Everything shown under "technical": the base languages from the résumé, then every
 * technology the three projects declare, each listed once and in project order.
 *
 * Derived rather than written down so the list cannot drift from the project cards,
 * and so a skill can never appear twice.
 */
export async function technicalSkills(): Promise<string[]> {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  return [...new Set([...skills, ...projects.flatMap((project) => project.data.stack)])];
}
