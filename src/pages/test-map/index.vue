<template>
  <view class="content">
    <view class="text-area">
      <text class="title">测试地图</text>
      <custom-map name="uni-app"></custom-map>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
</script>

<style>
.container {
  width: 100vw;
  height: 60vh;
}

</style>
