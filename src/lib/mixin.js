import tracker from "./track";

export default {
  __observer: null,

  onShow(...options) {
    const page = getCurrentPages()[0];
    console.log("=====onShow", page, options, this.$scope);

    // 页面展示时自动上报PV
    if (this.$scope && this.$scope.page && this.$scope.page.route) {
      const route = this.$scope.page.route;
      tracker.pv(route);
    }
  },
  onHide() {
    const page = getCurrentPages()[0];
    console.log("=====onHide", page);
  },

  onPageScroll() {
    console.log("====onPageScroll");
  },
  mounted() {
    console.log("====mounted");
    this.initObserver();
    const app = getApp();

    // const observer = wx.createIntersectionObserver(this, {
    //   thresholds: [0],
    //   observeAll: true,
    // });
    this.updateObserver();
  },
  onUnload() {
    // 页面销毁时可清理监听
    console.log("====onUnload");
  },
  unmounted() {
    console.log("=====unmounted");
  },
  updated() {
    console.log("======updated");
    this.updateObserver();
  },
  methods: {
    // 通用点击上报方法
    $trackClick(id) {
      const route = this.$scope?.page?.route || "";
      tracker.click(id, route);
    },
    initObserver() {
      if (!this.__observer) {
        this.__observer = wx.createIntersectionObserver(this, {
          thresholds: [0],
          observeAll: true,
        });

        this.__observer.relativeToViewport().observe(".item", (res) => {
          const id = res.dataset.trackId;
          console.log(111111, res.intersectionRatio);

          if (res.intersectionRatio > 0) {
            console.log("======data-track-id", id);
          }
        });
      }
    },

    updateObserver() {
      if (this.__observer) {
        this.__observer.disconnect();
        this.__observer = null;
        this.initObserver();
      }
    },
  },
};
