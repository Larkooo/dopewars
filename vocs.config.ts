import React from "react";
import { defineConfig } from "vocs";

const baseUrl = "https://docs.dopewars.game/";
const ogImage = `${baseUrl}/logo.png`;
const ogDescription =
  "Complete documentation of Dope Wars - Real-money skill game onchain. Game rules, builds, encounters, seasons, economy.";

function ogMetaPlugin() {
  return {
    name: "og-meta-inject",
    transformIndexHtml(html: string) {
      const ogMeta = [
        `<meta property="og:description" content="${ogDescription.replace(/"/g, "&quot;")}"/>`,
        `<meta property="og:image" content="${ogImage}"/>`,
        `<meta name="twitter:description" content="${ogDescription.replace(/"/g, "&quot;")}"/>`,
        `<meta name="twitter:image" content="${ogImage}"/>`,
      ].join("");
      return html.replace("</head>", `${ogMeta}</head>`);
    },
  };
}

export default defineConfig({
  title: "Dope Wars",
  rootDir: "docs",
  baseUrl,
  description:
    "Complete documentation of Dope Wars - Real-money skill game onchain",
  ogImageUrl: ogImage,
  vite: {
    plugins: [ogMetaPlugin()],
    server: {
      allowedHosts: true,
    },
  },
  head: React.createElement(
    React.Fragment,
    null,
    React.createElement("meta", {
      key: "description",
      name: "description",
      content: ogDescription,
    }),
    React.createElement("meta", {
      key: "og-type",
      property: "og:type",
      content: "website",
    }),
    React.createElement("meta", {
      key: "og-title",
      property: "og:title",
      content: "Dope Wars - Documentation",
    }),
    React.createElement("meta", {
      key: "og-url",
      property: "og:url",
      content: baseUrl,
    }),
    React.createElement("meta", {
      key: "tw-card",
      name: "twitter:card",
      content: "summary_large_image",
    }),
    React.createElement("meta", {
      key: "tw-title",
      name: "twitter:title",
      content: "Dope Wars - Documentation",
    }),
  ),
  iconUrl: "/favicon.ico",
  socials: [
    {
      icon: "github",
      link: "https://github.com/cartridge-gg/dopewars",
    },
    {
      icon: "x",
      link: "https://x.com/TheDopeWars",
    },
  ],
  sidebar: [
    { text: "Overview", link: "/" },
    {
      text: "Game Rules",
      link: "/game-rules",
      items: [
        { text: "The Build", link: "/game-rules/builds" },
        { text: "Encounters", link: "/game-rules/encounters" },
        { text: "The Map", link: "/game-rules/map" },
        { text: "Markets", link: "/game-rules/markets" },
        { text: "Reputation", link: "/game-rules/reputation" },
        { text: "Strategy Guide", link: "/game-rules/strategy" },
      ],
    },
    { text: "Token", link: "/token" },
    {
      text: "Economy",
      link: "/economy",
      items: [
        { text: "Seasons", link: "/economy/seasons" },
        { text: "Rewards", link: "/economy/payouts" },
      ],
    },
    { text: "Contracts", link: "/contracts" },
    { text: "FAQ", link: "/faq" },
  ],
  theme: {},
});
