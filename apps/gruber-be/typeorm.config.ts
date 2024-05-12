import { DataSource } from "typeorm"

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT as string) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1",
  database: process.env.DB_DATABASE || "gruber",
  migrations: [__dirname + "/src/migrations/**/*.ts"]
});
