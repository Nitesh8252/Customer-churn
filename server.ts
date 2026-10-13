import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  initializeMLEngine,
  getAllMetrics,
  getAllRecords,
  predictProfile,
} from "./src/lib/ml-engine.ts";
import { CustomerProfile } from "./src/types.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize ML models in memory on startup
try {
  initializeMLEngine();
  console.log("Customer Churn Ensemble ML Engine initialized successfully.");
} catch (err) {
  console.error("Failed to initialize ML Engine:", err);
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
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

// API: Live churn prediction for a given customer profile
app.post("/api/predict", (req, res) => {
  const profile = req.body as Partial<CustomerProfile>;
  if (!profile || typeof profile !== "object") {
    return res.status(400).json({ error: "Customer profile payload is required." });
  }

  try {
    const result = predictProfile(profile);
    res.json(result);
  } catch (e) {
    console.error("Prediction engine error:", e);
    res.status(500).json({ error: "Failed to generate prediction from ensemble." });
  }
});

// API: Retention Advisor with Gemini API (or heuristic fallback if key not configured)
app.post("/api/retention-advisor", async (req, res) => {
  const { profile, prediction } = req.body;
  if (!profile || !prediction) {
    return res.status(400).json({ error: "Both profile and prediction are required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `You are an expert Chief Customer Officer and Retention Strategist specializing in subscription telecommunications and service industries.
A customer has been analyzed by our Machine Learning Churn Ensemble (incorporating Logistic Regression, Decision Tree, and Gradient Boosting).

Customer Profile:
- Customer ID: ${profile.customerID || "Target Customer"}
- Tenure: ${profile.tenure} months
- Contract: ${profile.Contract}
- Monthly Charges: $${profile.MonthlyCharges}
- Total Charges: $${profile.TotalCharges}
- Internet Service: ${profile.InternetService}
- Tech Support: ${profile.TechSupport}
- Online Security: ${profile.OnlineSecurity}
- Online Backup: ${profile.OnlineBackup}
- Device Protection: ${profile.DeviceProtection}
- Payment Method: ${profile.PaymentMethod}
- Paperless Billing: ${profile.PaperlessBilling}
- Senior Citizen: ${profile.SeniorCitizen ? "Yes" : "No"}

Model Ensemble Prediction:
- Churn Probability: ${(prediction.probability * 100).toFixed(1)}%
- Predicted Churn: ${prediction.churnPrediction}
- Risk Tier: ${prediction.riskTier}
- Model Breakdown: LR ${(prediction.modelBreakdown.logisticRegression * 100).toFixed(0)}%, DT ${(prediction.modelBreakdown.decisionTree * 100).toFixed(0)}%, GB ${(prediction.modelBreakdown.gradientBoosting * 100).toFixed(0)}%

Provide an executive retention strategy JSON output with this schema:
{
  "summary": "1-2 sentence executive diagnosis of churn vulnerability",
  "riskAssessment": "Concise risk analysis citing the primary behavioral and contract triggers",
  "immediateInterventions": ["action 1 (within 48 hours)", "action 2", "action 3"],
  "longTermStrategies": ["strategy 1", "strategy 2"],
  "recommendedOffer": "Specific targeted incentive (e.g. Free Tech Support for 6 months + $10 off for 12mo contract commit)",
  "expectedChurnReduction": "Estimated churn probability reduction percentage (e.g. 45-60%)"
}

Respond ONLY with valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
    } catch (geminiError) {
      console.warn("Gemini API call failed, using heuristic advisor:", geminiError);
    }
  }

  // Analytical Heuristic Retention Fallback
  const isHighRisk = prediction.riskTier === "High";
  const isMonthToMonth = profile.Contract === "Month-to-month";
  const hasNoTechSupport = profile.TechSupport === "No";

  res.json({
    summary: isHighRisk
      ? `High-risk account (${(prediction.probability * 100).toFixed(1)}% probability) driven by contract flexibility and service gap.`
      : `Moderate retention profile (${(prediction.probability * 100).toFixed(1)}% probability) with opportunities to solidify contract commitment.`,
    riskAssessment: `Account is primarily vulnerable due to ${
      isMonthToMonth ? "lack of long-term contract lock-in" : "pricing sensitivity"
    }${hasNoTechSupport ? " coupled with unassisted technical support risk" : ""}.`,
    immediateInterventions: [
      isMonthToMonth
        ? "Contact customer with exclusive 12-month contract renewal discount ($15/mo discount for 1 year commitment)"
        : "Conduct 15-minute satisfaction check-in to verify line quality",
      hasNoTechSupport
        ? "Provision 90-day complimentary Tech Support and VIP resolution line"
        : "Audit recent customer tickets and resolve outstanding latency inquiries",
      profile.PaymentMethod === "Electronic check"
        ? "Incentivize enrollment into automated recurring billing with $25 bill credit"
        : "Send loyalty reward confirmation email acknowledging tenure",
    ],
    longTermStrategies: [
      "Transition customer to bundled services package to create higher multi-product switching barriers",
      "Monitor monthly usage patterns and trigger automated outreach if bandwidth consumption dips by >30%",
    ],
    recommendedOffer: isMonthToMonth
      ? "Upgrade to 1-Year Loyalty Agreement: Free Tech Support + $12/month discount for 12 months"
      : "Loyalty Appreciation Package: Free streaming bundle add-on for 6 months",
    expectedChurnReduction: isHighRisk ? "40% - 55%" : "25% - 35%",
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Customer Churn Framework running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
export default app;
