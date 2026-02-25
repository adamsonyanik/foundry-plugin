import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

const modulePath = "C:/Users/yadam/AppData/Local/FoundryVTT/Data/modules/foundry-plugin/";

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            input: "src/ts/module.ts",
            output: {
                dir: modulePath + "scripts",
                entryFileNames: "module.js",
                format: "es"
            }
        }
    },
    plugins: [
        copy({
            targets: [{ src: "src/module.json", dest: modulePath }],
            hook: "writeBundle"
        })
    ]
});
