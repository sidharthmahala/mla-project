// src/db/models/Course.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../sequelize";

// --- Define the attributes
interface CourseAttributes {
  id: number;
  title: string;
  selectedTitle: string | null;
  contentPath: string | null;
  coverUrl: string | null;
  description: string;
  price: string;
  chapters: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hosting: boolean;
}

// --- Which attributes are optional on creation? ---
type CourseCreationAttributes = Optional<
  CourseAttributes,
  "id" | "selectedTitle" | "contentPath" | "coverUrl"
>;

export class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  declare id: number;
  declare title: string;
  declare selectedTitle: string | null;
  declare contentPath: string | null;
  declare coverUrl: string | null;
  declare description: string;
  declare price: string;
  declare chapters: number;
  declare duration: string;
  declare level: "Beginner" | "Intermediate" | "Advanced";
  declare hosting: boolean;
}

Course.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    selectedTitle: { type: DataTypes.STRING, allowNull: true },
    contentPath: { type: DataTypes.STRING, allowNull: true },
    coverUrl: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    chapters: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"), allowNull: false },
    hosting: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: "courses",
  }
);
