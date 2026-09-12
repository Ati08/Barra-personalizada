import { resolve } from "path";
import { defineConfig } from "@spicemod/creator";

// Learn more: https://github.com/sanoojes/spicetify-creator
export default defineConfig({
  name: "barra-lateral-config",
  framework: "react",
  linter: "biome",
  template: "extension",
  packageManager: "npm",
  esbuildOptions: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
