import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    // vitest corre fuera de Next, asi que no hereda los path aliases del
    // tsconfig. Sin esto, `@/lib/content` no resuelve y todos los tests fallan
    // con "cannot resolve import" antes de ejecutar una sola asercion.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
