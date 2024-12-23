<template>
  <div class="recommend">
    <div class="recommend-title">推荐航班</div>
    <div class="recommend-body">
      <list-card
        :title="'推荐航班'"
        :card-list="flightList"
        @to-book="toBook"
      ></list-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import listCard from "./components/listCard.vue";

export default {
  data() {
    return {
      flightList: [], // 存储推荐航班信息
    };
  },
  created() {
    this.fetchRecommendedFlights(); // 获取推荐航班数据
  },
  methods: {
    async fetchRecommendedFlights() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$toast.center("未登录或登录信息已过期，请重新登录");
          this.$router.replace("/login");
          return;
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const requestData = {
          date: [
            tomorrow.getFullYear(),
            tomorrow.getMonth() + 1,
            tomorrow.getDate(),
          ],
        };

        const response = await axios.post("/flyplan/search", requestData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response && response.data && response.data.code === 200) {
          this.flightList = response.data.data.slice(0, 8).map((flight) => {
            const flightDate = new Date(flight.flightDate || Date.now());
            const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            return {
              planId: flight.planId,
              logoSrc: flight.logoSrc,
              airlineName: flight.airlineName,
              flightStartPlace: flight.flightStartPlace,
              flightTargetPlace: flight.flightTargetPlace,
              ecoPrice: flight.ecoPrice || "暂无报价",
              headPrice: flight.headPrice || "暂无报价",
              flightDateFormatted: `${flightDate.getFullYear()}-${(
                "0" + (flightDate.getMonth() + 1)
              ).slice(-2)}-${("0" + flightDate.getDate()).slice(-2)}`,
              dayOfWeek: daysOfWeek[flightDate.getDay()],
            };
          });
        } else {
          this.$toast.center(
            "未能获取推荐航班: " + (response.data.message || "未知错误")
          );
        }
      } catch (error) {
        console.error("请求推荐航班失败:", error.message || error);
        this.$toast.center("请求失败，请稍后再试");
      }
    },
    toBook(item) {
      this.$router.push({
        path: "/book",
        query: {
          planId: item.planId,
          from: "recommend",
        },
      });
    },
  },
  components: {
    listCard,
  },
};
</script>

<style lang="stylus" scoped>
@import '../../stylus/common.styl';

.recommend {
  padding: 10 * $px 16 * $px 20 * $px 16 * $px;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  &-title {
    font-size: 20 * $px;
    color: #fe8a18;
    font-weight: 600;
    letter-spacing: 2px;
  }
  &-body {
    padding-top: 20 * $px;
  }
}
</style>
