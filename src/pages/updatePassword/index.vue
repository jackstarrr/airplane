<template>
  <div class="change-password">
    <h2>修改密码</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="userName">用户名</label>
        <input type="text" id="userName" v-model="userName" required />
      </div>
      <div class="form-group">
        <label for="password">旧密码</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">确认新密码</label>
        <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" required />
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
      userName: "",
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      message: "",
      loading: false
    };
  },
  methods: {
    async submitForm() {
      // 检查新密码和确认新密码是否一致
      if (this.newPassword !== this.confirmNewPassword) {
        this.message = "新密码和确认密码不一致！";
        return;
      }

      this.loading = true;
      this.message = ""; // 清空之前的消息

      try {
        const token = localStorage.getItem('token');
        // 发送修改密码的请求
        const response = await axios.post('/user/updatePassword', {
          userName: this.userName,
          password: this.password,
          newPassword: this.newPassword
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
        // 检查错误是否有响应 (即请求失败)
        if (error.response) {
          // 请求发出后服务器响应了，但状态码不是2xx
          this.message = `请求失败，状态码: ${error.response.status}, 错误信息: ${error.response.data.message || '未知错误'}`;
          console.error('响应错误：', error.response);
        } else if (error.request) {
          // 请求已经发出，但没有收到响应
          this.message = '请求已发送，但没有收到响应。';
          console.error('请求错误：', error.request);
        } else {
          // 其他类型的错误
          this.message = `发生错误：${error.message}`;
          console.error('其他错误：', error);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.change-password {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
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
  background-color: #4CAF50;
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
