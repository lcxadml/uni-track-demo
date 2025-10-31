<template>
  <view class="container">
    <canvas id="myCanvas" type="2d" style="width: 1300px; height: 300px; background: #fff;"></canvas>

    <canvas id="textCanvas" type="2d" style="width: 1300px; height: 300px; background: #fff;"></canvas>
  </view>

  <button @click="startTextAnimation">动一下</button>
  <button @click="startImageAnimation">动一下图片</button>
  <button @click="handleAllStart">一起动吧</button>
  <button @click="startOpacityAni">透明度</button>


</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

const ctx = ref<CanvasRenderingContext2D>()          // 2d context
const textCtx = ref<CanvasRenderingContext2D>();


let canvas1: HTMLCanvasElement, textCanvas: HTMLCanvasElement;


let textGrow = true, textScale = 1, loadedImg;

const loadedImageRef = ref<HTMLImageElement>();

// 准备 9 张测试图片（替换成你的地址）
const images = [
  'https://img0.baidu.com/it/u=89799624,414131634&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=892',
]

// 获取当前组件实例（在 setup 中需要这样传 this 给 selectorQuery）
const vm = getCurrentInstance()?.proxy

onMounted(async () => {
  // 等 DOM 渲染

  initCanvas().then(async _ => {
    await loadImages();
    // drawImages();
  });
  initTextCanvas().then(_ => {
    startTextAnimation();
  });

})



async function initCanvas() {
  const query = uni.createSelectorQuery().in(vm);


  // 图片canvas
  return new Promise((resolve, reject) => {
    query.select('#myCanvas').fields({ node: true, size: true }, () => { }).exec((res) => {
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

const handleAllStart = () => {
  startTextAnimation();
  startImageAnimation();
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
    // @ts-expect-error
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

const loadImages = async () => {
  loadedImg = await loadImage(images[0]);
  loadedImageRef.value = loadedImg;
}

async function drawImages() {
  ctx.value?.clearRect(0, 0, 1300, 1300);
  ctx.value?.save();
  ctx.value!.globalAlpha = 2 - textScale;
  ctx.value!.drawImage(loadedImageRef.value as HTMLImageElement, 100, 100, textScale * 200, textScale * 200);

  ctx.value?.restore();

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
  // @ts-expect-error
  canvas1.requestAnimationFrame(drawImages);
}

const opacityAni = () => {
  ctx.value?.clearRect(0, 0, 1300, 1300);
  ctx.value?.save();
  ctx.value!.globalAlpha = 2 - textScale;
  ctx.value!.drawImage(loadedImageRef.value as HTMLImageElement, 100, 100, 200, 200);

  ctx.value?.restore();

  if (textGrow) {
    textScale += 0.005;
  } else {
    textScale -= 0.005;
  }


  if (textScale > 1.3) {
    textGrow = false;
  } else {
    if (textScale <= 1) {
      textGrow = true;
    }
  }
  // @ts-expect-error
  canvas1.requestAnimationFrame(opacityAni);
}

const startOpacityAni = () => {
  textScale = 1; textGrow = true;
  opacityAni();
}


const startImageAnimation = () => {

  textScale = 1; textGrow = true;
  // @ts-expect-error
  canvas1.requestAnimationFrame(drawImages);

}

const drawText = () => {
  const baseFontSize = 48;
  if (!textCtx.value) return;
  textCtx.value.clearRect(0, 0, 1300, 1300);
  textCtx.value?.save();
  textCtx.value.font = `${baseFontSize * textScale}px serif`;
  textCtx.value.textBaseline = 'middle';
  textCtx.value?.fillText('李存兴啊', 150, 100);
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

  // @ts-expect-error
  textCanvas.requestAnimationFrame(drawText);

}

const startTextAnimation = (
) => {
  textScale = 1; textGrow = true;
  // @ts-expect-error
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
