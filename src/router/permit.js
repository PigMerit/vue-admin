import router from "./index.js";
import {getToKen, removeToKen, removeUserName} from '../utils/token.js'

import store from "../store/index";

router.beforeEach((to,from,next)=>{
    
    //判断是否是往登录页跳转
    if(to.path==='/login'){
        //清除token和username
        removeToKen();
        removeUserName();
        store.commit("app/SET_TOKEN", '');
        store.commit("app/SET_USERNAME", '');
        next()
        return
    }

    if(getToKen()){
        next()
        console.log('存在')
    }else{
        next('/login')
    }
})