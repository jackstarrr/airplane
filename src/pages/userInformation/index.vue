<template>
  <div class="user-information">
    <h2>用户信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div class="user-info-card">
        <ul>
          <li>
            <label for="userId"><strong>用户ID:</strong></label>
            <input type="text" id="userId" v-model="userInfo.userid" readonly />
          </li>
          <li>
            <label for="username"><strong>用户名:</strong></label>
            <input type="text" id="username" v-model="userInfo.username" readonly />
          </li>
          <li>
            <label for="password"><strong>密码:</strong></label>
            <input type="password" id="password" v-model="userInfo.password" readonly />
          </li>
          <li>
            <label for="email"><strong>邮箱:</strong></label>
            <input type="email" id="email" v-model="userInfo.email" readonly />
          </li>
          <li>
            <label for="phone"><strong>电话:</strong></label>
            <input type="text" id="phone" v-model="userInfo.phone" readonly />
          </li>
          <li>
            <label for="address"><strong>地址:</strong></label>
            <input type="text" id="address" v-model="userInfo.address" readonly />
          </li>
        </ul>
      </div>
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
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  color: #1188ff;
  margin-bottom: 60px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #888;
}

.user-info-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-info-card li {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.user-info-card label {
  width: 100px;
  font-weight: bold;
  color: #4CAF50;
}

.user-info-card input {
  width: calc(100% - 110px);
  padding: 8px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.user-info-card input[readonly] {
  background-color: #f9f9f9;
}

.user-info-card li:last-child {
  margin-bottom: 0;
}
</style>
