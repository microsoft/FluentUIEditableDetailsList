import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";
import { viteStaticCopy } from "vite-plugin-static-copy";

const packageJson = require("./package.json");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  plugins: [
    checker({
      typescript: true,
    }),
    dts({ insertTypesEntry: true }),
    viteStaticCopy({
      targets: [
        {
          src: "package.json",
          dest: "./",
        },
        {
          src: "README.md",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    minify: false,
    manifest: true,
    reportCompressedSize: true,
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/libs/index.ts"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    
  }
});
