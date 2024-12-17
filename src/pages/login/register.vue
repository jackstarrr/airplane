<template>
  <div class="register">
    <div class="register-body">
      <img
        class="user-icon"
        :src="loginIcon"
      />
      <div class="register-body-desc">Register</div>
      <div class="register-form">
        <input-item
          :icon="userIcon"
          :placeholder="'请输入用户名'"
          :verify-desc="'用户名4-16位，由字母、数字、下划线、减号组成'"
          :show-verify-desc="showUserVerify"
          @on-input="checkUserName"
        ></input-item>
        <input-item
          :icon="passwordIcon"
          :placeholder="'请输入密码'"
          :verify-desc="'密码8-16位，且仅能由字母、数字组成'"
          :show-verify-desc="showPsdVerify"
          :type="'password'"
          @on-input="checkPassword"
        ></input-item>
        <input-item
          :icon="passwordIcon"
          :placeholder="'确认密码'"
          :type="'password'"
          :show-verify-desc="showRepsdVerify"
          :verify-desc="'两次密码不一致'"
          @on-input="checkRepsd"
        ></input-item>
        <input-item
          :icon="emailIcon"
          :placeholder="'请输入邮箱'"
          :verify-desc="'请输入有效的邮箱地址'"
          :show-verify-desc="showEmailVerify"
          @on-input="checkEmail"
        ></input-item>
        <input-item
          :icon="phoneIcon"
          :placeholder="'请输入电话'"
          :verify-desc="'请输入有效的电话号码'"
          :show-verify-desc="showPhoneVerify"
          @on-input="checkPhone"
        ></input-item>
        <input-item
          :icon="addressIcon"
          :placeholder="'请输入地址'"
          @on-input="checkAddress"
        ></input-item>
        <submit-btn
          :btn-text="'注册'"
          @to-submit="register"
        ></submit-btn>
      </div>
      <div class="extra" @click="toLogin">已有账号？去登录</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 引入 axios
import loginIcon from "@/assets/iconImages/login.png";
import userIcon from "@/assets/iconImages/user.png";
import passwordIcon from "@/assets/iconImages/password.png";
import emailIcon from "@/assets/iconImages/password.png"; // 新增邮箱图标
import phoneIcon from "@/assets/iconImages/password.png"; // 新增电话图标
import addressIcon from "@/assets/iconImages/password.png"; // 新增地址图标
import inputItem from "./components/inputItem";
import submitBtn from "./components/submitButton";

export default {
  data() {
    return {
      loginIcon: loginIcon,
      userIcon: userIcon,
      passwordIcon: passwordIcon,
      emailIcon: emailIcon,
      phoneIcon: phoneIcon,
      addressIcon: addressIcon,
      showUserVerify: false,
      showPsdVerify: false,
      showRepsdVerify: false,
      showEmailVerify: false,
      showPhoneVerify: false,
      userName: '',
      password: '',
      email: '',
      phone: '',
      address: '',
      isUserNameChecked: false,
      isPsdChecked: false,
      isRepsdChecked: false,
      isEmailChecked: false,
      isPhoneChecked: false,
    };
  },
  created() {
    let users = localStorage.getItem('users');
    users = JSON.parse(users) || {list: []};
    this.userList = users.list || [];
  },
  methods: {
    // 验证用户名
    checkUserName(value) {
      this.showUserVerify = true;
      let pattern = /^[a-zA-Z0-9_-]{4,16}$/;
      if (pattern.test(value)) {
        this.showUserVerify = false;
        this.isUserNameChecked = true;
        this.userName = value;
      }
    },
    // 验证密码
    checkPassword(value) {
      this.showPsdVerify = true;
      let pattern = /^[a-zA-Z0-9]{8,16}$/;
      if (pattern.test(value)) {
        this.showPsdVerify = false;
        this.isPsdChecked = true;
        this.password = value;
      }
    },
    // 确认密码
    checkRepsd(value) {
      this.showRepsdVerify = true;
      if (value == this.password) {
        this.showRepsdVerify = false;
        this.isRepsdChecked = true;
      }
    },
    // 验证邮箱
    checkEmail(value) {
      this.showEmailVerify = true;
      let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (pattern.test(value)) {
        this.showEmailVerify = false;
        this.isEmailChecked = true;
        this.email = value;
      }
    },
    // 验证电话
    checkPhone(value) {
      this.showPhoneVerify = true;
      let pattern = /^\d{11}$/; // 假设电话为11位
      if (pattern.test(value)) {
        this.showPhoneVerify = false;
        this.isPhoneChecked = true;
        this.phone = value;
      }
    },
    // 地址输入
    checkAddress(value) {
      this.address = value; // 地址不进行复杂验证
    },
    // 注册
    async register() {
      if (
        this.isUserNameChecked &&
        this.isPsdChecked &&
        this.isRepsdChecked &&
        this.isEmailChecked &&
        this.isPhoneChecked
      ) {
        // 构建用户信息
        let user = {
          username: this.userName,
          password: this.password,
          email: this.email,
          phone: this.phone,
          address: this.address,
        };

        try {
          // 发送注册请求
          const response = await axios.post('http://localhost:8080/user/register', user);
          // 如果响应成功，跳转到登录页面
          this.$toast.bottom("注册成功");
          this.$router.push({
            path: "/login"
          });
        } catch (error) {
          // 如果响应失败，显示错误信息
          if (error.response && error.response.data && error.response.data.message) {
            this.$toast.bottom(error.response.data.message); // 显示后端返回的错误信息
          } else {
            this.$toast.bottom("注册失败，请重试"); // 通用错误提示
          }
        }
      }
    },
    toLogin() {
      this.$router.push({
        path: "/login"
      });
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

.register {
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

    .register-form {
      margin-top: 24 * $px;
    }

    .extra {
      position: absolute;
      margin-top: 30 * $px;
      right: 20 * $px;
      border-bottom: 1px solid #1188ff;
      color: #1188ff;
    }
  }
}
</style>
