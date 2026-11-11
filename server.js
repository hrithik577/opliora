/**
 * OPLIORA PRIVATE LIMITED — Local Development & Production Server
 * Native Node.js HTTP server routing static assets and /api/contact.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Load .env file manually if present (no extra dependencies required)
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

// Fallback defaults for email
process.env.GMAIL_USER = process.env.GMAIL_USER || "oplioraprivatelimited@gmail.com";
process.env.CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || "oplioraprivatelimited@gmail.com";

const contactHandler = require("./api/contact");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // 1. API Route: /api/contact
  if (pathname === "/api/contact" || pathname === "/api/contact/") {
    if (req.method === "POST") {
      let bodyData = "";
      req.on("data", (chunk) => {
        bodyData += chunk;
        if (bodyData.length > 1e6) {
          // 1MB flood protection
          req.connection.destroy();
        }
      });
      req.on("end", () => {
        req.body = bodyData;
        contactHandler(req, res);
      });
      return;
    } else {
      contactHandler(req, res);
      return;
    }
  }

  // 2. Static File Serving
  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(ROOT, pathname);

  // Security: prevent path traversal outside root
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handler
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 — Page Not Found | Opliora Private Limited</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body style="background:#0A1628; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; text-align:center; font-family:'Plus Jakarta Sans',sans-serif;">
          <div>
            <h1 style="font-size:3rem; margin-bottom:1rem; color:#20C4E4;">404</h1>
            <p style="color:rgba(255,255,255,0.7); margin-bottom:2rem;">The requested resource was not found on this corporate server.</p>
            <a href="/" class="btn btn--primary" style="text-decoration:none; display:inline-block; padding:0.8rem 1.6rem; background:#20C4E4; color:#0A1628; border-radius:50px; font-weight:700;">Return to Homepage</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Cache headers for static assets
    if (ext === ".js" || ext === ".css" || ext === ".jpg" || ext === ".png" || ext === ".svg") {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`✦ Opliora Private Limited server running at http://localhost:${PORT}`);
  console.log(`✦ Corporate Email Channel: ${process.env.GMAIL_USER}`);
});

