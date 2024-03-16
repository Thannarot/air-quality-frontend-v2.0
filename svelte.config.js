import adapter  from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
			fallback: '200.html' // may differ from host to host
		})
  },
  preprocess: vitePreprocess()
};
export default config;