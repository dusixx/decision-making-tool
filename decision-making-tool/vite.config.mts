import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  plugins: [tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/styles/sass/utils.scss" as *; 
          @use "/src/styles/sass/vars.scss" as *;
        `,
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
