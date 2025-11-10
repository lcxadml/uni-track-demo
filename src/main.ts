import { createSSRApp } from "vue";
import mixin from "./lib/mixin.js";
import App from "./App.vue";

globalThis.trackClick = function (trackId, extra = {}) {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1]?.route || "";
  console.log("[全局埋点]", { trackId, page, ...extra });
};
// (function () {
//   const isObject = function (obj) {
//     if (obj === undefined || obj === null) {
//       return false;
//     } else {
//       return toString.call(obj) == "[object Object]";
//     }
//   };
//   // 劫持Component
//   const _componentProto_ = Component;
//   Component = function (options) {
//     console.log(666666, options);

//     //options.methods内有uniapp注入的事件处理器__e及mpHook
//     Object.keys(options.methods).forEach((methodName) => {
//       console.log('====methodName', methodName);

//       if (methodName == "__l") {
//         //劫持事件处理器
//         eventProxy(options.methods, methodName);
//       }
//     });
//     _componentProto_.apply(this, arguments);
//   };

//   function eventProxy(methodList, methodName) {
//     const _funcProto_ = methodList[methodName];
//     methodList[methodName] = function () {
//       console.log('======apply');

//       _funcProto_.apply(this, arguments);

//       try {
//         if (isObject(arguments[0])) {
//           if (Object.keys(arguments[0]).length > 0) {
//             //记录触发页面信息
//             const pages = getCurrentPages();
//             const currentPage = pages[pages.length - 1];
//             const currentPageVm = currentPage.$vm;
//             // const type = arguments[0]['type']
//             const currentTarget = arguments[0].currentTarget || {};
//             const dataset = currentTarget.dataset || {};
//             // console.log(999999, dataset, arguments[0])

//             if (currentPageVm.tracker) {
//               // if (dataset[TrackEvent.click]) {
//               //   currentPageVm.tracker.handleClick(dataset);
//               // }
//             }
//           }
//         }
//       } catch (e) {
//         console.error("track proxy error", e);
//       }
//     };
//   }
// })();
export function createApp() {
  const app = createSSRApp(App);
  app.mixin(mixin);
  return {
    app,
  };
}
