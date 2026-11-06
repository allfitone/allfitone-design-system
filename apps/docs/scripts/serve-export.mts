/**
 * Serves `out/` for the E2E suite the way CloudFront serves the Explorer:
 * `/` redirects to `/ui-foundation`, clean URLs map to the exported `.html`,
 * and anything missing answers the 404 page. The CloudFront Function lives in
 * the `allfitone` repository (`infra/modules/static-site`); keep the two alike.
 *
 *   node scripts/serve-export.mts --port 3100
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const redirects: Record<string, { location: string; status: number }> = {
  "/": { location: "/ui-foundation", status: 307 },
};

const root = path.resolve("out");
const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag === -1 ? 3100 : process.argv[portFlag + 1]);

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

function exportedFile(pathname: string): string {
  return pathname.lastIndexOf(".") <= pathname.lastIndexOf("/") ? `${pathname}.html` : pathname;
}

async function isFile(file: string): Promise<boolean> {
  return (await stat(file).catch(() => undefined))?.isFile() ?? false;
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? "/", "http://localhost");
  const target = redirects[pathname];
  if (target) {
    response.writeHead(target.status, { location: target.location }).end();
    return;
  }
  const file = path.join(root, path.normalize(exportedFile(decodeURIComponent(pathname))));
  const found = file.startsWith(root) && (await isFile(file));
  const served = found ? file : path.join(root, "404.html");
  response.writeHead(found ? 200 : 404, {
    "content-type": types[path.extname(served)] ?? "application/octet-stream",
  });
  createReadStream(served).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Serving out/ on http://127.0.0.1:${port}`));
