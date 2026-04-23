import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/components/ChatBox.vue"),
      name: "ChatBox",
      fileName: "chat-box",
    },
    rollupOptions: {
      external: ["vue", "ant-design-vue", "markdown-it"],
      output: {
        globals: {
          vue: "Vue",
          "ant-design-vue": "Antd",
          "markdown-it": "MarkdownIt",
        },
      },
    },
  },
});
