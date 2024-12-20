<template>
  <div class="add-pasger">
    <div class="add-pasger-header">
      <div class="add-pasger-header-title">添加新乘机人</div>
      <div class="add-pasger-header-desc">姓名必须与所有证件保持一致</div>
    </div>
    <div class="add-pasger-body">
      <input-item
        :item-name="'身份证号'"
        :placeholder="'请务必与证件保持一致'"
        @on-input="getIdNumber"
      ></input-item>
      <input-item
        :item-name="'中文姓名'"
        :placeholder="'与乘机人证件一致'"
        @on-input="getName"
      ></input-item>
      <input-item
        :item-name="'出生日期'"
        :placeholder="'1998-05-01'"
        :is-input="false"
        :is-block="true"
        :item-content="birth"
        @pick-value="showDate"
      ></input-item>
      <input-item
        :item-name="'性别'"
        :is-input="false"
        :is-block="true"
        :placeholder="'女'"
        :item-content="gender"
        @pick-value="showGender = true"
      ></input-item>
      <input-item
        :item-name="'手机号'"
        :placeholder="'接收消息通知'"
        @on-input="getPhone"
      ></input-item>
    </div>
    <div class="add-pasger-footer">
      <div
        class="add-pasger-footer-btn"
        @click="saveInfo"
      >保存</div>
    </div>
    <popup-picker
      v-if="showGender"
      :show.sync="showGender"
      :data="genderList"
      :confirm-text="'确定'"
      :popup-title="'请选择性别'"
      :popup-style="{'width': '96%'}"
      @on-change="getNameValues"
    ></popup-picker>
  </div>
</template>

<script>
import inputItem from "./components/inputItem";
import { PopupPicker } from "vux";
import axios from "axios"; // 引入 axios 库

export default {
  data() {
    return {
      birth: "",
      gender: "",
      genderList: [["男", "女"]],
      showGender: false,
      idNumber: "", // 身份证号
      name: "", // 乘机人姓名
      phone: "", // 手机号
      passengerId: "" // 提供的乘机人ID（可选）
    };
  },
  components: {
    inputItem,
    PopupPicker
  },
  created() {
    let query = this.$route.query;
    this.uid = query.uid;

    let data = localStorage.getItem("user-data");
    data = JSON.parse(data);
    this.data = data;

    let dataList = data.res;

    // 确保 userInfo 和 pasgerList 都正确初始化
    this.userInfo = dataList[this.uid].info;
    if (!this.userInfo) {
      this.userInfo = {}; // 初始化 userInfo
    }

    if (!this.userInfo.hasOwnProperty("pasgerList")) {
      this.userInfo.pasgerList = []; // 确保 pasgerList 是一个数组
    }
    this.pasgerList = this.userInfo.pasgerList;
  },

  methods: {
    showDate() {
      const _this = this;
      this.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确认",
        minYear: 1919,
        maxYear: 2019,
        value: "",
        onConfirm() {
          _this.birth = this.value;
        }
      });
    },
    getNameValues(value) {
      this.gender = value[0];
    },
    getIdNumber(value) {
      this.idNumber = value;
    },
    getName(value) {
      this.name = value;
    },
    getPhone(value) {
      this.phone = value;
    },
    async saveInfo() {
      // 验证身份证号
      let regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!regId.test(this.idNumber)) {
        this.$toast.center("身份证号填写有误");
        return;
      }
      // 验证姓名
      let regName = /^[\u4e00-\u9fa5]{2,4}$/;
      if (!regName.test(this.name)) {
        this.$toast.center("姓名填写有误");
        return;
      }
      // 验证手机号
      let regPhone = /^1[3-9][0-9]{9}$/;
      if (!regPhone.test(this.phone)) {
        this.$toast.center("手机号填写有误");
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
        const passengerData = {
          passengerId: this.idNumber,
          passengerName: this.name,
          phone: this.phone
        };
        console.log("正在发送请求数据:", passengerData);

        const response = await axios.post(
          "/user/addpassenger",
          passengerData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );

        console.log("接口返回数据:", response.data);

        // 处理返回结果
        if (response && response.data && response.data.code === 200) {
          this.pasgerList.push(passengerData);
          this.data.res[this.uid].info.pasgerList = this.pasgerList;

          // 更新 localStorage 数据
          localStorage.setItem("user-data", JSON.stringify(this.data));

          this.$toast.center("保存成功");
          this.$router.go(-1); // 返回上一页面
        } else {
          this.$toast.center("添加失败: " + (response.data.message || "未知错误"));
          console.error("接口返回错误:", response.data);
        }
      } catch (error) {
        console.error("请求失败:", error.message || error);
        this.$toast.center("请求失败，请稍后再试");
      }
    }


  }

};
</script>

<style lang="stylus" scoped>
@import '../../stylus/common.styl';

.add-pasger {
  padding-top: 20 * $px;

  &-header {
    text-align: start;

    &-title {
      margin-left: 15 * $px;
      font-size: 26 * $px;
      font-weight: 600;
      letter-spacing: 2 * $px;
    }

    &-desc {
      margin-left: 20 * $px;
      margin-top: 7 * $px;
    }
  }

  &-body {
    padding: 20 * $px 17 * $px;
  }

  &-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 25 * $px 15 * $px 15 * $px 20 * $px;
    border-top: 1px solid #eee;
    box-shadow: 0 0 6 * $px #ccc;

    &-btn {
      padding: 10 * $px;
      text-align: center;
      color: #fff;
      background-color: #1188ff;
      border-radius: 8 * $px;
      font-size: 20 * $px;
    }
  }
}
</style>
