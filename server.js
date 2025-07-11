// server.js (ES module)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// แทน __dirname สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const basePath = "/PO_Website";
const outDir = path.join(__dirname, "out");

// Serve static files
app.use(basePath, express.static(outDir));

// SPA fallback route
app.use(basePath, (req, res) => {
  res.sendFile(path.join(outDir, "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}${basePath}`);
});
