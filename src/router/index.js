import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden:true
  },
  {
    path: "/login", 
    name: "login",
    hidden:true,
    meta:{
      describe:'登录页'
    },
    component: () => import("views/login/Login.vue")
  },
  {
    path: "/console", 
    name: "console",
    redirect: "/console/consoleIndex",
    meta:{
      describe:'控制台',
      icon: 'console'
    },
    component: () => import("views/Layout/index.vue"),
    children:[
      {
        path: "/console/consoleIndex",
        name: "consoleIndex",
        meta: {
          describe: "首页"
        },
        component: () => import("views/Layout/LayoutViews/Console/index.vue")
      }
    ]
  },
  {
    path: "/info", 
    name: "info",
    // redirect: "/info/infoIndex",
    meta:{
      describe:'信息管理',
      icon: 'info'
    },
    component: () => import("views/Layout/index.vue"),
    children:[
      {
        path: "/info/infoIndex",
        name: "InfoIndex",
        meta: {
          describe: "信息列表"
        },
        component: () => import("views/Layout/LayoutViews/Info/index.vue")
      },
      {
        path: "/info/infoCategory",
        name: "InfoCategory",
        meta: {
          describe: "信息分类"
        },
        component: () => import("views/Layout/LayoutViews/Info/InfoCategory.vue")
      },
      {
        path: "/info/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          keepAlive: true,
          describe: "信息详情"
        },
        component: () => import("views/Layout/LayoutViews/Info/InfoDetailed.vue")
      }
    ]
  },
  {
    path: "/user", 
    name: "/user",
    // redirect: "/user/userIndex",
    meta:{
      describe:'用户管理',
      icon: 'user'
    },
    component: () => import("views/Layout/index.vue"),
    children:[
      {
        path: "/user/userIndex",
        name: "userIndex",
        meta: {
          describe: "用户列表"
        },
        component: () => import("views/Layout/LayoutViews/User/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
