import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, type LibraryOptions } from "vite";

const pathResolve = (dir: string) => {
	return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
	"@": pathResolve("./src/"),
	// "#": join(__dirname, "types"),
};

// 库构建配置
const libOptions: LibraryOptions = {
	entry: pathResolve("./src/components/SplitPane/index.vue"),
	name: "SplitPane",
	fileName: (format) => `split-pane-v3.${format}.js`,
	formats: ["es", "umd"],
};

// 确保类型定义文件被正确生成和包含

const viteConfig = defineConfig(() => {
	return {
		plugins: [
			vue(),
			AutoImport({
				resolvers: [ElementPlusResolver()],
				dts: "./types/generated/auto-imports.d.ts",
			}),
			Components({
				resolvers: [ElementPlusResolver()],
				dts: "./types/generated/components.d.ts",
			}),
		],
		resolve: { alias },
		base: "/split-pane-v3/",
		build: {
			outDir: "dist",
			lib: libOptions,
			rollupOptions: {
				external: ["vue"],
				output: {
					globals: {
						vue: "Vue",
					},
				},
			},
			// 添加类型声明文件生成配置
			emitDeclarationOnly: true,
			declaration: true,
			declarationDir: "./dist/types",
		},
	};
});
// https://vitejs.dev/config/
export default viteConfig;
