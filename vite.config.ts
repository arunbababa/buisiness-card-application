import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import env from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
    react(),
    // ここでprefixをVITEに設定しているのか
    env({ prefix: "VITE" }) 
  ],
  build: {
    outDir: 'build', // ビルド出力先
  }
});