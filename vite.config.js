import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
	base: '/AirPollutionApp/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
		},
	},
});
