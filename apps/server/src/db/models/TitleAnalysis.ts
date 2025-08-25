import { DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey } from "sequelize";
import { sequelize } from "../sequelize";
import { Course } from "./Course";

export class TitleAnalysis extends Model<InferAttributes<TitleAnalysis>, InferCreationAttributes<TitleAnalysis>> {
  declare id?: number;
  declare courseId: ForeignKey<Course["id"]>;
  declare title: string;
  declare pros: string;   // JSON stringified
  declare cons: string;   // JSON stringified
  declare metricsJson: string; // JSON string of metric->score (1–10)
  declare createdAt?: Date;
}

TitleAnalysis.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(512), allowNull: false },
    pros: { type: DataTypes.TEXT("long"), allowNull: false },
    cons: { type: DataTypes.TEXT("long"), allowNull: false },
    metricsJson: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "title_analyses", updatedAt: false }
);

TitleAnalysis.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(TitleAnalysis, { foreignKey: "courseId" });
