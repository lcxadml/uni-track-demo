<template>
  <view class="container">
    <canvas id="myCanvas" type="2d" style="width: 300px; height: 300px; background: #fff;"></canvas>
    <button @click="drawImages">绘制9张图片</button>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'

const canvasNode = ref<any>(null)   // 原生 canvas node
const ctx = ref<any>(null)          // 2d context
let canvas1;

// 准备 9 张测试图片（替换成你的地址）
const images = [
  'https://img0.baidu.com/it/u=89799624,414131634&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=892',
  'https://img2.baidu.com/it/u=2612741288,182099192&fm=253&fmt=auto&app=138&f=JPEG?w=513&h=500',
  'https://img2.baidu.com/it/u=4114414278,810060763&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1365',
  'https://img2.baidu.com/it/u=2333361368,873605405&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=617',
  'https://img1.baidu.com/it/u=1615014709,2397537842&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=658',
  'https://img1.baidu.com/it/u=1619749150,4237505502&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=767',
  'https://img1.baidu.com/it/u=1619749150,4237505502&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=767',
  'https://img1.baidu.com/it/u=1619749150,4237505502&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=767',
  'https://img1.baidu.com/it/u=1619749150,4237505502&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=767'
]

// 获取当前组件实例（在 setup 中需要这样传 this 给 selectorQuery）
const vm = getCurrentInstance()?.proxy

onMounted(async () => {
  // 等 DOM 渲染
  await nextTick()
  await initCanvas()
})

async function initCanvas() {
  // 使用 Promise 包裹 selectorQuery.exec，确保结果稳定
  const res = await new Promise<any>((resolve) => {
    const query = uni.createSelectorQuery().in(vm)
    query.select('#myCanvas').fields({ node: true, size: true }).exec((r) => {
      resolve(r)
    })
  })

  if (!res || !res[0]) {
    console.error('selectorQuery 没有返回结果，请检查 canvas id 是否正确，以及是否在小程序环境运行')
    uni.showToast({ title: 'Canvas 初始化失败', icon: 'none' })
    return
  }

  const nodeInfo = res[0]
  const nativeCanvas = nodeInfo.node
  if (!nativeCanvas) {
    console.error('未取得 canvas.node —— 请确保小程序基础库支持 type="2d"（需 >= 2.9.0）')
    uni.showToast({ title: '未取得 Canvas 节点', icon: 'none' })
    return
  }

  // 获取系统 dpr 并设置 backing store 大小，避免模糊
  const dpr = (wx.getSystemInfoSync && wx.getSystemInfoSync().pixelRatio) || 1
  // nodeInfo.width/height 是元素在页面上的尺寸（单位 px）
  nativeCanvas.width = nodeInfo.width * dpr
  nativeCanvas.height = nodeInfo.height * dpr

  const context = nativeCanvas.getContext('2d')
  // scale 回 CSS 像素系
  context.scale(dpr, dpr)

  // 保存
  canvasNode.value = nativeCanvas
  canvas1 = nativeCanvas;
  ctx.value = context

  console.log('Canvas 初始化完成', { nodeInfo, dpr })
}

/**
 * 在 type="2d" 下加载图片（使用 canvas.createImage()）
 * - 返回 HTMLImageElement（或小程序 Image 对象）
 * - 如果 createImage 或 img 返回 null，会 reject 或 resolve null，调用处需检查
 */
function loadImage(src: string): Promise<any> {
  return new Promise((resolve) => {


    // createImage() 必须在拿到 canvas node 后调用
    let img: any = null
    try {
      img = canvas1.createImage()
    } catch (e) {
      console.error('createImage 调用失败：', e)
      return resolve(null)
    }

    if (!img) {
      console.warn('createImage 返回 null')
      return resolve(null)
    }

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

  console.log(11111, canvas1);


  const cw = canvas1.width
  const ch = canvas1.height

  // 清理（注意：这里使用 backing-store 大小；但我们 scaled 了 context）
  context.clearRect(0, 0, cw, ch)
  // 画白底（以 CSS 像素为单位，已 scale，所以用 nodeInfo.width/height 也行）
  const nodeWidth = cw / ((wx.getSystemInfoSync && wx.getSystemInfoSync().pixelRatio) || 1)
  const nodeHeight = ch / ((wx.getSystemInfoSync && wx.getSystemInfoSync().pixelRatio) || 1)
  context.fillStyle = '#fff'
  context.fillRect(0, 0, nodeWidth, nodeHeight)

  const cols = 3
  const rows = 3
  const cellW = nodeWidth / cols
  const cellH = nodeHeight / rows

  // 分批加载：一次性加载 9 张通常没问题，但为了稳健也可分批
  const imgs = await Promise.all(images.map((src) => loadImage(src)))

  imgs.forEach((img: any, idx: number) => {
    if (!img) return
    const r = Math.floor(idx / cols)
    const c = idx % cols
    const x = c * cellW
    const y = r * cellH

    // 如果你想 cover/contain，可以在这里算缩放和偏移；现在简单拉伸铺满
    context.drawImage(img, x, y, cellW, cellH)
  })

  // 提交
  // 小程序的 2d Canvas 有两种 draw 方法：部分基础库需要 ctx.draw()；新版 node canvas 也可能支持直接渲染（但保底调用 draw）
  if (typeof context.draw === 'function') {
    try {
      context.draw()
    } catch (e) {
      // 有些基座不需要 draw，这里捕获避免崩溃
      console.warn('context.draw 调用失败：', e)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}

button {
  margin-top: 20rpx;
}
</style>
