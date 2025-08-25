// index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import aiRouter from "./routes/ai";
import courseRoutes from "./routes/courses";
import { initDb } from "./db/seed";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

app.use("/api", aiRouter);
console.log("✅ AI routes mounted at /api");
app.use("/api/courses", courseRoutes);
console.log("✅ Course routes mounted at /api/courses");
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Call initDb before starting server
async function start() {
  await initDb({ force: true }); // 🔄 wipe and reseed
  // your server startup code here...

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start app:", err);
});
