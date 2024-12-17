<template>
  <div class="login">
    <div class="login-body">
      <img
        class="user-icon"
        :src="loginIcon"
      />
      <div class="login-body-desc">Sign In</div>
      <div class="login-form">
        <input-item
          :icon="userIcon"
          :placeholder="'请输入用户名'"
          @on-input="getUserName"
        ></input-item>
        <input-item
          :icon="passwordIcon"
          :placeholder="'请输入密码'"
          :type="'password'"
          @on-input="getPsd"
        ></input-item>
        <submit-btn
          :btn-text="'登录'"
          @to-submit="login"
        ></submit-btn>
      </div>
      <div
        class="extra"
        @click="toRegister"
      >还没账号？去注册</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 axios
import loginIcon from "@/assets/iconImages/login.png";
import userIcon from "@/assets/iconImages/user.png";
import passwordIcon from "@/assets/iconImages/password.png";
import inputItem from "./components/inputItem";
import submitBtn from "./components/submitButton";

export default {
  data() {
    return {
      loginIcon: loginIcon,
      userIcon: userIcon,
      passwordIcon: passwordIcon,
      userName: '', // 添加用户名存储
      psd: '',      // 添加密码存储
      userList: []  // 存储用户列表
    };
  },
  created() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users) {
      this.userList = users.list;
    }
  },
  methods: {
    toRegister() {
      this.$router.push({
        path: "/register"
      });
    },
    getUserName(value) {
      this.userName = value;
    },
    getPsd(value) {
      this.psd = value;
    },
    async login() {
      try {
        // 发送登录请求到后端
        const response = await axios.post('/user/login', {
          username: this.userName,
          password: this.psd
        });

        // this.$router.push({
        //
        //   path: "/home"
        // });

        if (response.data.code === 200) {
          // 登录成功，跳转到首页
          this.$toast.bottom("登录成功");

          // 后端返回的 token 存储
          const token = response.data.message; // 后端返回的 token
          localStorage.setItem("token", token); // 将 token 存储到 localStorage（可根据实际需要选择存储方式）

          this.$router.push({
            path: "/home"
          });
        } else {
          this.$toast.bottom("用户名或密码错误");
        }
      } catch (error) {
        if (error.response) {
          // 服务器返回的错误信息
          this.$toast.center(error.response.data.message);
        } else {
          this.$toast.center('网络错误，请稍后重试');
        }
      }
    }
  },
  components: {
    inputItem,
    submitBtn
  }
};
</script>


<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.login {
  height: 100vh;
  padding-top: 150 * $px;
  box-sizing: border-box;
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
  &-body {
    width: 340 * $px;
    padding-bottom: 20 * $px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10 * $px;
    box-shadow: 0 0 8 * $px #ccc;
    margin: 0 auto;
    position: relative;
    padding-top: 45 * $px;
    padding-bottom: 70 * $px;
    .user-icon {
      display: block;
      width: 60 * $px;
      height: 60 * $px;
      position: absolute;
      top: -30 * $px;
      left: 140 * $px;
    }
    &-desc {
      color: #aaa;
      font-weight: 600;
      font-size: 24 * $px;
      letter-spacing: 1 * $px;
    }
    .login-form {
      margin-top: 24 * $px;
    }
  }
  .extra {
    position: absolute;
    margin-top: 30 * $px;
    right: 20 * $px;
    border-bottom: 1px solid #1188ff;
    color: #1188ff;
  }
}
</style>


