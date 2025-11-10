import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { VitePluginInjectTlogAutoTrack } from "./src/lib/plugins/log";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), VitePluginInjectTlogAutoTrack()],
});
