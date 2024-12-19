// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/iconfont/iconfont.css';
import axios from 'axios';
// 插件
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin);

Vue.use(Toast);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
axios.defaults.baseURL = '/api'
