import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx --env-file=.env prisma/seed.ts",
  },
});

module.exports = config;
