import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const external = [].concat(
	Object.keys(pkg.dependencies || {}),
	Object.keys(pkg.peerDependencies || {}),
	Object.keys(process.binding('natives'))
);

export default [
	{
		// TODO could we just put `start.js` in `assets`, and everything
		// else gets installed to `/web_modules`?
		input: {
			'internal/start': 'src/runtime/internal/start.js',
			'internal/singletons': 'src/runtime/internal/singletons.js',
			'app/navigation': 'src/runtime/app/navigation/index.js',
			'app/stores': 'src/runtime/app/stores/index.js',
			'app/paths': 'src/runtime/app/paths/index.js'
		},
		output: {
			dir: 'assets/runtime',
			format: 'esm',
			sourcemap: true,
			paths: {
				ROOT: '../../generated/root.svelte',
				MANIFEST: '../../generated/manifest.js'
			}
		},
		external: ['svelte', 'svelte/store', 'ROOT', 'MANIFEST'],
		plugins: [
			resolve({
				extensions: ['.mjs', '.js', '.ts']
			})
		]
	},

	{
		input: {
			cli: 'src/cli.js',
			api: 'src/api/index.js',
			renderer: 'src/renderer/index.js'
		},
		output: {
			dir: 'dist',
			format: 'esm',
			sourcemap: true,
			chunkFileNames: '[name].js'
		},
		external: (id) => {
			return external.includes(id);
		},
		plugins: [
			replace({
				__VERSION__: pkg.version
			}),
			resolve({
				extensions: ['.mjs', '.js', '.ts']
			}),
			commonjs()
		],
		preserveEntrySignatures: true
	}
];
