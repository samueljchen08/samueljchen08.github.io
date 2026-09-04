// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/** Wrap every markdown table in a scroll container so wide tables scroll inside themselves. */
function rehypeWrapTables() {
  return (/** @type {any} */ tree) => {
    const walk = (/** @type {any} */ node) => {
      if (!node.children) return;
      node.children = node.children.map((/** @type {any} */ child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://samueljchen08.github.io',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: { rehypePlugins: [rehypeWrapTables] },
});
