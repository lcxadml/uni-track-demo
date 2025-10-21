// 统一上报SDK
const tracker = {
  pv(page) {
    console.log('[PV曝光]', page);
    // 这里可调用 uni.request() 上报
  },
  click(trackId, page) {
    console.log('[点击埋点]', { trackId, page });
  },
  exposure(trackId, page) {
    console.log('[元素曝光]', { trackId, page });
  },
};

export default tracker;