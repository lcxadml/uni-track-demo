import { createSSRApp } from "vue";
import mixin from "./lib/mixin.js";
import App from "./App.vue";
export function createApp() {
  const app = createSSRApp(App);
  app.mixin(mixin);
  return {
    app,
  };
}
