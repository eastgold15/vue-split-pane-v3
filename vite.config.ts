import { defineConfig, type LibraryOptions } from "vite";
import { resolve, join } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const pathResolve = (dir: string) => {
	return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
	"@": pathResolve("./src/"),
	// "#": join(__dirname, "types"),
};

// 库构建配置
const libOptions: LibraryOptions = {
	entry: pathResolve('./src/components/SplitPane/index.vue'),
	name: 'SplitPane',
	fileName: (format) => `split-pane-v3.${format}.js`,
	formats: ['es', 'umd'],
}

const viteConfig = defineConfig(() => {
	return {
		plugins: [
			vue(),
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
		],
		resolve: { alias },
		base: "/split-pane-v3/",
		build: {
			outDir: "dist",
			lib: libOptions,
			rollupOptions: {
				external: ['vue'],
				output: {
					globals: {
						vue: 'Vue'
					}
				}
			}
		},
	};
});
// https://vitejs.dev/config/
export default viteConfig;
