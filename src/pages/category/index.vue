<template>
  <view class="content">
    <text class="title">菜单页面</text>


    <view class="container">
      <view class="item" :data-track-id="`product_${index}`" id="product_123" v-for="(value, index) in list">
        {{ value }}
      </view>
    </view>
  </view>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const list = ref<string[]>(new Array(30).fill(undefined).map((_, index) => { return `第${index + 1}项内容` }))


onMounted(() => {
  setTimeout(() => {
    list.value = [...list.value, ...new Array(30).fill(undefined).map((_, index) => { return `第${index + 30 + 1}项内容` })]
  }, 3000);
})



</script>

<style>
.item {
  width: 200px;
  height: 200px;
  background: skyblue;
  margin-bottom: 20px;
}
</style>
