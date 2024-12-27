<template>
  <div class="detail">
    <div class="detail-status">已出票</div>
    <ticket-card
      :flight-date="order.flightDate"
      :flight-week="order.flightWeek"
      :dep-city="order.depcity"
      :arr-city="order.arrcity"
      :dep-airport="order.flightStartPlace"
      :arr-airport="order.flightTargetPlace"
      :flight-no="order.flightNo"
      :dep-time="order.flightStartTime"
      :arr-time="order.flightTargetTime"
      :dep-date="order.flightDate"
      :arr-date="order.arrDate"
    ></ticket-card>

    <div class="pasger-card">
      <div class="card-title">乘机人信息</div>
      <div
        class="item"
        v-for="(item, index) in pasger"
        :key="index"
      >
        <div class="item-name">{{ item.title}}</div>
        <div class="item-desc">{{ item.desc }}</div>
      </div>
    </div>

    <div class="pasger-card">
      <div class="card-title">订单信息</div>
      <div
        class="item"
        v-for="(item, index) in orderCard"
        :key="index"
      >
        <div class="item-name">{{ item.title}}</div>
        <div class="item-desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ticketCard from "@/pages/book/components/ticketCard";
import axios from 'axios';

export default {
  data() {
    return {
      pasger: [],
      orderCard: [],
      order: {}  // Store the fetched order data here
    };
  },
  created() {
    const query = this.$route.query;
    const { orderId } = query;  // Only retrieve orderId from the URL

    this.orderId = orderId;  // Save the orderId for the API request

    // Fetch the order detail from the backend
    this.fetchOrderDetail();
  },
  methods: {
    async fetchOrderDetail() {
      const token = localStorage.getItem('token');
      console.log("orderId", this.orderId);
      try {
        const response = await axios.get(`/order/detail/${this.orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        console.log("orderDetail", response.data);
        if (response.data.code === 200) {
          const orderData = response.data.data;

          // Update order with backend data
          this.order = {
            ...orderData,  // Retain all the backend data
            flightWeek: this.getFlightWeek(orderData.flightDate),  // Calculate the flight week
          };

          // Update passenger info
          this.pasger = [
            { title: "乘机人", desc: orderData.passengers[0].passengerName },
            { title: "身份证号", desc: orderData.passengers[0].idNumber },
            { title: "联系电话", desc: orderData.passengers[0].phone }
          ];

          // Update order info
          this.orderCard = [
            { title: '订单金额', desc: '￥' + orderData.totalAmount },
            { title: '订单号', desc: orderData.orderId }
          ];
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      }
    },
    getFlightWeek(date) {
      const weeks = ["日", "一", "二", "三", "四", "五", "六"];
      const flightDate = new Date(date[0], date[1] - 1, date[2]);  // Convert to Date object
      return `星期${weeks[flightDate.getDay()]}`;
    }
  },
  components: {
    ticketCard
  }
};
</script>


<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.detail {
  text-align: start;
  padding: 25 * $px 0;
  &-status {
    font-size: 24 * $px;
    font-weight: 600;
    text-align: start;
    margin-left: 22 * $px;
    margin-bottom: 26 * $px;
  }
  .pasger-card {
    font-size: 17 * $px;
    margin-top: 20 * $px;
    padding: 10 * $px 24 * $px;
  }
  .card-title {
    text-align: center;
    font-size: 13 * $px;
    font-weight: 550;
    letter-spacing: 2 * $px;
  }
  .item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8 * $px;
    margin-bottom: 6 * $px;
    &-name {
      font-size: 18 * $px;
    }
    &-desc {
      font-size: 17 * $px;
      margin-left: 8 * $px;
      margin-top: 8 * $px;
    }
  }
}
</style>


