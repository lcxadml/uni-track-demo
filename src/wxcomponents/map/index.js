import * as echarts from "../ec-canvas/echarts.js";
import geoJson from "./mapData.js";

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chart);

  echarts.registerMap("henan", geoJson);

  const option = {
    animation: false,

    series: [
      {
        type: "map",
        mapType: "henan",
        label: {
          normal: {
            show: true,
          },
          emphasis: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        roam: true,
        zoom: 1.5,
        itemStyle: {
          normal: {
            borderColor: "#389BB7",
            areaColor: "#389BB7",
          },
          emphasis: {
            borderColor: "#389BB7",
            areaColor: "#389BB7",
          },
          blur: {
            label: { show: false },
            itemStyle: {
              areaColor: {
                image: "#389BB7",
                repeat: "repeat",
              },
            },
          },
          select: {
            itemStyle: {
              areaColor: "#000000", // 点击选中状态
            },
          },
        },
        data: [
          {
            name: "郑州市",
            itemStyle: {
              normal: {
                color: "#000000",
                borderColor: "#389BB7",
                areaColor: "#389BB7",
              },
              emphasis: {
                color: "#000000",
                areaColor: {
                  image:
                    "/static/pngtree-floating-realistic-clouds-png-image_8623463.png", // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
                  repeat: "repeat", // 是否平铺，可以是 'repeat-x', 'repeat-y', 'no-repeat'
                },
                color: "#000",
                borderWidth: 0,
              },
            },
          },
          {
            name: "洛阳市",
            value: 10,
            itemStyle: {
              normal: {
                borderColor: "#000000",
                areaColor: {
                  image:
                    "/static/pngtree-floating-realistic-clouds-png-image_8623463.png",
                  repeat: "repeat",
                },
              },
              emphasis: {
                areaColor: {
                  image:
                    "/static/pngtree-floating-realistic-clouds-png-image_8623463.png", // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
                  repeat: "repeat", // 是否平铺，可以是 'repeat-x', 'repeat-y', 'no-repeat'
                },
                borderWidth: 0,
              },
            },
          },
          { name: "开封市", value: 20 },
          { name: "信阳市", value: 30 },
          { name: "驻马店市", value: 40 },
          { name: "南阳市", value: 41 },
          { name: "周口市", value: 15 },
          { name: "许昌市", value: 25 },
          { name: "平顶山市", value: 35 },
          { name: "新乡市", value: 35 },
          { name: "漯河市", value: 35 },
          { name: "商丘市", value: 35 },
          { name: "三门峡市", value: 35 },
          { name: "济源市", value: 35 },
          { name: "焦作市", value: 35 },
          { name: "安阳市", value: 35 },
          { name: "鹤壁市", value: 35 },
          { name: "濮阳市", value: 35 },
          { name: "开封市", value: 45 },
        ],
        animation: false,
      },
    ],
  };

  chart.setOption(option);

  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart,
    },
  },

  onReady() {},
});
