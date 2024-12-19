import Vue from 'vue'
import Router from 'vue-router'

import register from '../pages/login/register'
import login from '../pages/login/login'
import home from '../pages/home'
import airport from '../pages/airport'
import ticketsList from '../pages/ticketsList'
import recommend from '../pages/recommend'
import book from '../pages/book'
import passager from '../pages/passager'
import paySuccess from '../pages/paySuccess'
import user from '../pages/user';
import orderList from '../pages/orderList';
import addPassager from '../pages/addPassager';
import recharge from '../pages/recharge';
import orderDetail from '../pages/orderDetail';
import userInformation from '../pages/userInformation';
import updatePassword from '../pages/updatePassword';
import updateInformation from '../pages/updateInformation';

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'register',
      component: register
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/airport',
      name: 'airport',
      component: airport
    },
    {
      path: '/ticketsList',
      name: 'ticketsList',
      component: ticketsList
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/book',
      name: 'book',
      component: book
    },
    {
      path: '/passager',
      name: 'passager',
      component: passager
    },
    {
      path: '/paySuccess',
      name: 'paySuccess',
      component: paySuccess
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/addPassager',
      name: 'addPassager',
      component: addPassager
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: recharge
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/userInformation',
      name: 'userInformation',
      component: userInformation
    },
    {
      path: '/updatePassword',
      name: 'updatePassword',
      component: updatePassword
    },
    {
      path: '/updateInformation',
      name: 'updateInformation',
      component: updateInformation
    }
  ],
  mode: 'history',
  scrollBehavior(to, from, savePosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }


})


