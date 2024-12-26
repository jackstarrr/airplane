<template>
  <div class="recharge">
    <div class="recharge-title">账户充值</div>
    <div class="recharge-body">
      <input
        type="number"
        placeholder="输入充值金额"
        min="1"
        max="100000"
        v-model="balance"
      >
      <div class="recharge-body-desc">注意: 余额仅用于钱包支付，不可提现</div>
    </div>
    <div class="recharge-footer">
      <div class="submit-btn" @click="submit">确认充值</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      balance: null, // 用户输入的充值金额
    };
  },
  methods: {
    async submit() {
      // 验证用户输入的金额是否符合规则
      let reg = /^([1-9]\d{0,4}|100000)$/;
      if (!reg.test(this.balance)) {
        this.$toast.center("仅能输入1-100000的整数");
        return;
      }

      try {
        // 检查是否存在 token
        const token = localStorage.getItem("token");
        if (!token) {
          this.$toast.center("未登录或登录信息已过期，请重新登录");
          this.$router.replace("/login");
          return;
        }

        // 调用后端接口传输数据
        const response = await axios.get("/user/rechargeBalance", {
          params: { balance: this.balance }, // 发送 balance 参数
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // 处理返回结果
        if (response && response.data && response.data.code === 200) {
          this.$toast.center(response.data.data || "充值成功！");
          this.$router.go(-1); // 返回上一页面
        } else {
          this.$toast.center("充值失败: " + (response.data.message || "未知错误"));
          console.error("接口返回错误:", response.data);
        }
      } catch (error) {
        console.error("请求失败:", error.message || error);
        this.$toast.center("请求失败，请稍后再试");
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.recharge {
  padding: 30 * $px 16 * $px 0 16 * $px;
  &-title {
    text-align: start;
    font-size: 24 * $px;
    letter-spacing: 2 * $px;
    font-weight: 600;
  }
  &-body {
    margin-top: 40 * $px;
    input {
      width: 300 * $px;
      outline: none;
      border: 0;
      font-size: 20 * $px;
      text-align: center;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10 * $px;
    }
    &-desc {
      margin-top: 20 * $px;
      font-size: 14 * $px;
      color: red;
      letter-spacing 1 * $px;
    }
  }
  &-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 25 * $px 16 * $px 15 * $px 16 * $px;
    box-shadow: 0 0 6 * $px #ccc;
    .submit-btn {
      color: #fff;
      font-size: 20 * $px;
      background-color: #1188ff;
      text-align center;
      padding: 12 * $px 0;
      border-radius: 8 * $px;
    }
  }
}
</style>
