import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { availablePreviewMedia, mentorshipPreviewMedia } from "./dev/mentorshipPreviewMedia";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.m4v'],
  server: {
    host: "::",
    port: 8080,
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/preview-media.local/**"],
    },
  },
  plugins: [
    react(),
    mentorshipPreviewMedia(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(""),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(""),
    "import.meta.env.VITE_MENTORSHIP_PREVIEW_VIDEO_KEYS": JSON.stringify(availablePreviewMedia().join(",")),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
