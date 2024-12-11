<template>
  <div>
    <h1>登录页面</h1>
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="用户名" v-model="username" required />
      <input type="password" placeholder="密码" v-model="password" required />
      <button type="submit">登录</button>
    </form>
    <p>
      还没有账号？<router-link to="/register">注册</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      // 假设登录成功，跳转到主页
      this.$router.push('/main'); // 跳转到主页
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>
