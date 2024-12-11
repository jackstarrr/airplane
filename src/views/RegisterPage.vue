<template>
  <div>
    <h1>注册页面</h1>
    <form @submit.prevent="handleRegister">
      <input type="text" placeholder="用户名" v-model="username" required />
      <input type="password" placeholder="密码" v-model="password" required />
      <button type="submit">注册</button>
    </form>
    <p>
      已经有账号？<router-link to="/login">登录</router-link>
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
    handleRegister() {
      // 假设注册成功，跳转到登录页面
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>
