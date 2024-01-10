import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    database: "postgres",
    host: "db",
    port: 5432,
    user: "postgres",
    password: "postgres",
  },
} satisfies Config;
