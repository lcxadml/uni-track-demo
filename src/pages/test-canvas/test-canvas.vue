<template>
  <view class="container">
    <canvas id="myCanvas" type="2d" style="width: 1300px; height: 300px; background: #fff;"></canvas>

    <canvas id="textCanvas" type="2d" style="width: 1300px; height: 300px; background: #fff;"></canvas>
  </view>

  <button @click="startTextAnimation">动一下</button>

</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

const ctx = ref<CanvasRenderingContext2D>()          // 2d context
const textCtx = ref<CanvasRenderingContext2D>();

let canvas1: CanvasRenderingContext2D, textCanvas: CanvasRenderingContext2D;

let textGrow = true, textScale = 1;

// 准备 9 张测试图片（替换成你的地址）
const images = [
  'https://img0.baidu.com/it/u=89799624,414131634&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=892',
]

// 获取当前组件实例（在 setup 中需要这样传 this 给 selectorQuery）
const vm = getCurrentInstance()?.proxy

onMounted(() => {
  // 等 DOM 渲染
  initCanvas().then(_ => {
    drawImages();
  });
  initTextCanvas().then(_ => {
    startTextAnimation();
  });

})



async function initCanvas() {
  const query = uni.createSelectorQuery().in(vm);


  // 图片canvas
  return new Promise((resolve, reject) => {
    query.select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
      const nodeInfo = res[0]
      const nativeCanvas = nodeInfo.node;
      // nodeInfo.width/height 是元素在页面上的尺寸（单位 px）
      nativeCanvas.width = nodeInfo.width;
      nativeCanvas.height = nodeInfo.height;

      const context = nativeCanvas.getContext('2d')
      canvas1 = nativeCanvas;
      ctx.value = context;
      resolve(null);
    });
  })


}

const initTextCanvas = async () => {
  const query = uni.createSelectorQuery().in(vm);
  // 文本canvas
  return new Promise((resolve, reject) => {
    query.select('#textCanvas').fields({ node: true, size: true }).exec((res) => {
      const nodeInfo = res[0]
      const nativeCanvas = nodeInfo.node;
      // nodeInfo.width/height 是元素在页面上的尺寸（单位 px）
      nativeCanvas.width = nodeInfo.width;
      nativeCanvas.height = nodeInfo.height;
      const context = nativeCanvas.getContext('2d')
      textCanvas = nativeCanvas;
      textCtx.value = context;
      resolve(null);
    })
  })
}

function loadImage(src: string): Promise<any> {
  return new Promise((resolve) => {


    // createImage() 必须在拿到 canvas node 后调用
    let img: any = null
    img = canvas1.createImage()

    img.onload = () => resolve(img)
    img.onerror = (err: any) => {
      console.warn('图片加载失败：', src, err)
      resolve(null)
    }

    // 关键——只有在 img 有 nodeId（即 createImage 成功、canvas node 有效）时，赋 src 才不会报 nodeId undefined
    try {
      img.src = src
    } catch (e) {
      console.error('设置 img.src 报错：', e)
      resolve(null)
    }
  })
}

async function drawImages() {
  const context = ctx.value
  const imgs = await loadImage(images[0])
  context.drawImage(imgs, 100, 100, 200, 200)
  if (typeof context.draw === 'function') {
    try {
      context.draw()
    } catch (e) {
      // 有些基座不需要 draw，这里捕获避免崩溃
      console.warn('context.draw 调用失败：', e)
    }
  }
}

const drawText = () => {
  if (!textCtx.value) return;
  textCtx.value.clearRect(0, 0, 1300, 1300);
  textCtx.value?.save();
  textCtx.value.font = '48px serif';

  textCtx.value.scale(textScale, textScale);
  textCtx.value?.fillText('李存兴啊', 100, 100);
  textCtx.value?.restore();


  // 终止动画逻辑

  if (textGrow) {
    textScale += 0.05;
  } else {
    textScale -= 0.05;
  }


  if (textScale > 1.5) {
    textGrow = false;
  } else {
    if (textScale <= 1) {
      return;
    }
  }

  textCanvas.requestAnimationFrame(drawText);

}

const startTextAnimation = (
) => {
  textScale = 1; textGrow = true;
  textCanvas.requestAnimationFrame(drawText);
}

</script>

<style scoped>
.container {
  width: 100vw;
  overflow-x: scroll;
}

button {
  margin-top: 20rpx;
}
</style>
