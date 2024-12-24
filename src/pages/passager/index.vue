<template>
  <div class="passager">
    <div class="passager-header fx-v-center fx-m-between" @click="addPassager">
      <div class="desc">添加乘机人</div>
      <img :src="addIcon" alt="">
    </div>
    <div class="passager-body">
      <passager-list :pasger-list="passagerList" @pick-item="pickItem"></passager-list>
    </div>
  </div>
</template>

<script>
import addIcon from "@/assets/iconImages/add.png";
import passagerList from "./components/passagerList";
import axios from "axios"; // 引入 axios 来进行 API 请求

export default {
  data() {
    return {
      addIcon: addIcon,
      passagerList: [] // 初始为空，数据将从后端获取
    };
  },
  created() {
    // 获取 query 中的 uid 参数
    let query = this.$route.query;
    this.uid = query.uid;

    // 调用后端接口获取乘客数据
    this.fetchPassengerData();
  },
  methods: {
    // 调用后端接口获取乘客数据
    async fetchPassengerData() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/user/showPassenger",{}, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
        });
        console.log(response.data);
        const passagerData = response.data.data;
        // 更新 passagerList 数据
        this.passagerList = [...this.passagerList, ...passagerData.map(item => ({
          name: item.passengerName,
          idNo: item.passengerId,
          phone: item.phone
        }))];
      } catch (error) {
        // 捕获并处理错误
        console.error("获取乘客数据失败", error);
      }
    },

    // 添加乘机人
    addPassager() {
      this.$router.push({
        path: '/addPassager',
        query: {
          uid: this.uid
        }
      });
    },

    // 选择乘客
    pickItem(value) {
      let item = value;
      this.id = 'add-pasger';
      item = JSON.stringify(item);
      localStorage.setItem(this.id, item);
      this.$router.back(-1);
    }
  },
  components: {
    passagerList
  }
}
</script>

<style lang="stylus" scoped>
@import "../../stylus/common.styl";

.passager {
  padding: 20 * $px 15 * $px;

  &-header {
    padding: 10 * $px 0 15 * $px 0;
    border-bottom: 1px solid #eee;

    .desc {
      font-size: 19 * $px;
    }

    img {
      display: block;
      width: 30 * $px;
      height: 30 * $px;
    }
  }
}
</style>
