<template>
  <div class="recharge">
    <div class="recharge-title">账户充值</div>
    <div class="recharge-body">
      <input
        type="number"
        placeholder="输入充值金额"
        min="1"
        max="100000"
        v-model="num"
      />
      <div class="recharge-body-desc">注意: 余额仅用于钱包支付，不可提现</div>
      <div class="current-balance">当前余额: ¥{{ userInfo.balance }}</div>
    </div>
    <div class="recharge-footer">
      <div class="submit-btn" @click="submit">确认充值</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: null,        // 充值金额
      userInfo: null   // 当前登录的用户信息
    };
  },
  created() {
    // 从 localStorage 获取用户信息
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (userInfo) {
      this.userInfo = userInfo; // 存储用户信息
    } else {
      this.$toast.center("未找到用户信息，请重新登录");
      this.$router.push("/login");
    }
  },
  methods: {
    submit() {
      // 校验充值金额
      let reg = /^([1-9]\d{0,4}|100000)$/;
      if (!reg.test(this.num)) {
        this.$toast.center('仅能输入1-100000的整数');
        return false;
      } else {
        // 更新余额
        const amount = parseInt(this.num);
        if (this.userInfo && typeof this.userInfo.balance === 'number') {
          this.userInfo.balance += amount; // 更新余额

          // 将更新后的用户信息保存回 localStorage
          localStorage.setItem('user-info', JSON.stringify(this.userInfo));

          this.$toast.center('充值成功！');
          this.$router.back(-1);  // 返回上一页
        } else {
          this.$toast.center('用户信息不完整，请重试！');
        }
      }
    }
  }
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
      letter-spacing: 1 * $px;
    }

    .current-balance {
      margin-top: 20 * $px;
      font-size: 18 * $px;
      color: #333;
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
      text-align: center;
      padding: 12 * $px 0;
      border-radius: 8 * $px;
    }
  }
}
</style>
