import "dotenv/config";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.cjs",
  },
});

module.exports = config;
