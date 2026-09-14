import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';
const production = !process.env.ROLLUP_WATCH;
import json from '@rollup/plugin-json';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [{
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},

	plugins: [

		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			// Pick the `browser` + `require` branch of a package's `exports`
			// map, which for axios is its self-contained browser bundle
			// (dist/browser/axios.cjs) rather than the Node entry that drags
			// in http/https/zlib/stream. commonjs() converts it.
			exportConditions: ['browser', 'require'],
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		replace({
			preventAssignment: true,
			// Targeted member expressions only. Replacing the bare `process`
			// identifier also rewrote third-party code -- axios's
			// `process.nextTick(cb)` became `{"env":{...}}.nextTick(cb)`, a
			// syntax error that fails the build.
			'process.env.isProd': JSON.stringify(production),
			'process.env.YOUTUBE_API_KEY': JSON.stringify(
				(config().parsed || {}).YOUTUBE_API_KEY || ''
			),
		}),
		json()
	],
	watch: {
		clearScreen: false
	}
},
{
	input: "src/background.ts",
	output: {
		sourcemap: true,
		format: "iife",
		file: "public/build/background.js",
	},
	plugins: [
		resolve({ browser: true }),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
	],
	watch: {
		clearScreen: false,
	},
},

]

