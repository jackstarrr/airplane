<template>
  <div class="register-page">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="用户名" required />
      <input type="password" v-model="password" placeholder="密码" required />
      <input type="password" v-model="confirmPassword" placeholder="确认密码" required />
      <button type="submit">注册</button>
    </form>
    <p>已有账户？ <router-link to="/">登录</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        alert('密码不一致');
        return;
      }
      // 注册逻辑
      console.log('注册成功！');
      this.$router.push('/'); // 注册完成后跳转到登录页面
    },
  },
};
</script>

<style scoped>
.register-page {
  text-align: center;
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
