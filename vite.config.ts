import { defineConfig } from 'vite'

import { svelte } from '@sveltejs/vite-plugin-svelte'

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    ViteImageOptimizer()
  ],
})
