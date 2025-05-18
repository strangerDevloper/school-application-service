import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";

export class DbManager {
  private connection: DataSource | null = null;

  constructor(private config: DataSourceOptions & { 
    entitiesPath: string[];
    migrationsPath: string[];
  }) {}

  async connect(): Promise<DataSource> {
    try {
      this.connection = await new DataSource({
        ...this.config,
        entities: this.config.entitiesPath.map(p => path.resolve(p)),
        migrations: this.config.migrationsPath.map(p => path.resolve(p)),
      }).initialize();
      
      console.log("✅ Database connected");
      return this.connection;
    } catch (error) {
      console.error("❌ Database connection failed", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.connection?.isInitialized) {
      await this.connection.destroy();
      this.connection = null;
      console.log("📴 Database connection closed");
    }
  }

  getConnection(): DataSource {
    if (!this.connection?.isInitialized) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.connection;
  }

  async healthCheck(): Promise<boolean> {
    return this.connection?.isInitialized ?? false;
  }

  async reconnect(): Promise<DataSource> {
    await this.close();
    return this.connect();
  }
}

// Utility function for quick initialization
export const createDataSource = (
  options: DataSourceOptions & {
    entitiesPath: string[];
    migrationsPath: string[];
  }
) => {
  return new DbManager(options);
};