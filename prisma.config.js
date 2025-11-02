import "dotenv/config";
import { defineConfig } from "prisma/config";

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node -r ts-node/register --env-file=.env prisma/seed.ts",
  },
});

module.exports = config;
