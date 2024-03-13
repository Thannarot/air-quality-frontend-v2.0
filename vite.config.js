import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import glsl from 'vite-plugin-glsl';


export default defineConfig({
	plugins: [sveltekit(), glsl(), splitVendorChunkPlugin()],
	server: {
		port: 3000,
		proxy: {
		  '/api': {
			target: 'http://216.218.240.248/api/',
			rewrite: (path) => path.replace(/^\/api/, ''),
			changeOrigin: true
		},
		'/wms': {
			target: 'http://216.218.240.247:8080/thredds/wms/',
			rewrite: (path) => path.replace(/^\/wms/, ''),
			changeOrigin: true
		},
		'/latest': {
			target: 'http://localhost:8013/latest',
			rewrite: (path) => path.replace(/^\/latest/, ''),
			changeOrigin: true
		},
		'/mapserver': {
			target: 'https://firms.modaps.eosdis.nasa.gov/mapserver',
			rewrite: (path) => path.replace(/^\/mapserver/, ''),
			changeOrigin: true
		}
	  }
	}
});

