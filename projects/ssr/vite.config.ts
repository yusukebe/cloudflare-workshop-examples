import pages from '@sonikjs/cloudflare-pages'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sonik({
      devServer: {
        cf: {
          d1Databases: ['DB'],
          d1Persist: true,
        },
      },
    }),
    pages(),
  ],
})
