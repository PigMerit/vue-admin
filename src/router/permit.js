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
        store.commit("app/SET_ROLES", []);
        store.commit("app/SET_BUTTON", []);
        next()
        return
    }

    if(getToKen()){
        
        if(store.getters['app/roles'].length === 0) {
            store.dispatch('permission/getRoles').then(response => {
                console.log(response)
                let role = response.role;
                let button = response.button; // 这是上学时说的内容
                let btnPerm = response.btnPerm;
                store.commit("app/SET_ROLES", role);
                store.commit("app/SET_BUTTON", btnPerm);
                // 存储角色 
                store.dispatch('permission/createRouter', role).then(response => {
                    let addRouters = store.getters['permission/addRouters'];
                    let allRouters = store.getters['permission/allRouters'];
                    // 路由更新
                    router.options.routes = allRouters;
                    // 添加动态路由
                    router.addRoutes(addRouters)
                    // next({ ...to, replace: true});
                    next();
                    // es6扩展运算符，防止内容发生变化的情况
                    // 不被记录历史记录
                })
            });
        }else{
            next();
        }
        console.log('存在')
    }else{
        next('/login')
    }
})