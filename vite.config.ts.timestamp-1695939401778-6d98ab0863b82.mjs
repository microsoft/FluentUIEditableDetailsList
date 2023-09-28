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
      version: "4.2.0",
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
        "react-number-format": "^5.2.2",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XHJcbiAgXCJuYW1lXCI6IFwiZmx1ZW50dWkuZWRpdGFibGVncmlkLmxpYlwiLFxyXG4gIFwicHJpdmF0ZVwiOiBmYWxzZSxcclxuICBcInZlcnNpb25cIjogXCI0LjIuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJXcmFwcGVyIG92ZXIgdGhlIGV4aXN0aW5nIERldGFpbHNMaXN0IHRoYXQgbWFrZXMgaW4tcGxhY2UgZWRpdGFiaWxpdHkgd29yayBsaWtlIGEgZHJlYW0oYW1vbmcgbWFueSBvdGhlciBuZXcgZmVhdHVyZXMpXCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0I3JlYWRtZVwiLFxyXG4gIFwiYXV0aG9yXCI6IFwiXCIsXHJcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2ZsdWVudHVpLmVkaXRhYmxlZ3JpZC5saWIuY2pzXCIsXHJcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvZmx1ZW50dWkuZWRpdGFibGVncmlkLmxpYi5qc1wiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwidHlwaW5nc1wiOiBcIi4vZGlzdC9pbmRleC5kLnRzXCIsXHJcbiAgXCJmaWxlc1wiOiBbXHJcbiAgICBcImRpc3RcIlxyXG4gIF0sXHJcbiAgXCJleHBvcnRzXCI6IHtcclxuICAgIFwiLlwiOiB7XHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2ZsdWVudHVpLmVkaXRhYmxlZ3JpZC5saWIuanNcIixcclxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2ZsdWVudHVpLmVkaXRhYmxlZ3JpZC5saWIuY2pzXCIsXHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiXHJcbiAgICB9XHJcbiAgfSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXHJcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L0ZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdC5naXRcIlxyXG4gIH0sXHJcbiAgXCJrZXl3b3Jkc1wiOiBbXHJcbiAgICBcImVkaXRhYmxlXCIsXHJcbiAgICBcImdyaWRcIixcclxuICAgIFwiZGV0YWlsc2xpc3RcIixcclxuICAgIFwiZmx1ZW50dWlcIlxyXG4gIF0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3QvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInN0YXJ0XCI6IFwidml0ZVwiLFxyXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInNlcnZlXCI6IFwidml0ZSBwcmV2aWV3XCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGZsdWVudHVpL3JlYWN0XCI6IFwiXjguMjYuMFwiLFxyXG4gICAgXCJAZmx1ZW50dWkvcmVhY3QtaG9va3NcIjogXCJeOC42LjI0XCIsXHJcbiAgICBcIkB0eXBlcy9maWxlLXNhdmVyXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcImZpbGUtc2F2ZXJcIjogXCJeMi4wLjJcIixcclxuICAgIFwicmVhY3QtbnVtYmVyLWZvcm1hdFwiOiBcIl41LjIuMlwiLFxyXG4gICAgXCJyZWFjdC10b2FzdGlmeVwiOiBcIl43LjAuNFwiLFxyXG4gICAgXCJ1dWlkXCI6IFwiXjkuMC4wXCIsXHJcbiAgICBcInhsc3hcIjogXCJodHRwczovL2Nkbi5zaGVldGpzLmNvbS94bHN4LTAuMTkuMy94bHN4LTAuMTkuMy50Z3pcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMC4yLjNcIixcclxuICAgIFwiQHR5cGVzL3V1aWRcIjogXCJeOS4wLjJcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4wLjBcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjAuNFwiLFxyXG4gICAgXCJ2aXRlXCI6IFwiXjQuMy44XCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIjogXCJeMC42LjBcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZHRzXCI6IFwiXjIuMy4wXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI6IFwiXjAuMTUuMFwiXHJcbiAgfSxcclxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCI+PTE2LjguMCA8MTkuMC4wXCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCI+PTE2LjguMCA8MTkuMC4wXCIsXHJcbiAgICBcInJlYWN0XCI6IFwiPj0xNi44LjAgPDE5LjAuMFwiLFxyXG4gICAgXCJyZWFjdC1kb21cIjogXCI+PTE2LjguMCA8MTkuMC4wXCJcclxuICB9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxSZXBvc1xcXFxCZXRhLUZsdWVudFVJRWRpdGFibGVEZXRhaWxzTGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcUmVwb3NcXFxcQmV0YS1GbHVlbnRVSUVkaXRhYmxlRGV0YWlsc0xpc3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1JlcG9zL0JldGEtRmx1ZW50VUlFZGl0YWJsZURldGFpbHNMaXN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBub3JtYWxpemVQYXRoIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcbmltcG9ydCBjaGVja2VyIGZyb20gXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI7XHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XHJcblxyXG5jb25zdCBwYWNrYWdlSnNvbiA9IHJlcXVpcmUoXCIuL3BhY2thZ2UuanNvblwiKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgY2hlY2tlcih7XHJcbiAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIGR0cyh7IGluc2VydFR5cGVzRW50cnk6IHRydWUgfSksXHJcbiAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6ICdwYWNrYWdlLmpzb24nLFxyXG4gICAgICAgICAgICAgIGRlc3Q6ICcuLydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiAnUkVBRE1FLm1kJyxcclxuICAgICAgICAgICAgICBkZXN0OiAnLi8nXHJcbiAgICAgICAgICB9XHJcbiAgICAgIF1cclxuICB9KVxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG1pbmlmeTogdHJ1ZSxcclxuICAgIG1hbmlmZXN0OiB0cnVlLFxyXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvbGlicy9pbmRleC50c1wiKSxcclxuICAgICAgZm9ybWF0czogW1wiZXNcIiwgXCJjanNcIl0sXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIl0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQ0UsTUFBUTtBQUFBLE1BQ1IsU0FBVztBQUFBLE1BQ1gsU0FBVztBQUFBLE1BQ1gsYUFBZTtBQUFBLE1BQ2YsU0FBVztBQUFBLE1BQ1gsVUFBWTtBQUFBLE1BQ1osUUFBVTtBQUFBLE1BQ1YsTUFBUTtBQUFBLE1BQ1IsUUFBVTtBQUFBLE1BQ1YsTUFBUTtBQUFBLE1BQ1IsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDVCxLQUFLO0FBQUEsVUFDSCxRQUFVO0FBQUEsVUFDVixTQUFXO0FBQUEsVUFDWCxPQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQWM7QUFBQSxRQUNaLE1BQVE7QUFBQSxRQUNSLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxVQUFZO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQVE7QUFBQSxRQUNOLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDVCxPQUFTO0FBQUEsUUFDVCxPQUFTO0FBQUEsUUFDVCxPQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsY0FBZ0I7QUFBQSxRQUNkLG1CQUFtQjtBQUFBLFFBQ25CLHlCQUF5QjtBQUFBLFFBQ3pCLHFCQUFxQjtBQUFBLFFBQ3JCLGNBQWM7QUFBQSxRQUNkLHVCQUF1QjtBQUFBLFFBQ3ZCLGtCQUFrQjtBQUFBLFFBQ2xCLE1BQVE7QUFBQSxRQUNSLE1BQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxpQkFBbUI7QUFBQSxRQUNqQixlQUFlO0FBQUEsUUFDZixlQUFlO0FBQUEsUUFDZix3QkFBd0I7QUFBQSxRQUN4QixZQUFjO0FBQUEsUUFDZCxNQUFRO0FBQUEsUUFDUix1QkFBdUI7QUFBQSxRQUN2QixtQkFBbUI7QUFBQSxRQUNuQiwyQkFBMkI7QUFBQSxNQUM3QjtBQUFBLE1BQ0Esa0JBQW9CO0FBQUEsUUFDbEIsZ0JBQWdCO0FBQUEsUUFDaEIsb0JBQW9CO0FBQUEsUUFDcEIsT0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUE7QUFBQTs7O0FDbEVtVCxPQUFPLFVBQVU7QUFDcFUsU0FBUyxvQkFBbUM7QUFDNUMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTtBQUNwQixTQUFTLHNCQUFzQjtBQUovQixJQUFNLG1DQUFtQztBQU16QyxJQUFNLGNBQWM7QUFHcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELElBQUksRUFBRSxrQkFBa0IsS0FBSyxDQUFDO0FBQUEsSUFDOUIsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ0w7QUFBQSxVQUNJLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0ksS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1Ysc0JBQXNCO0FBQUEsSUFDdEIsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLElBQ2YsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsTUFDbEQsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDL0IsUUFBUTtBQUFBLFFBRU4sU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFVBQ1AsYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUVGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
