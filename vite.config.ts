import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/main.ts',
      name: 'SignalREventEmitter',
      formats: ['es']
    }
  },
  plugins: [
    dts()
  ]
});