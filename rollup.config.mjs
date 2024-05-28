import { defineConfig } from "rollup";
import { minify, transform } from "@swc/core";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import bundleSize from "rollup-plugin-bundle-size";

const formats = ["cjs", "es", "umd", "iife"];
const extensions = [".js", ".ts"];
const output = "dist";
const plugins = [bundleSize(), swcTransform(), nodeResolve({ extensions })];

export default defineConfig([
  bundle("src"),
]);


function bundle(input, name = "bundle") {
  return {
    input,
    output: formats.map((format) => {
      return {
        file: `${output}/${name}.${format}.js`,
        format,
        name: "TaskEngineSDK",
        plugins: [swcMinify(format === "es")],
      };
    }),
    plugins,
  };
}

function swcTransform() {
  return {
    name: "swc-transform",
    transform(code) {
      return transform(code, {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          target: "es2022",
        },
      });
    },
  };
}

function swcMinify(module = false) {
  return {
    name: "swc-minify",
    renderChunk(code) {
      return minify(code, {
        module,
        compress: {
          arguments: true,
          booleans_as_integers: true,
          dead_code: true,
          hoist_funs: true,
          hoist_vars: true,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_Function: true,
          unsafe_symbols: true,
          unsafe_math: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
        },
        mangle: {
          toplevel: true,
        },
      });
    },
  };
}
