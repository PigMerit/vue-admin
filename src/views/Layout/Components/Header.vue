<template>
    <div id="header-wrap">
        <div class="pull-left header-icon" @click="navMenuState"><svg-icon iconClass="menu" className="menu" /></div>
        <div class="header-icon pull-right" @click="logout">
                <svg-icon iconClass="exit" className="exit" />
            </div>
    </div>
</template>
<script>
import { computed } from '@vue/composition-api'
export default {
    name: 'layoutHeader',
    setup(prpos,{root}){
        const navMenuState = (()=>{
            // console.log(root.$store.state.app.isCollapse)
            root.$store.commit('app/SET_COLLAPSE')
        })
        const logout = ()=>{
            root.$router.push({
                name:'login'
            })
        }
        return {
            navMenuState,
            logout
        }
    }
}
</script>
<style lang="scss" scoped>
    #header-wrap{
        width:100%;
        height:100%;
        // background-color: aqua;
    }

    .header-icon{
        margin-left: 30px;
        margin-right: 30px;
        cursor: pointer;
        svg{
            font-size:30px;
        }
    }
</style>