<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow((options) => {
  console.log("App Show", options);
});
onHide(() => {
  console.log("App Hide");
});

const originComponent = Component;

Component = function (componentConfig) {
  const methods = componentConfig.methods || {};

  for (const key in methods) {
    const fn = methods[key];

    if (typeof fn === 'function') {
      methods[key] = function (...args) {
        console.log(777777, args[0]);
        
        const e = args[0];
        if (e && e.type === 'tap') {
          const trackId = e?.currentTarget?.dataset?.track;
          if (trackId) {
            const page = getCurrentPages().slice(-1)[0]?.route || '';
            console.log('[组件点击埋点]', trackId, '页面:', page);
            // track('element_click', { page, trackId });
          }
        }
        return fn.apply(this, args);
      };
    }
  }

  originComponent(componentConfig);
};
</script>
<style></style>
