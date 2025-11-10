// plugin/tlog.ts
import { PluginOption } from "vite";

/** 点击后拦截插入代码，event为点击对象 */
const injectClickCode = `  
console.log(111111235, event);  
trackClick(event);
if(event.type === 'tap'){  

};  
`;
export const VitePluginInjectTlogAutoTrack: () => PluginOption = () => ({
  name: "auto-tlog-track",
  renderChunk(code, chunk) {
    let tempCode = code;
    if (chunk.fileName === "common/vendor.js") {
      const regx = new RegExp(/patchMPEvent\(event\) {([\s\S]*)/);
      tempCode = code.replace(
        regx,
        `patchMPEvent(event){  
    ${injectClickCode};  
  $1`
      );
    }
    return tempCode;
  },
});
