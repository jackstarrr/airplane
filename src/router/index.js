import { createRouter, createWebHistory } from 'vue-router';  // Vue Router 4 使用 createRouter 和 createWebHistory
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import MainPage from '../views/MainPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/main', component: MainPage }
];

const router = createRouter({
  history: createWebHistory(),  // 使用 history 模式
  routes
});

export default router;
