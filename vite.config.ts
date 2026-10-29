import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Link previews (WhatsApp, iMessage, Instagram) don't run JavaScript, so pages that need
// their own preview get a copy of index.html with the share tags baked in at build time.
const sharePages = [
  {
    paths: ["mentorship", "mentorship/apply"],
    title: "Rob Late Mentorship · Make better music, faster.",
    description:
      "Six weeks of hands-on production mentorship to help you build a stronger creative workflow, improve your music, and start finishing tracks you're genuinely proud of.",
    url: "https://audio.roblate.com/mentorship",
    image: "https://audio.roblate.com/og-mentorship.jpg",
  },
];

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const sharePreviewPages = () => ({
  name: "share-preview-pages",
  apply: "build" as const,
  closeBundle() {
    const dist = path.resolve(__dirname, "dist");
    const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
    for (const page of sharePages) {
      const tags = [
        `<meta name="description" content="${escapeHtml(page.description)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
        `<meta property="og:url" content="${page.url}" />`,
        `<meta property="og:image" content="${page.image}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
        `<meta name="twitter:image" content="${page.image}" />`,
      ].join("\n    ");
      const html = indexHtml
        .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
        .replace("</head>", `    ${tags}\n  </head>`);
      for (const pagePath of page.paths) {
        fs.mkdirSync(path.join(dist, pagePath), { recursive: true });
        fs.writeFileSync(path.join(dist, pagePath, "index.html"), html);
      }
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.m4v'],
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sharePreviewPages(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
