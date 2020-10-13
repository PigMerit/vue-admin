<template>
  <div id="main-wrap">
    <!-- 子路由显示区 -->
    <keep-alive>
      <!-- 需要缓存 -->
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- 不需要缓存 -->
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>
<script>
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "layoutMain",
  setup(props, { root }) {}
};
</script>
<style lang="scss" scoped>
#main-wrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>