import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login"
    // name: "Home",
    // component: Home
  },
  {
    path: "/login", 
    name: "login",
    component: () => import("views/Login/Login.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
