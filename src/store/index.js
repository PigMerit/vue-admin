import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app.js";
import infoDetailed from "./modules/infoDetailed.js";
import common from "./modules/common.js";
import permission from "./modules/permission.js";
Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    app,
    infoDetailed,
    common,
    permission
  }
});
