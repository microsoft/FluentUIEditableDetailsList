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
      version: "2.1.0",
      description: "Wrapper over the existing DetailsList that makes in-place editability work like a dream(among many other new features)",
      license: "MIT",
      homepage: "https://github.com/microsoft/FluentUIEditableDetailsList#readme",
      author: "",
      main: "./dist/fluentui.editablegrid.lib.cjs",
      module: "./dist/fluentui.editablegrid.lib.js",
      type: "module",
      typings: "./dist/index.d.ts",
      files: [
        "dist"
      ],
      exports: {
        ".": {
          import: "./dist/fluentui.editablegrid.lib.js",
          require: "./dist/fluentui.editablegrid.lib.cjs",
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
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XHJcbiAgXCJuYW1lXCI6IFwiZmx1ZW50dWktZWRpdGFibGUtZ3JpZFwiLFxyXG4gIFwicHJpdmF0ZVwiOiBmYWxzZSxcclxuICBcInZlcnNpb25cIjogXCIyLjEuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJXcmFwcGVyIG92ZXIgdGhlIGV4aXN0aW5nIERldGFpbHNMaXN0IHRoYXQgbWFrZXMgaW4tcGxhY2UgZWRpdGFiaWxpdHkgd29yayBsaWtlIGEgZHJlYW0oYW1vbmcgbWFueSBvdGhlciBuZXcgZmVhdHVyZXMpXCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0I3JlYWRtZVwiLFxyXG4gIFwiYXV0aG9yXCI6IFwiXCIsXHJcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2ZsdWVudHVpLWVkaXRhYmxlLWdyaWQuY2pzXCIsXHJcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvZmx1ZW50dWktZWRpdGFibGUtZ3JpZC5qc1wiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwidHlwaW5nc1wiOiBcIi4vZGlzdC9pbmRleC5kLnRzXCIsXHJcbiAgXCJmaWxlc1wiOiBbXHJcbiAgICBcImRpc3RcIlxyXG4gIF0sXHJcbiAgXCJleHBvcnRzXCI6IHtcclxuICAgIFwiLlwiOiB7XHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2ZsdWVudHVpLWVkaXRhYmxlLWdyaWQuanNcIixcclxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2ZsdWVudHVpLWVkaXRhYmxlLWdyaWQuY2pzXCIsXHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiXHJcbiAgICB9XHJcbiAgfSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXHJcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L0ZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdC5naXRcIlxyXG4gIH0sXHJcbiAgXCJrZXl3b3Jkc1wiOiBbXHJcbiAgICBcImVkaXRhYmxlXCIsXHJcbiAgICBcImdyaWRcIixcclxuICAgIFwiZGV0YWlsc2xpc3RcIixcclxuICAgIFwiZmx1ZW50dWlcIlxyXG4gIF0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3QvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInN0YXJ0XCI6IFwidml0ZVwiLFxyXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInNlcnZlXCI6IFwidml0ZSBwcmV2aWV3XCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGZsdWVudHVpL3JlYWN0XCI6IFwiXjguMjYuMFwiLFxyXG4gICAgXCJAZmx1ZW50dWkvcmVhY3QtaG9va3NcIjogXCJeOC42LjI0XCIsXHJcbiAgICBcIkB0eXBlcy9maWxlLXNhdmVyXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcImZpbGUtc2F2ZXJcIjogXCJeMi4wLjJcIixcclxuICAgIFwicmVhY3QtdG9hc3RpZnlcIjogXCJeNy4wLjRcIixcclxuICAgIFwidXVpZFwiOiBcIl45LjAuMFwiLFxyXG4gICAgXCJ4bHN4XCI6IFwiaHR0cHM6Ly9jZG4uc2hlZXRqcy5jb20veGxzeC0wLjE5LjMveGxzeC0wLjE5LjMudGd6XCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjAuMi4zXCIsXHJcbiAgICBcIkB0eXBlcy91dWlkXCI6IFwiXjkuMC4yXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI6IFwiXjQuMC4wXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4wLjRcIixcclxuICAgIFwidml0ZVwiOiBcIl40LjMuOFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI6IFwiXjAuNi4wXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4yLjMuMFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiOiBcIl4wLjE1LjBcIlxyXG4gIH0sXHJcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiLFxyXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiLFxyXG4gICAgXCJyZWFjdFwiOiBcIj49MTYuOC4wIDwxOS4wLjBcIixcclxuICAgIFwicmVhY3QtZG9tXCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiXHJcbiAgfVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcUmVwb3NcXFxcQmV0YS1GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFJlcG9zXFxcXEJldGEtRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9SZXBvcy9CZXRhLUZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbm9ybWFsaXplUGF0aCB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiO1xyXG5cclxuY29uc3QgcGFja2FnZUpzb24gPSByZXF1aXJlKFwiLi9wYWNrYWdlLmpzb25cIik7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgb3BlbjogdHJ1ZSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIGNoZWNrZXIoe1xyXG4gICAgICB0eXBlc2NyaXB0OiB0cnVlLFxyXG4gICAgfSksXHJcbiAgICBkdHMoeyBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlIH0pLFxyXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiAncGFja2FnZS5qc29uJyxcclxuICAgICAgICAgICAgICBkZXN0OiAnLi8nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogJ1JFQURNRS5tZCcsXHJcbiAgICAgICAgICAgICAgZGVzdDogJy4vJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgfSlcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBtaW5pZnk6IHRydWUsXHJcbiAgICBtYW5pZmVzdDogdHJ1ZSxcclxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlLFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2xpYnMvaW5kZXgudHNcIiksXHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCIsIFwiY2pzXCJdLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBcclxuICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxyXG4gICAgICAgICAgXCJyZWFjdC1kb21cIjogXCJSZWFjdERPTVwiLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUNFLE1BQVE7QUFBQSxNQUNSLFNBQVc7QUFBQSxNQUNYLFNBQVc7QUFBQSxNQUNYLGFBQWU7QUFBQSxNQUNmLFNBQVc7QUFBQSxNQUNYLFVBQVk7QUFBQSxNQUNaLFFBQVU7QUFBQSxNQUNWLE1BQVE7QUFBQSxNQUNSLFFBQVU7QUFBQSxNQUNWLE1BQVE7QUFBQSxNQUNSLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1QsS0FBSztBQUFBLFVBQ0gsUUFBVTtBQUFBLFVBQ1YsU0FBVztBQUFBLFVBQ1gsT0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFjO0FBQUEsUUFDWixNQUFRO0FBQUEsUUFDUixLQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsVUFBWTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFRO0FBQUEsUUFDTixLQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1QsT0FBUztBQUFBLFFBQ1QsT0FBUztBQUFBLFFBQ1QsT0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLGNBQWdCO0FBQUEsUUFDZCxtQkFBbUI7QUFBQSxRQUNuQix5QkFBeUI7QUFBQSxRQUN6QixxQkFBcUI7QUFBQSxRQUNyQixjQUFjO0FBQUEsUUFDZCxrQkFBa0I7QUFBQSxRQUNsQixNQUFRO0FBQUEsUUFDUixNQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsaUJBQW1CO0FBQUEsUUFDakIsZUFBZTtBQUFBLFFBQ2YsZUFBZTtBQUFBLFFBQ2Ysd0JBQXdCO0FBQUEsUUFDeEIsWUFBYztBQUFBLFFBQ2QsTUFBUTtBQUFBLFFBQ1IsdUJBQXVCO0FBQUEsUUFDdkIsbUJBQW1CO0FBQUEsUUFDbkIsMkJBQTJCO0FBQUEsTUFDN0I7QUFBQSxNQUNBLGtCQUFvQjtBQUFBLFFBQ2xCLGdCQUFnQjtBQUFBLFFBQ2hCLG9CQUFvQjtBQUFBLFFBQ3BCLE9BQVM7QUFBQSxRQUNULGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBO0FBQUE7OztBQ2pFbVQsT0FBTyxVQUFVO0FBQ3BVLFNBQVMsb0JBQW1DO0FBQzVDLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFDcEIsU0FBUyxzQkFBc0I7QUFKL0IsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxjQUFjO0FBR3BCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsSUFDRCxJQUFJLEVBQUUsa0JBQWtCLEtBQUssQ0FBQztBQUFBLElBQzlCLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNMO0FBQUEsVUFDSSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNJLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNWO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLHNCQUFzQjtBQUFBLElBQ3RCLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLG1CQUFtQjtBQUFBLE1BQ2xELFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsV0FBVztBQUFBLE1BQy9CLFFBQVE7QUFBQSxRQUVOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFFRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
