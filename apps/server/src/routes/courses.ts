import { Router } from "express";
import { Course } from "../db/models/Course";

const router = Router();

/**
 * Get all courses
 */
router.get("/", async (_req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: ["id", "title", "coverUrl", "description"], // only return what frontend needs
    });
    res.json(courses);
  } catch (err: any) {
    console.error("❌ Failed to fetch courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * Update course title
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.title = title;
    await course.save();

    res.json(course);
  } catch (err: any) {
    console.error("❌ Failed to update course title:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
