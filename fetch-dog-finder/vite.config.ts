import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'
import { resolve } from 'path'

const aliases = [
	'assets',
	'components',
	'hooks',
	'layout',
	'providers',
	'typings',
	'utils',
]
const indexPath = resolve(__dirname, './index.html')

export default defineConfig({
	base: '',
	build: {
		assetsDir: 'assets',
		emptyOutDir: true,
		outDir: 'build',
		rollupOptions: {
			input: { index: indexPath },
			output: { globals: { react: 'React' } },
		},
		watch: {},
	},
	css: {
		modules: {
			localsConvention: 'camelCaseOnly',
			scopeBehaviour: 'global',
		},
		preprocessorOptions: {
			scss: {
				additionalData: `@use '@assets/scss/vars' as *;`,
				includePaths: ['node_modules'],
			},
		},
	},
	plugins: [
		react(),
		tsconfigPaths(),
	],
	preview: {
		open: '/',
		port: 9000,
		strictPort: true,
	},
	resolve: {
		alias: aliases.map(alias => ({
			find: `@${alias}`,
			replacement: resolve(__dirname, `./src/${alias}`),
		})),
		extensions: ['.js', '.ts', '.jsx', '.tsx'],
	},
	server: {
		open: '/',
		port: 3000,
		strictPort: true,
	},
})
