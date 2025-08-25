import { Router } from "express";
import { Course } from "../db/models/Course";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses); // instead of { courses }
  } catch (err: any) {
    console.error("❌ Failed to fetch courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});



export default router;
