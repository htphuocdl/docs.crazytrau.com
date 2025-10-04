// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'crazytrau',
  tagline: 'Huynh Thien Phuoc',
  url: 'https://docs.crazytrau.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'crazytrau', // Usually your GitHub org/user name.
  projectName: 'docs.crazytrau.com', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
      vi: {
        htmlLang: 'vi-VN',
      },
    },
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/htphuocdl/docs.crazytrau.com/tree/d/prod/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/htphuocdl/docs.crazytrau.com/tree/d/prod/',
        },
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        pages: {},
        // // Will be passed to @docusaurus/plugin-content-sitemap (false to disable)
        // sitemap: {},
        // // Will be passed to @docusaurus/plugin-google-gtag (only enabled when explicitly specified)
        // gtag: {},
        // // Will be passed to @docusaurus/plugin-google-analytics (only enabled when explicitly specified)
        // googleAnalytics: {},
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    function cytoscapeAliasPlugin() {
      return {
        name: 'cytoscape-alias-plugin',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                // Some mermaid versions deep-import cytoscape UMD file which is not exported;
                // map it to the package root entry instead.
                'cytoscape/dist/cytoscape.umd.js': require.resolve('cytoscape'),
                'cytoscape/dist/cytoscape.min.js': require.resolve('cytoscape'),
              },
            },
          };
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'crazytrau.com',
        logo: {
          alt: 'crazytrau.com Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/htphuocdl/docs.crazytrau.com',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/htphuocdl/docs.crazytrau.com',
              },
            ],
          },
        ],
        copyright: `Copyright © 2022 crazytrau.com, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'L9FLXHFTN1',
  
        // Public API key: it is safe to commit it
        apiKey: 'd50b9de3743d3810ea55900eb0fa4cf5',
  
        indexName: 'crazytrau',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'docs\\.crazytrau\\.com',
  
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
  
        // Optional: Algolia search parameters
        searchParameters: {
          facetFilters: [],
        },
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },
    }),
};

module.exports = config;
