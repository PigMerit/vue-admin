import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
  Button, Form,
  FormItem, Input, Row, Col,MessageBox,
  Message,
  
} from "element-ui";

import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
// Vue.use(MessageBox);
// Vue.use(Message);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
