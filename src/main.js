import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http'
import moment from 'moment'

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.axios=axios
axios.defaults.baseURL = 'http://localhost:3000/'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
