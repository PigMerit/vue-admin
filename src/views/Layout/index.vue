<template>
  <el-container id="layout">
    <el-aside :class="[menuStatus? 'close': 'open']"><LayoutNav /></el-aside>
    <el-container>
      <el-header><LayoutHeader /></el-header>
      <el-main><LayoutMain /></el-main>
    </el-container>
  </el-container>
</template>
          
<script>
import LayoutHeader from './Components/Header'
import LayoutMain from './Components/Main'
import LayoutNav from './Components/Nav'

import { computed } from '@vue/composition-api';
export default {
  name: "layout",
  components:{
    LayoutNav,
    LayoutHeader,
    LayoutMain
  },
  setup(props,{root}){
    const menuStatus = computed(() => root.$store.state.app.isCollapse);
    return {
      menuStatus
    }
  }
};
</script>
<style lang="scss" scoped>
#layout {
  .el-header {
    background-color: $white;
    height: 75px;
    line-height: 75px;
    box-shadow:0 3px 16px 0 rgba(0, 0, 0, .1) ;
  }

  .el-aside {
    background-color:$navBgc;
    height: 100vh;
    @include webkit(transition,all 1s ease 0s);
    &.close{
      width:60px !important;
    }
    &.open{
      width:250px !important;
    }
  }

  .el-main {
    padding:30px 30px 0 30px;
    background-color: #a5a3a3;
  }
}
</style>
