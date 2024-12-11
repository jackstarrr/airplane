// src/main.js
import { createApp } from 'vue';  // 引入 Vue 3 的 createApp 方法
import App from './App.vue';       // 引入根组件
import router from './router';     // 引入路由

createApp(App).use(router).mount('#app');  // 使用路由并挂载应用
