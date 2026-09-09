/**
 * `process` does not exist in the extension runtime. `@rollup/plugin-replace`
 * (see rollup.config.js) substitutes every occurrence at build time with a
 * literal object carrying the parsed `.env` values, so this declares the shape
 * of that shim rather than Node's real `process`.
 */
declare const process: {
	env: {
		isProd: boolean;
		YOUTUBE_API_KEY?: string;
	};
};
