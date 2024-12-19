<template>
  <div class="airport">
    <div class="airport-header">
      <input
        type="text"
        placeholder="请选择出发/目的机场"
        v-model="inputValue"
        @input="search"
      />
      <div class="airport-header-list">
        <div
          class="airport-header-list-item fx-row fx-m-between"
          v-for="(item, index) in matchedList"
          :key="index"
          @click="pickCity(item)"
        >
          <div class="city">{{ item }}</div>
        </div>
      </div>
      <!-- 添加提示信息 -->
      <div v-if="noCityFound" class="no-city-found">该城市不存在，请重新选择。</div>
    </div>
    <div class="airport-tab">
      <div class="airport-tab-name">热门城市</div>
      <airport-tabs
        :tabs="tabs"
        :domestic-list="hotDomestic"
        :inter-list="hotInter"
        @pick-city="pickCity"
      />
    </div>
  </div>
</template>

<script>
// 组件
import airportTabs from "./components/airportTabs";
import axios from 'axios';
import data from "@/data/airport.js"
export default {
  data() {
    return {
      hotDomestic: data.hotDomestic, // 国内热门
      hotInter: data.hotInternational, // 国际热门
      tabs: ["国内城市", "国际/港澳台"],
      params: {
        dep: {},
        arr: {}
      },
      inputValue: "",
      matchedList: [], // 匹配到的城市列表
      allCities: [], // 保存所有城市数据
      noCityFound: false // 用于显示“城市不存在”的提示
    };
  },
  created() {
    let query = this.$route.query;
    let { type } = query;
    this.type = type;
  },
  methods: {
    pickCity(item) {
      // console.log("ybc",item);
      // console.log("type",this.type)
      if (this.type == 0) {
        this.params.dep = item;
        // localStorage.setItem('dep', item);
        // console.log('dep')
        // console.log("hh",this.params.dep)
      } else if (this.type == 1) {
        this.params.arr = item;
        // localStorage.setItem('arr', item);
        // console.log("hh",this.params.arr)
      }
      console.log("params",this.params);
      // 保存城市信息到 localStorage 中
      let params = JSON.stringify(this.params);
      localStorage.setItem("selected_airport", params);

      // 将选择的城市名传递给前一个页面
      // localStorage.setItem("selected_city_name", item);

      // 返回前一个页面
      this.$router.go(-1);
    },
    async search() {
      let matchedList = [];
      if (this.inputValue !== "") {
        try {
          const token = localStorage.getItem('token');
          // 发送请求获取匹配城市数据
          const response = await axios.post('/airport/searchCity', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
          });

          if (response.data.code === 200) {
            this.allCities = response.data.data; // 保存所有城市数据
            let allAirport = this.allCities;
            // console.log(allAirport);
            // matchedList = allAirport.filter(item => {
            //   if (item.name.indexOf(this.inputValue) !== -1) {
            //     return item;
            //   }
            // });
            // this.matchedList = matchedList;
            // 检查用户输入的城市是否存在
            const matchedResults = allAirport.filter(city => city.includes(this.inputValue));

            if (matchedResults.length > 0) {
              this.matchedList = matchedResults;  // 显示匹配的城市
              this.noCityFound = false; // 重置"城市不存在"的提示
            } else {
              this.matchedList = []; // 无匹配结果
              this.noCityFound = true; // 显示"城市不存在"的提示
            }
          } else {
            this.matchedList = [];
            this.noCityFound = true;
          }
        } catch (error) {
          console.error("请求失败:", error);
          this.matchedList = [];
          this.noCityFound = true; // 显示“城市不存在”的提示
        }
      } else {
        this.matchedList = [];
        this.noCityFound = false; // 输入框为空时不显示提示
      }
    }
  },
  components: {
    airportTabs
  }
};
</script>

<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.airport {
  &-header {
    padding: 10 * $px 5 * $px;
    input {
      width: 350 * $px;
      height: 40 * $px;
      border: none;
      border-bottom: 1 * $px solid #eee;
      padding-left: 8 * $px;
      font-size: 18 * $px;
      outline: none;
    }
    &-list {
      padding: 10 * $px 15 * $px 10 * $px 25 * $px;
      &-item {
        font-size: 18 * $px;
        padding: 10 * $px 5 * $px;
        text-align: start;
        border-bottom: 1px solid #eee;
      }
    }
  }
  &-tab {
    margin-top: 50 * $px;
    &-name {
      width: 100 * $px;
      font-weight: 600;
      margin-bottom: 15 * $px;
    }
  }
  .no-city-found {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
