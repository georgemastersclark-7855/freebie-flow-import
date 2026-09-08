import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const keys = ["sound-library", "session-template", "reference-playlist"];
const mediaPath = (key: string) => path.resolve("preview-media.local", `${key}.mp4`);
export const availablePreviewMedia = () => keys.filter((key) => existsSync(mediaPath(key)));

// Local copies of existing private recordings, for George's preview only.
// This middleware never runs in a production build or Vite preview server.
export function mentorshipPreviewMedia(): Plugin {
  return {
    name: "mentorship-preview-media",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__mentorship-preview-media/", (request, response) => {
        const remote = request.socket.remoteAddress;
        const localRequest = remote === "127.0.0.1" || remote === "::1" || remote === "::ffff:127.0.0.1";
        const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(request.headers.host ?? "");
        if (!localRequest || !localHost) { response.statusCode = 403; response.end(); return; }
        const filename = (request.url ?? "").split("?")[0].replace(/^\//, "");
        const key = keys.find((item) => filename === `${item}.mp4`);
        if (!key) { response.statusCode = 404; response.end(); return; }
        if (request.method !== "GET" && request.method !== "HEAD") { response.statusCode = 405; response.end(); return; }
        void (async () => {
          const file = mediaPath(key);
          const { size } = await stat(file);
          let start = 0;
          let end = size - 1;
          if (request.headers.range) {
            const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
            if (!match || (!match[1] && !match[2])) { response.statusCode = 416; response.setHeader("Content-Range", `bytes */${size}`); response.end(); return; }
            if (match[1]) { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), size - 1) : end; }
            else { start = Math.max(0, size - Number(match[2])); }
            if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start < 0 || start >= size) { response.statusCode = 416; response.setHeader("Content-Range", `bytes */${size}`); response.end(); return; }
            response.statusCode = 206;
            response.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
          }
          response.setHeader("Content-Type", "video/mp4");
          response.setHeader("Accept-Ranges", "bytes");
          response.setHeader("Content-Length", end - start + 1);
          response.setHeader("Cache-Control", "private, no-store");
          response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
          if (request.method === "HEAD") { response.end(); return; }
          const stream = createReadStream(file, { start, end });
          response.on("close", () => stream.destroy());
          stream.on("error", () => response.destroy());
          stream.pipe(response);
        })().catch(() => { if (!response.headersSent) response.statusCode = 404; response.end(); });
      });
    },
  };
}
