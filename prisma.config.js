import { defineConfig } from "prisma/config";

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // Use CommonJS seed runner to avoid ESM loader issues
    seed: "node prisma/seed.cjs",
  },
});

module.exports = config;
