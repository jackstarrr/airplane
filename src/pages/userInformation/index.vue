<template>
  <div class="user-information">
    <h2>用户信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <ul>
        <li><strong>用户ID:</strong> {{ userInfo.userid }}</li>
        <li><strong>用户名:</strong> {{ userInfo.username }}</li>
        <li><strong>密码:</strong> {{ userInfo.password }}</li>
        <li><strong>邮箱:</strong> {{ userInfo.email }}</li>
        <li><strong>电话:</strong> {{ userInfo.phone }}</li>
        <li><strong>地址:</strong> {{ userInfo.address }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {},  // 存储用户信息
      loading: true  // 加载状态
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        // 请求获取用户信息
        const token = localStorage.getItem('token');
        const response = await axios.post('/user/show', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
        });
        if (response.data.code === 200) {
          this.userInfo = response.data.data;
        } else {
          this.$toast.center('获取用户信息失败');
        }
      } catch (error) {
        console.error(error);
        this.$toast.center('加载用户信息时发生错误');
      } finally {
        this.loading = false;  // 加载完成，隐藏加载状态
      }
    }
  }
};
</script>

<style scoped>
.user-information {
  margin: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
.loading {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>
