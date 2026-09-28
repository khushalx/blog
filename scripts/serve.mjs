import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
await stat(path.join(root, "index.html")).catch(() => {
  console.error("Run npm run build before npm start.");
  process.exit(1);
});
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let filename = path.resolve(root, `.${pathname}`);
    if (filename !== root && !filename.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(filename)).isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, { Location: pathname + "/" }).end();
        return;
      }
      filename = path.join(filename, "index.html");
    }
    const data = await readFile(filename);
    response.writeHead(200, {
      "Content-Type":
        types[path.extname(filename)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      await readFile(path.join(root, "404.html")).catch(() => "Not found"),
    );
  }
}).listen(port, () =>
  console.log(`Publication available at http://localhost:${port}`),
);
