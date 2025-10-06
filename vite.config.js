import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/ecs.js'),
            name: 'FluxJS',
            fileName: (format) => `ecs.${format === 'es' ? 'esm' : 'cjs'}.js`,
            formats: ['es', 'cjs'],
        },
        outDir: 'dist',
        minify: 'terser', // Minificación con terser
        rollupOptions: {
            output: {
                exports: 'named',
            },
        },
    },
});