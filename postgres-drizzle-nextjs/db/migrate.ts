import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db, sql } from "./";

(async () => {
  await migrate(db, { migrationsFolder: "drizzle" });
  await sql.end();
})();
