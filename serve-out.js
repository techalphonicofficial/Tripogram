const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "out");
const port = Number(process.env.PORT || 3200);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolveFile(url) {
  const clean = decodeURIComponent((url || "/").split("?")[0]).replace(/^\/+/, "");
  let file = path.resolve(root, clean);
  const relative = path.relative(root, file);

  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) {
    file = `${file}.html`;
  }
  if (!fs.existsSync(file)) {
    file = path.join(root, "404.html");
  }

  return file;
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url);

    if (!file || !fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(file.endsWith("404.html") ? 404 : 200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Serving out at http://127.0.0.1:${port}`);
  });
