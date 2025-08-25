import { DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey } from "sequelize";
import { sequelize } from "../sequelize";
import { Course } from "./Course";

export class TitleSuggestion extends Model<InferAttributes<TitleSuggestion>, InferCreationAttributes<TitleSuggestion>> {
  declare id?: number;
  declare courseId: ForeignKey<Course["id"]>;
  declare title: string;
  declare temperature: number;
  declare createdAt?: Date;
}

TitleSuggestion.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(512), allowNull: false },
    temperature: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.7 },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "title_suggestions", updatedAt: false }
);

TitleSuggestion.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(TitleSuggestion, { foreignKey: "courseId" });
