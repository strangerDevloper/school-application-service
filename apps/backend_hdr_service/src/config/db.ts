import { DbManager } from "@repo/db";
import path from "path";

export const dbManager = new DbManager({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  synchronize: false,  // Always false in production
  logging: process.env.NODE_ENV === "development",
  
  // BEST PRACTICE: Explicit entity classes + backup glob path
  entities: [
    ...(process.env.NODE_ENV === "production" 
      ? [path.join(__dirname, "../entities/*.js")]  // Compiled files
      : [path.join(__dirname, "../entities/*.ts")]  // TS files in dev
    )
  ],

  // Migrations use glob (no class references)
  migrations: [path.join(__dirname, "../migrations/*.{js,ts}")],
});

// TypeORM CLI export (uses resolved paths)
export const dataSource = dbManager.getConnection();