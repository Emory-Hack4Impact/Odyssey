import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

const config = defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx --env-file=.env prisma/seed.ts",
  },
});

module.exports = config;
