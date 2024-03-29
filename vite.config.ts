import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    viteMockServe({ 
      mockPath: 'mock',
      supportTs: true,
      injectCode: `
        import { setupProdMockServer } from './mockProdServer';
        setupProdMockServer();
      `
    })
  ],
  server: {
    host: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src/"),
      core: path.resolve(__dirname, 'src/core/'),
      types: path.resolve(__dirname, "types/"),
      api: path.resolve(__dirname, "src/api/"),
    },
    extensions: ['.ts', '.js', '.tsx', '.vue']
  },
  css: {
    preprocessorOptions: {
      // 全局引入
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/design/config.less')}";`,
        },
        javascriptEnabled: true,
      }
    }
  },
  build: {
    target: "es2015",
  }
});
