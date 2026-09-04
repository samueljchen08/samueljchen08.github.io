import { getCollection } from 'astro:content';
import { skills } from './profile';

export interface SkillGroup {
  name: string;
  skills: string[];
}

/**
 * Which sector each technology belongs to, in display order.
 *
 * This is the one place a skill's grouping is decided. `technicalSkills()` checks it
 * against what the projects actually declare and throws if the two disagree, so adding
 * a technology to a project's stack forces a deliberate choice here rather than letting
 * it fall into an "other" bucket — and a sector cannot keep listing a skill no project
 * demonstrates any more.
 */
const SECTORS: Record<string, string[]> = {
  Languages: ['Python', 'JavaScript', 'HTML', 'CSS'],
  'Machine Learning': ['PyTorch', 'XGBoost', 'OpenCV', 'Reinforcement learning', 'GRPO', 'LLM APIs'],
  'Statistics & Experiment Design': [
    'Bayesian inference',
    'Causal inference',
    'Regression analysis',
    'Monte Carlo simulation',
    'Parameter fitting',
  ],
  'Data & Tooling': ['SQLite', 'Synthetic data', 'pytest'],
};

/**
 * The base languages from the résumé plus every technology the projects declare,
 * grouped by sector, each listed once.
 */
export async function technicalSkills(): Promise<SkillGroup[]> {
  const projects = await getCollection('projects');
  const declared = new Set([...skills, ...projects.flatMap((project) => project.data.stack)]);
  const sorted = Object.values(SECTORS).flat();

  const unsorted = [...declared].filter((skill) => !sorted.includes(skill));
  if (unsorted.length > 0) {
    throw new Error(
      `Technical skills with no sector — add them to SECTORS in data/skills.ts: ${unsorted.join(', ')}`,
    );
  }

  const orphaned = sorted.filter((skill) => !declared.has(skill));
  if (orphaned.length > 0) {
    throw new Error(
      `SECTORS lists skills no project declares — remove them from data/skills.ts: ${orphaned.join(', ')}`,
    );
  }

  const duplicated = sorted.filter((skill, i) => sorted.indexOf(skill) !== i);
  if (duplicated.length > 0) {
    throw new Error(`Skills placed in more than one sector: ${duplicated.join(', ')}`);
  }

  return Object.entries(SECTORS).map(([name, list]) => ({ name, skills: list }));
}
