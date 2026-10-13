import express from "express";
import path from "path";
import dotenv from "dotenv";
import {
  initializeMLEngine,
  getAllMetrics,
  getAllRecords,
} from "./src/lib/ml-engine.ts";
import {
  executeFullMLPipeline,
  runPrescriptiveDecisionPipeline,
} from "./src/lib/pipeline.ts";
import { CustomerProfile } from "./src/types.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize ML models in memory on startup
try {
  initializeMLEngine();
  console.log("Customer Churn Ensemble Pipeline Engine initialized successfully (no API key required).");
} catch (err) {
  console.error("Failed to initialize ML Pipeline Engine:", err);
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    mode: "pure-pipeline",
    apiKeyRequired: false,
    timestamp: new Date().toISOString(),
  });
});

// API: Get comprehensive model comparison metrics, ROC curves, confusion matrices
app.get("/api/metrics", (_req, res) => {
  try {
    const metrics = getAllMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error retrieving metrics:", error);
    res.status(500).json({ error: "Failed to retrieve model metrics." });
  }
});

// API: Get customer directory with filtering and pagination
app.get("/api/customers", (req, res) => {
  try {
    const records = getAllRecords();
    const {
      search,
      contract,
      paymentMethod,
      riskTier,
      churn,
      page = "1",
      limit = "50",
    } = req.query as Record<string, string | undefined>;

    let filtered = records;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.customerID.toLowerCase().includes(q) ||
          c.InternetService.toLowerCase().includes(q) ||
          c.PaymentMethod.toLowerCase().includes(q)
      );
    }

    if (contract && contract !== "all") {
      filtered = filtered.filter((c) => c.Contract === contract);
    }

    if (paymentMethod && paymentMethod !== "all") {
      filtered = filtered.filter((c) => c.PaymentMethod === paymentMethod);
    }

    if (riskTier && riskTier !== "all") {
      filtered = filtered.filter((c) => c.riskTier === riskTier);
    }

    if (churn && churn !== "all") {
      filtered = filtered.filter((c) => c.Churn === churn);
    }

    const pageNum = Math.max(1, parseInt(page || "1", 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit || "50", 10)));
    const total = filtered.length;
    const startIndex = (pageNum - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    res.json({
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      customers: items,
    });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ error: "Failed to query customer directory." });
  }
});

// API: Real-time inference via ML Inference Pipeline
app.post("/api/predict", (req, res) => {
  const rawProfile = req.body as Partial<CustomerProfile>;
  if (!rawProfile || typeof rawProfile !== "object") {
    return res.status(400).json({ error: "Customer profile payload is required." });
  }

  try {
    const { prediction, fullTrace } = executeFullMLPipeline(rawProfile);
    res.json({
      ...prediction,
      pipelineTrace: fullTrace,
    });
  } catch (e) {
    console.error("Pipeline inference error:", e);
    res.status(500).json({ error: "Pipeline inference execution failed." });
  }
});

// API: Prescriptive Retention Decision Pipeline (100% deterministic, no external API key)
app.post("/api/retention-advisor", (req, res) => {
  const { profile, prediction } = req.body;
  if (!profile || !prediction) {
    return res.status(400).json({ error: "Both profile and prediction are required." });
  }

  try {
    const plan = runPrescriptiveDecisionPipeline(profile, prediction);
    res.json(plan);
  } catch (e) {
    console.error("Prescriptive decision pipeline error:", e);
    res.status(500).json({ error: "Failed to execute prescriptive decision pipeline." });
  }
});

// API: Full End-to-End Pipeline Execution with detailed stage breakdown
app.post("/api/pipeline/execute", (req, res) => {
  const rawProfile = req.body as Partial<CustomerProfile>;
  try {
    const result = executeFullMLPipeline(rawProfile || {});
    res.json(result);
  } catch (e) {
    console.error("Pipeline execution error:", e);
    res.status(500).json({ error: "Pipeline execution failed." });
  }
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pipeline Engine running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
export default app;
