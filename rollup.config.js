import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-cpy";
import html from "rollup-plugin-fill-html";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";

const env = process.env.NODE_ENV;

const plugins = [
    resolve({
        browser: true,
    }),
    commonjs(),
    typescript(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(env),
    }),
    html({
        template: "assets/index.html",
    }),
    copy({
        files: [
            './assets/favicon.ico',
        ],
        dest: "public",
    })
];

if (env === "production") {
    plugins.push(
        uglify({
            compress: {
                keep_infinity: true, // Avoid perf penalty in Chrome
                passes: 1, // No measured difference at 10 passes
            },
            output: {
                comments: "some", // Automagic license preservation
            }
        }),
    );
}

export default {
    input: "src/main.ts",
    plugins: plugins,
    output: {
        file: "public/main-[hash].js",
        format: "iife",
        name: "Fractals",
        sourcemap: true,
    },
}
