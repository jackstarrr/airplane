<template>
  <div class="login-page">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="用户名" required />
      <input type="password" v-model="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
    <p>没有账户？ <router-link to="/register">注册</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // 登录逻辑
      console.log('登录成功！');
      this.$router.push('/main'); // 登录成功后跳转到主页面
    },
  },
};
</script>

<style scoped>
.login-page {
  text-align: center;
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
