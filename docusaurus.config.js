// import PrismLight from './src/utils/prismLight';
import prismDark from "./src/utils/prismDark.ts";
import prismLight from "./src/utils/prismLight.ts";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Reactive Network",
  tagline: "observability layer of blockchain",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://dev.reactive.network",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Reactive-Network", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: process.env.GOOGLE_TAG ?? 'none',
          anonymizeIP: true
        },
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/Reactive-Network/documentation/edit/main/",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'always',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml'
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // announcementBar: {
      //   id: 'support_us',
      //   content:
      //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
      //   backgroundColor: '#2756FC',
      //   textColor: '#DEF5FF',
      //   isCloseable: false,
      // },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      // Replace with your project's social card
      image: "img/social-card.jpg",
      navbar: {
        // title: 'Reactive Network',
        hideOnScroll: true,
        logo: {
          alt: "Reactive Network Logo",
          src: "img/rn-docs-logo-black.svg",
          srcDark: "img/rn-docs-logo-white.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docs",
            position: "left",
            label: "Docs",
          },
          {
            type: "docSidebar",
            sidebarId: "legacy",
            position: "left",
            label: "Legacy",
          },
          {
            type: "docSidebar",
            sidebarId: "contacts",
            position: "left",
            label: "Contact Us",
          },
          {
            href: 'https://t.me/reactivedevs',
            label: 'Telegram',
            position: 'right',
          },
          {
            href: 'https://reactscan.net/',
            label: 'Reactscan',
            position: 'right',
          },
          {
            href: 'https://github.com/Reactive-Network/reactive-smart-contract-demos',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Reactive Network. All rights reserved.`,
      },
      prism: {
        theme: prismLight,
        darkTheme: prismDark,
        additionalLanguages: ["solidity", "bash", "json"],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-diff-add-line',
            line: 'diff-add',
            block: { start: 'diff-add-start', end: 'diff-add-end' },
          },
          {
            className: 'code-block-diff-remove-line',
            line: 'diff-remove',
            block: { start: 'diff-remove-start', end: 'diff-remove-end' },
          },
        ],
      },
      mermaid: {
        theme: {
          dark: "dark",
          light: "base",
        },
        options: {
          fontFamily: "Inter",
          fontSize: "20px",
        },
      },
      algolia: {
        appId: process.env.ALGOLIA_ID ?? 'none',
        apiKey: process.env.ALGOLIA_KEY ?? 'none',
        indexName: 'reactive',
        contextualSearch: true,
        externalUrlRegex: 'external\\.com|domain\\.com',
        replaceSearchResultPathname: {
          from: '/docs/',
          to: '/',
        },
        searchParameters: {},
        searchPagePath: 'search',
        insights: false,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
      },
    }),

    plugins: [
      'docusaurus-plugin-image-zoom',
      [
        "@docusaurus/plugin-client-redirects",
        {
          redirects: [
            {
              from: "/education/getting-started/",
              to: "/"
            },
            {
              from: "/education/getting-started/reactive-smart-contracts",
              to: "/"
            },
            {
              from: "/docs/data-origins-and-destinations",
              to: "/origins-and-destinations"
            },
            {
              from: "/category/getting-started",
              to: "/"
            },
            {
              from: "/system-contract",
              to: "/economy"
            },
            {
              from: "/docs/getting-started",
              to: "/"
            },
            {
              from: "/docs/demos",
              to: "/demos"
            },
            {
              from: "/docs/reactive-smart-contracts",
              to: "/reactive-contracts"
            },
            {
              from: "/reactive-smart-contracts",
              to: "/reactive-contracts"
            },
            {
              from: "/kopli-testnet",
              to: "/reactive-mainnet"
            },
            {
              from: "/faq",
              to: "/debugging"
            },
            {
              from: "/education/introduction/reactive-smart-contracts",
              to: "/"
            },
            {
              from: "/education/module-1/reactive-smart-contracts",
              to: "/"
            },
            {
              from: "/architecture/reactive-smart-contracts",
              to: "/reactive-contracts"
            },
            {
              from: "/architecture/react-vm",
              to: "/reactvm"
            },
            {
              from: "/docs/architecture/react-vm",
              to: "/reactvm"
            },
            {
              from: "/compendium",
              to: "/debugging"
            },
            {
              from: "/docs/kopli-testnet",
              to: "/reactive-mainnet"
            },
            {
              from: "/education/introduction",
              to: "/"
            },
            {
              from: "/education/introduction/reactive-contracts",
              to: "/"
            },
            {
              from: "/education/introduction/prerequisites",
              to: "/"
            },
            {
              from: "/education/module-1",
              to: "/"
            },
            {
              from: "/education/module-1/reactive-contracts",
              to: "/"
            },
            {
              from: "/education/module-1/how-events-work",
              to: "/"
            },
            {
              from: "/education/module-1/react-vm",
              to: "/"
            },
            {
              from: "/education/module-1/how-subscriptions-work",
              to: "/"
            },
            {
              from: "/education/module-1/how-oracles-work",
              to: "/"
            },
            {
              from: "/education/module-2",
              to: "/"
            },
            {
              from: "/education/module-2/how-uniswap-works",
              to: "/"
            },
            {
              from: "/education/module-2/basic-reactive-functions",
              to: "/"
            },
            {
              from: "/education/use-cases",
              to: "/"
            },
            {
              from: "/education/use-cases/use-case-1",
              to: "/"
            },
            {
              from: "/education/use-cases/remix-ide-demo",
              to: "/"
            },
            {
              from: "/education/use-cases/use-case-3",
              to: "/"
            },
            {
              from: "/education/use-cases/use-case-2",
              to: "/"
            },
            {
              from: "/education/glossary",
              to: "/"
            },
            {
              from: "/hyperlane",
              to: "/"
            },
            {
              from: "/events-&-callbacks",
              to: "/reactive-contracts"
            },
            {
              from: "/subscriptions",
              to: "/reactive-contracts"
            },
            {
              from: "/reactvm",
              to: "/"
            },
          ]
        }
      ]
    ]
  };

export default config;
