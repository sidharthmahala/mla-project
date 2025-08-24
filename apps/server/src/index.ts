import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import aiRouter from "./routes/ai";

console.log("Loaded key:", process.env.OPENAI_API_KEY ? "✅ Present" : "❌ Missing");

const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

app.use("/api", aiRouter);
