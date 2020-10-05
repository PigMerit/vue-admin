<template>
  <div id="nav-wrap">
    <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
    <el-menu
      default-active="/console/consoleIndex"
      class="el-menu-vertical"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      :collapse="isCollapse"
      :router="true"
    >
      <template v-for="router in routers">
        <el-submenu :index="router.name" :key="router.name" v-if="!router.hidden">
          <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <svg-icon :iconClass="router.meta.icon" :className="router.meta.icon" />
            <span slot="title">{{router.meta.describe}}</span>
          </template>
          <template v-for="childRouter in router.children">
            <el-menu-item
            v-if='!childRouter.hidden'
            :index="childRouter.path"
            :key="childRouter.name"
          >{{childRouter.meta.describe}}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { reactive, computed, ref } from "@vue/composition-api";
export default {
  // compiler
  name: "navMenu",
  setup(props, { root }) {
    /**data */
    const isCollapse = computed(() => root.$store.state.app.isCollapse);
    const routers = reactive(root.$router.options.routes);
    return {
      isCollapse,
      routers,
    };
  }
};
</script>
<style lang="scss" scoped>
#nav-wrap {
  @include webkit(transition,all .3s ease 0s);
  width: 100%;
  height: 100%;
  .logo{
    width:50%;
    padding:20px 25%;
    @include webkit(transition,all .3s ease 0s);
    img{
      width:100%;
    }
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 250px;
  }
  .el-menu {
    border-right: none;
  }
  .el-submenu {
    /deep/ .el-submenu__title {
      font-size: 18px ;
    }
    &.is-active.is-opened {
      /deep/ .el-submenu__title {
        background-color: #2d2d2d !important;
      }
    }
  }
  .el-submenu .el-menu-item {
    font-size: 14px;
    padding-left: 70px !important;
    border-bottom: 1px solid rgb(54, 1, 1);
    &.is-active {
      background-color: #8a8a8a33 !important;
    }
  }
}
</style>