import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            input: "src/ts/module.ts",
            output: {
                dir: "dist/scripts",
                entryFileNames: "module.js",
                format: "es"
            }
        }
    },
    plugins: [
        copy({
            targets: [
                { src: "src/module.json", dest: "dist" },
                { src: "dist/*", dest: "C:/Users/yadam/AppData/Local/FoundryVTT/Data/modules/foundry-plugin/" }
            ],
            hook: "writeBundle"
        }),
        zipPack({ outDir: ".", outFileName: "module.zip" })
    ]
});
