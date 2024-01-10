import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const connectionString = "postgresql://postgres:postgres@db:5432/postgres";
export const sql = postgres(connectionString, { max: 1 });
export const db = drizzle(sql, { schema });
