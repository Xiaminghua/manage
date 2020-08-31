import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import MyBread from '@/layout/bread.vue'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

Vue.use(ElementUI);
var axios=require('axios')
axios.defaults.baseURL='http://10.158.253.201:8084/'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.component(MyBread.name, MyBread)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')



