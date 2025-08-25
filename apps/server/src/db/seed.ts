// apps/server/src/seed.ts
import fs from "fs";
import path from "path";
import { sequelize } from "./sequelize";
import { Course } from "./models/Course";

export async function initDb({ force = false } = {}) {
  await sequelize.authenticate();

  if (force) {
    console.log("⚠️ Force reseed enabled: dropping & recreating tables...");
    await sequelize.sync({ force: true }); // wipe everything
  } else {
    await sequelize.sync({ alter: true }); // just update schema
  }

  const count = await Course.count();
  if (count === 0) {
    console.log("🌱 Seeding initial courses...");

    const base = path.resolve(__dirname, "../../../sample-courses");
    console.log("📂 Using sample-courses folder:", base);

    const courses = [
      {
        title:
          "Creating Safe Spaces - Implementing Trauma-Informed Practices in Fitness Environments for Intermediate Learners",
        filename:
          "Creating Safe Spaces - Implementing Trauma-Informed Practices in Fitness Environments for Intermediate Learners.txt",
        coverUrl: "/covers/cover1.png",
        description:
          "Learn how to build inclusive, trauma-informed fitness environments.",
        price: "Free",
        chapters: 8,
        duration: "2h 45m",
        level: "Intermediate",
        hosting: true,
      },
      {
        title: "Shadows Over Eryndral - A Tangle of Magic and Fate",
        filename: "Shadows Over Eryndral - A Tangle of Magic and Fate.txt",
        coverUrl: "/covers/cover2.png",
        description: "An epic fantasy journey through the lands of Eryndral.",
        price: "19",
        chapters: 15,
        duration: "5h 30m",
        level: "Advanced",
        hosting: false,
      },
      {
        title: "How to become a Caregiver",
        filename: "How to become a Caregiver.txt",
        coverUrl: "/covers/cover3.png",
        description: "Essential skills and guidance for aspiring caregivers.",
        price: "9",
        chapters: 10,
        duration: "3h 15m",
        level: "Beginner",
        hosting: true,
      },
    ];

    for (const c of courses) {
      const contentPath = path.join(base, c.filename);
      console.log("🔍 Checking file:", contentPath);

      let finalPath: string | null = null;
      if (fs.existsSync(contentPath)) {
        finalPath = contentPath;
        console.log("✅ Found:", finalPath);
      } else {
        console.warn(`⚠ Missing file: ${contentPath} — seeding without content`);
      }

      await Course.create({
        title: c.title,
        contentPath: finalPath,
        coverUrl: c.coverUrl,
        selectedTitle: null,
        description: c.description,
        price: String(c.price),
        chapters: c.chapters,
        duration: c.duration,
        level: c.level as "Beginner" | "Intermediate" | "Advanced",
        hosting: c.hosting,
      });
    }

    console.log("✅ Seeded sample courses");
  } else {
    console.log("ℹ️ Courses already seeded, skipping...");
  }
}
