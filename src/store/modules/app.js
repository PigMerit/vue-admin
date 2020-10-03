import { Login } from "@/network/api/login.js";
import { setToKen, getToKen, setUserName, getUserName } from "@/utils/token.js";

const state = {
    isCollapse:JSON.parse(sessionStorage.getItem('isCollapse'))||false,
    token: getToKen() || '',
    username: getUserName() || ''
}

const mutations = {
    SET_COLLAPSE(state) {
        console.log(state.isCollapse)
        state.isCollapse = !state.isCollapse;
        // html5本地储存
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value){
        state.token = value
    },
    SET_USERNAME(state, value){
        state.username = value
    }
}

const actions = {  // 可以回调处理事情 
    login({ commit }, repuestData) {
        return new Promise((resolve, reject) => {
            Login(repuestData).then((response) => {
                console.log(response)
                let data = response.data.data
                // 解构的
                commit('SET_TOKEN', data.token);
                commit('SET_USERNAME', data.username);
                setToKen(data.token);
                setUserName(data.username);
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}