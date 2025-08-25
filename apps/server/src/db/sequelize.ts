import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL;
export const sequelize = url
  ? new Sequelize(url, { dialect: "mysql", logging: false })
  : new Sequelize(
      process.env.DB_NAME || "mla_test",
      process.env.DB_USER || "user",
      process.env.DB_PASS || "password",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        logging: false,
      }
    );
