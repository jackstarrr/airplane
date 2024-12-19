<template>
  <div class="ticket-list">
    <div class="ticket-list-header">
      <div class="city-wrap fx-row fx-v-center fx-m-between">
        <div class="dep">{{ dep }}</div>
        <img :src="headIcon" />
        <div class="arr">{{ arr }}</div>
      </div>
      <div
        class="date-wrap"
        :class="{'fx-row': arrDate != '', 'fx-m-between': arrDate != ''}"
      >
        <div class="dep-date">出发时间：{{ depDate }}</div>
        <div
          class="arr-date"
          v-if="arrDate != ''"
        >返程时间：{{ arrDate }}</div>
      </div>
    </div>
    <div class="ticket-list-body" v-if="ticketList.length > 0">
      <div
        class="ticket-card"
        v-for="(item, index) in ticketList"
        :key="index"
        @click="goBook(item)"
      >
        <div class="ticket-card-body fx-row fx-v-center fx-m-between">
          <div class="ticket-time">
            <div class="time fx-row fx-v-center fx-m-between">
              <div>{{ item.depTime }}</div>
              <img :src="timeIcon" />
              <div>{{ item.arrTime }}</div>
            </div>
            <div class="airport fx-row">
              <div class="airport-dep">{{ item.depAirport }}</div>
              <div class="airport-arr">{{ item.arrAirport }}</div>
            </div>
          </div>
          <div class="ticket-price">￥{{ item.price }}</div>
        </div>
        <div class="ticket-card-footer">{{ flightNo }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import oneway_icon from "@/assets/iconImages/oneway.png";
import return_icon from "@/assets/iconImages/return.png";
import timeArrow from "@/assets/iconImages/timeArrow.png";
import axios from 'axios';

export default {
  data() {
    return {
      dep: "",
      arr: "",
      headIcon: oneway_icon,
      timeIcon: timeArrow,
      depDate: "",
      arrDate: "",
      isDomestic: true,
      depTimeList: [],
      arrTimeList: [],
      ticketList: [],
      flightNo: '东航MU5183',
      depAirportData: [], // 出发机场数据
      arrAirportData: [], // 目的机场数据
      flight: []
    };
  },
  created() {
    let query = this.$route.query;
    let { dep, arr, depDate, arrDate, isRt, uid } = query;
    isRt = isRt == 0 ? true : false;
    this.uid = uid;
    this.dep = dep; // 将路由查询参数 dep 赋值给 dep
    this.arr = arr; // 将路由查询参数 arr 赋值给 arr
    if (isRt) {
      this.headIcon = return_icon;
    }
    this.depDate = depDate;
    this.arrDate = arrDate;
    this.queryCity(dep, 0); // 查询出发机场数据
    this.queryCity(arr, 1); // 查询目的机场数据
    this.createList();
  },
  methods: {
    // 查询出发地和目的地机场数据
    async queryCity(city, type) {
      try {
        console.log("ybc", city, type);
        const token = localStorage.getItem('token');
        const response = await axios.post('/airport/search', {
          city: city
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
        });
        if (response.data.code == 200) {
          const airportData = response.data.data;
          if (type === 0) {
            // 出发机场数据
            this.depAirportData = airportData;
            console.log('depAirportData', this.depAirportData);
          } else {
            // 目的机场数据
            this.arrAirportData = airportData;
            console.log('arrAirportData', this.arrAirportData);
          }

          // 在获取到数据后调用查询航班的函数
          if (this.depAirportData.length > 0 && this.arrAirportData.length > 0) {
            this.queryAirport();
          }
        } else {
          this.$toast.center('获取机场失败');
        }
      } catch (error) {
        console.error('查询机场失败:', error);
      }
    },

// 查询匹配的机场名并根据city字段值查询航班数据
    queryAirport() {
      for (let i = 0; i < this.depAirportData.length; i++) {
        for (let j = 0; j < this.arrAirportData.length; j++) {
          const depAirport = this.depAirportData[i].airportName; // 获取出发机场的 airportName
          const arrAirport = this.arrAirportData[j].airportName; // 获取目的机场的 airportName

          // 调用 queryFlightData 方法，传入城市名称（airportName）
          this.queryFlightData(depAirport, arrAirport);
        }
      }
    },

// 查询航班数据
    async queryFlightData(depAirport, arrAirport) {
      try {
        const token = localStorage.getItem('token');
        console.log('depAirport', depAirport);
        console.log('arrAirport', arrAirport);

        const response = await axios.post('/flyplan/search', {
          flightStartPlace: depAirport, // 使用机场名称作为参数
          flightTargetPlace: arrAirport // 使用机场名称作为参数
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // 确保带有凭证的请求（如 Cookies）发送
        });

        const flightData = response.data.data;

        if (flightData && flightData.length > 0) {
          // 使用 concat 合并数据到 ticketList，避免覆盖
          this.ticketList = [...this.ticketList, ...flightData.map(item => ({
            depTime: item.flightStartTime,
            arrTime: item.flightTargetTime,
            price: item.ecoPrice, // 假设我们取经济舱价格
            depAirport: item.flightStartPlace,
            arrAirport: item.flightTargetPlace
          }))];

          console.log('ticketList', this.ticketList);
        } else {
          console.log('未找到航班数据');
        }
      } catch (error) {
        console.error('查询航班失败:', error);
      }
    },

    // 生成航班列表 (可根据需求修改逻辑)
    createList() {
      if (this.dep && this.arr) {
        // 如果有出发地和目的地数据，则不再使用本地生成数据，改为通过接口查询航班
        this.queryFlightData(this.dep.airportName, this.arr.airportName);
      }
    },

    goBook(item) {
      this.$router.push({
        path: '/book',
        query: {
          uid: this.uid,
          dep: this.dep.code,
          arr: this.arr.code,
          depTime: item.depTime,
          arrTime: item.arrTime,
          price: item.price,
          depDate: this.depDate,
          flightNo: this.flightNo,
          from: 'ticketList'
        }
      });
    }
  }
};
</script>


<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.ticket-list {
  padding: 8 * $px;
  &-header {
    padding: 16 * $px;
    background: #9acefe;
    border-radius: 8 * $px;
    box-shadow: 0 0 8 * $px #ecf6ff;
    .city-wrap {
      color: #fff;
      font-size: 20 * $px;
      font-weight: 600;
      img {
        width: 90 * $px;
        height: 35 * $px;
        display: block;
      }
    }
    .date-wrap {
      .dep-date, .arr-date {
        padding: 5 * $px;
        background: #ecf6ff;
        margin-top: 8 * $px;
        color: #888;
        border-radius: 5 * $px;
        text-align: center;
      }
    }
  }
  &-body {
    padding: 10 * $px 0;
    .ticket-card {
      margin-bottom: 12 * $px;
      background: linear-gradient(#fff, #ecf6ff);
      padding: 8 * $px 12 * $px;
      border-radius: 8 * $px;
      box-shadow: 0 0 4 * $px #eee;
      &-body {
        .ticket-time {
          width: 195 * $px;
          .time {
            font-size: 24 * $px;
            font-weight: 500;
            text-align: center;
            height: 30 * $px;
            line-height: 30 * $px;
            img {
              display: block;
              width: 40 * $px;
              height: 6 * $px;
            }
          }
          .airport {
            color: #888;
            font-size: 14 * $px;
            &-dep {
              width: 97 * $px;
              text-align: start;
            }
            &-arr {
              width: 97 * $px;
              text-align: end;
            }
          }
        }
        .ticket-price {
          font-size: 24 * $px;
          color: #ff7200;
        }
      }
      &-footer {
        text-align: start;
        margin-top: 8 * $px;
        color: #4ac29a;
      }
    }
  }
}
</style>

