<template>
    <div id="main-wrap">
        <router-view />
    </div>
</template>
<script>
import { ref, reactive } from '@vue/composition-api';
export default {
    name: 'layoutMain',
    setup(props, { root }){}
}
</script>
<style lang="scss" scoped>
    #main-wrap{
        width:100%;
        height:100%;
        background-color: #fff;
    }
</style>