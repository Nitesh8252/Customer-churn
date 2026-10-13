import express from "express";
import path from "path";
import dotenv from "dotenv";
import { spawn } from "child_process";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to proxy predictions directly to our python machine learning model
app.post("/api/predict", (req, res) => {
  const profile = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Profile data is required for prediction." });
  }

  const py = spawn("python3", ["ml_engine.py", "--predict"]);
  let stdoutData = "";
  let stderrData = "";

  py.stdin.write(JSON.stringify(profile));
  py.stdin.end();

  py.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  py.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python ML model exited with code ${code}. Stderr: ${stderrData}`);
      return res.status(500).json({ error: "Python ML engine execution failed." });
    }
    try {
      const result = JSON.parse(stdoutData.trim());
      res.json(result);
    } catch (e) {
      console.error("Failed to parse Python ML output JSON:", stdoutData);
      res.status(500).json({ error: "Failed to parse Python prediction output." });
    }
  });
});

// Vite Middleware & Asset Serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
export default app;
