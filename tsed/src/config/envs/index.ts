import dotenv from "dotenv-flow";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const config = dotenv.config();
export const isProduction = process.env.NODE_ENV === "production";
export const envs = process.env
