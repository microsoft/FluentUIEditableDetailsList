var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "fluentui.editablegrid.lib",
      private: false,
      version: "5.0.6",
      description: "Wrapper over the existing DetailsList that makes in-place editability work like a dream(among many other new features)",
      license: "MIT",
      homepage: "https://github.com/microsoft/FluentUIEditableDetailsList#readme",
      author: "",
      main: "./dist/js/fluentui.editablegrid.lib.js",
      type: "module",
      typings: "./dist/index.d.ts",
      files: [
        "dist"
      ],
      exports: {
        ".": {
          import: "./dist/js/fluentui.editablegrid.lib.js",
          types: "./dist/index.d.ts"
        }
      },
      repository: {
        type: "git",
        url: "git+https://github.com/microsoft/FluentUIEditableDetailsList.git"
      },
      keywords: [
        "editable",
        "grid",
        "detailslist",
        "fluentui"
      ],
      bugs: {
        url: "https://github.com/microsoft/FluentUIEditableDetailsList/issues"
      },
      scripts: {
        start: "vite",
        build: "tsc && vite build",
        serve: "vite preview"
      },
      dependencies: {
        "@fluentui/react": "^8.26.0",
        "@fluentui/react-hooks": "^8.6.24",
        "@types/file-saver": "^2.0.1",
        "file-saver": "^2.0.2",
        "react-number-format": "^5.2.2",
        "react-select": "^5.7.7",
        "react-toastify": "^7.0.4",
        uuid: "^9.0.0",
        xlsx: "https://cdn.sheetjs.com/xlsx-0.19.3/xlsx-0.19.3.tgz"
      },
      devDependencies: {
        "@types/node": "^20.2.3",
        "@types/uuid": "^9.0.2",
        "@vitejs/plugin-react": "^4.0.0",
        typescript: "^5.0.4",
        vite: "^4.3.8",
        "vite-plugin-checker": "^0.6.0",
        "vite-plugin-dts": "^2.3.0",
        "vite-plugin-static-copy": "^0.15.0"
      },
      peerDependencies: {
        "@types/react": ">=16.8.0 <19.0.0",
        "@types/react-dom": ">=16.8.0 <19.0.0",
        react: ">=16.8.0 <19.0.0",
        "react-dom": ">=16.8.0 <19.0.0"
      },
      overrides: {
        "@types/parse-json": "4.0.0"
      }
    };
  }
});

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Repos/Beta-FluentUIEditableDetailsList/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Repos/Beta-FluentUIEditableDetailsList/node_modules/vite-plugin-dts/dist/index.mjs";
import checker from "file:///C:/Repos/Beta-FluentUIEditableDetailsList/node_modules/vite-plugin-checker/dist/esm/main.js";
import { viteStaticCopy } from "file:///C:/Repos/Beta-FluentUIEditableDetailsList/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "C:\\Repos\\Beta-FluentUIEditableDetailsList";
var packageJson = require_package();
var vite_config_default = defineConfig({
  server: {
    open: true
  },
  plugins: [
    checker({
      typescript: true
    }),
    dts({ insertTypesEntry: true }),
    viteStaticCopy({
      targets: [
        {
          src: "package.json",
          dest: "./"
        },
        {
          src: "README.md",
          dest: "./"
        }
      ]
    })
  ],
  build: {
    minify: true,
    manifest: true,
    reportCompressedSize: true,
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/libs/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      input: {
        [packageJson.name]: path.resolve(__vite_injected_original_dirname, "src/libs/index.ts"),
        "runGridValidations.worker": "src/libs/editablegrid/workers/runGridValidations.worker.js"
      },
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        },
        assetFileNames: "assets/[name].js",
        entryFileNames: (assetInfo) => {
          return assetInfo.name === "runGridValidations.worker" ? "[name].js" : "js/[name].js";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XHJcbiAgXCJuYW1lXCI6IFwiZmx1ZW50dWkuZWRpdGFibGVncmlkLmxpYlwiLFxyXG4gIFwicHJpdmF0ZVwiOiBmYWxzZSxcclxuICBcInZlcnNpb25cIjogXCI1LjAuNlwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJXcmFwcGVyIG92ZXIgdGhlIGV4aXN0aW5nIERldGFpbHNMaXN0IHRoYXQgbWFrZXMgaW4tcGxhY2UgZWRpdGFiaWxpdHkgd29yayBsaWtlIGEgZHJlYW0oYW1vbmcgbWFueSBvdGhlciBuZXcgZmVhdHVyZXMpXCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0I3JlYWRtZVwiLFxyXG4gIFwiYXV0aG9yXCI6IFwiXCIsXHJcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2pzL2ZsdWVudHVpLmVkaXRhYmxlZ3JpZC5saWIuanNcIixcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcInR5cGluZ3NcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxyXG4gIFwiZmlsZXNcIjogW1xyXG4gICAgXCJkaXN0XCJcclxuICBdLFxyXG4gIFwiZXhwb3J0c1wiOiB7XHJcbiAgICBcIi5cIjoge1xyXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9qcy9mbHVlbnR1aS5lZGl0YWJsZWdyaWQubGliLmpzXCIsXHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiXHJcbiAgICB9XHJcbiAgfSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXHJcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L0ZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdC5naXRcIlxyXG4gIH0sXHJcbiAgXCJrZXl3b3Jkc1wiOiBbXHJcbiAgICBcImVkaXRhYmxlXCIsXHJcbiAgICBcImdyaWRcIixcclxuICAgIFwiZGV0YWlsc2xpc3RcIixcclxuICAgIFwiZmx1ZW50dWlcIlxyXG4gIF0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3QvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInN0YXJ0XCI6IFwidml0ZVwiLFxyXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInNlcnZlXCI6IFwidml0ZSBwcmV2aWV3XCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGZsdWVudHVpL3JlYWN0XCI6IFwiXjguMjYuMFwiLFxyXG4gICAgXCJAZmx1ZW50dWkvcmVhY3QtaG9va3NcIjogXCJeOC42LjI0XCIsXHJcbiAgICBcIkB0eXBlcy9maWxlLXNhdmVyXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcImZpbGUtc2F2ZXJcIjogXCJeMi4wLjJcIixcclxuICAgIFwicmVhY3QtbnVtYmVyLWZvcm1hdFwiOiBcIl41LjIuMlwiLFxyXG4gICAgXCJyZWFjdC1zZWxlY3RcIjogXCJeNS43LjdcIixcclxuICAgIFwicmVhY3QtdG9hc3RpZnlcIjogXCJeNy4wLjRcIixcclxuICAgIFwidXVpZFwiOiBcIl45LjAuMFwiLFxyXG4gICAgXCJ4bHN4XCI6IFwiaHR0cHM6Ly9jZG4uc2hlZXRqcy5jb20veGxzeC0wLjE5LjMveGxzeC0wLjE5LjMudGd6XCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjAuMi4zXCIsXHJcbiAgICBcIkB0eXBlcy91dWlkXCI6IFwiXjkuMC4yXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI6IFwiXjQuMC4wXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4wLjRcIixcclxuICAgIFwidml0ZVwiOiBcIl40LjMuOFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI6IFwiXjAuNi4wXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4yLjMuMFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiOiBcIl4wLjE1LjBcIlxyXG4gIH0sXHJcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiLFxyXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiLFxyXG4gICAgXCJyZWFjdFwiOiBcIj49MTYuOC4wIDwxOS4wLjBcIixcclxuICAgIFwicmVhY3QtZG9tXCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiXHJcbiAgfSxcclxuICBcIm92ZXJyaWRlc1wiOiB7XHJcbiAgICBcIkB0eXBlcy9wYXJzZS1qc29uXCI6IFwiNC4wLjBcIlxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFJlcG9zXFxcXEJldGEtRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxSZXBvc1xcXFxCZXRhLUZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovUmVwb3MvQmV0YS1GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG5vcm1hbGl6ZVBhdGggfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIjtcclxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIjtcclxuXHJcbmNvbnN0IHBhY2thZ2VKc29uID0gcmVxdWlyZShcIi4vcGFja2FnZS5qc29uXCIpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIG9wZW46IHRydWUsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBjaGVja2VyKHtcclxuICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgZHRzKHsgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KSxcclxuICAgIHZpdGVTdGF0aWNDb3B5KHtcclxuICAgICAgdGFyZ2V0czogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogJ3BhY2thZ2UuanNvbicsXHJcbiAgICAgICAgICAgICAgZGVzdDogJy4vJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6ICdSRUFETUUubWQnLFxyXG4gICAgICAgICAgICAgIGRlc3Q6ICcuLydcclxuICAgICAgICAgIH1cclxuICAgICAgXVxyXG4gIH0pXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgbWluaWZ5OiB0cnVlLFxyXG4gICAgbWFuaWZlc3Q6IHRydWUsXHJcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIGNvcHlQdWJsaWNEaXI6IGZhbHNlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9saWJzL2luZGV4LnRzXCIpLFxyXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OntcclxuICAgICAgICBbcGFja2FnZUpzb24ubmFtZV06IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2xpYnMvaW5kZXgudHNcIiksXHJcbiAgICAgICAgJ3J1bkdyaWRWYWxpZGF0aW9ucy53b3JrZXInOiBcInNyYy9saWJzL2VkaXRhYmxlZ3JpZC93b3JrZXJzL3J1bkdyaWRWYWxpZGF0aW9ucy53b3JrZXIuanNcIlxyXG4gICAgICB9LFxyXG4gICAgICBleHRlcm5hbDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIl0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uanMnLFxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBhc3NldEluZm8gPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lID09PSAncnVuR3JpZFZhbGlkYXRpb25zLndvcmtlcidcclxuICAgICAgICAgICAgID8gJ1tuYW1lXS5qcydcclxuICAgICAgICAgICAgIDogICdqcy9bbmFtZV0uanMnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQ0UsTUFBUTtBQUFBLE1BQ1IsU0FBVztBQUFB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
