<template>
  <div class="update-info">
    <h2>修改信息</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="phone">电话</label>
        <input type="text" id="phone" v-model="phone" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="address">地址</label>
        <input type="text" id="address" v-model="address" required />
      </div>
      <button type="submit" :disabled="loading">提交</button>
      <div v-if="message" class="message">{{ message }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 axios
export default {
  data() {
    return {
      phone: "",
      email: "",
      address: "",
      message: "",
      loading: false
    };
  },
  methods: {
    async submitForm() {
      // 表单数据验证（比如正则验证手机号和邮箱格式）
      this.loading = true;
      this.message = ""; // 清空之前的消息

      try {
        const token = localStorage.getItem('token');
        // 发送修改信息的请求
        const response = await axios.post('/user/updateData', {
          phone: this.phone,
          email: this.email,
          address: this.address
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
        });

        if (response.data.code === 200) {
          this.message = response.data.data; // 显示返回的“修改成功”消息
        } else {
          this.message = response.data.message || '操作失败';
        }
      } catch (error) {
        // 错误处理
        if (error.response) {
          this.message = `请求失败，状态码: ${error.response.status}, 错误信息: ${error.response.data.message || '未知错误'}`;
        } else if (error.request) {
          this.message = '请求已发送，但没有收到响应。';
        } else {
          this.message = `发生错误：${error.message}`;
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.update-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 60px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color:#1188ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.message {
  margin-top: 15px;
  color: #ff0000;
  font-size: 14px;
}
</style>
