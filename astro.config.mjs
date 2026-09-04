// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * Wrap every markdown table in a scroll container, so a wide results table
 * scrolls inside itself and the page body never scrolls sideways.
 */
function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
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

// https://astro.build/config
export default defineConfig({
  site: 'https://samueljchen08.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
});
