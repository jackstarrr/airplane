<template>
  <div class="book">
    <!-- Ticket Information Display -->
    <ticket-card
      :flight-date="ticketCard.flightDate"
      :flight-week="ticketCard.flightWeek"
      :dep-city="ticketCard.depCity"
      :arr-city="ticketCard.arrCity"
      :dep-airport="ticketCard.depAirport"
      :arr-airport="ticketCard.arrAirport"
      :flight-no="ticketCard.flightNo"
      :dep-time="ticketCard.depTime"
      :arr-time="ticketCard.arrTime"
      :dep-date="ticketCard.depDate"
      :arr-date="ticketCard.arrDate"
    ></ticket-card>

    <!-- Cabin Type Selection -->
    <div class="cabin-select">
      <label for="cabinType">选择舱位：</label>
      <select id="cabinType" v-model="cabinType" @change="updatePrice">
        <option value="0">经济舱</option>
        <option value="1">头等舱</option>
      </select>
    </div>

    <!-- Customer Information -->
    <customer-desc
      @to-page="selectPassager"
      :block-desc="pasger.name"
      :id-no="pasger.idNo"
    ></customer-desc>

    <!-- Price Bar Display -->
    <price-bar
      :price="price"
      @to-pay="payMethods"
    ></price-bar>

    <!-- Payment Methods Modal -->
    <pay-methods
      v-if="showPayMethods"
      @cancel="showPayMethods = false"
      :balance="balance"
      @select-to-pay="topPaySuccessPage"
    ></pay-methods>
  </div>
</template>

<script>
import ticketCard from "./components/ticketCard";
import customerDesc from "./components/customerDesc";
import priceBar from "./components/priceBar";
import payMethods from "./components/payMethods";
import axios from "axios";
import { dateFormat } from "vux"; // Assuming you may need this for date formatting

export default {
  data() {
    return {
      ticketCard: {
        depCity: "",
        arrCity: "",
        depAirport: "",
        arrAirport: "",
        flightDate: "",
        flightWeek: "",
        depDate: "",
        depTime: "",
        arrDate: "",
        arrTime: "",
        flightNo: "",
        planId: ""
      },
      cabinType: 0, // Default to economy class (0 for economy, 1 for first class)
      price: 0,
      headPrice: 0,
      ecoPrice: 0,
      showPayMethods: false,
      balance: 0,
      pasger: {
        name: "乘机人",
        idNo: "",
        phone: ""
      },
      userInfo: null
    };
  },
  created() {
    const query = this.$route.query;
    const {
      uid,
      dep,
      arr,
      depDate,
      ecoPrice,
      headPrice,
      week,
      flightNo,
      depTime,
      arrTime,
      depAirport,
      arrAirport,
      planId
    } = query;

    // Set ticket data
    this.uid = uid;
    this.ticketCard.flightWeek = week;
    this.ticketCard.flightNo = flightNo;
    this.ecoPrice = ecoPrice;
    this.headPrice = headPrice;
    this.ticketCard.depCity = dep;
    this.ticketCard.arrCity = arr;
    this.ticketCard.depAirport = depAirport;
    this.ticketCard.arrAirport = arrAirport;
    this.ticketCard.flightDate = depDate;
    this.ticketCard.depDate = depDate;
    this.ticketCard.arrDate = depDate;
    this.ticketCard.depTime = depTime;
    this.ticketCard.arrTime = arrTime;
    this.planId = planId; // Store plan ID
    this.price = this.ecoPrice; // Set default price to economy price

    // Load passenger info from localStorage if available
    const pasger = localStorage.getItem("add-pasger");
    if (pasger) {
      this.pasger = JSON.parse(pasger);
      localStorage.removeItem("add-pasger");
    }

    // Load user info from localStorage
    const data = localStorage.getItem("user-data");
    if (!data) {
      this.$toast.center("未找到用户信息，请重新登录！");
      this.$router.push("/login");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (!userInfo) {
      this.$toast.center("未找到用户信息，请重新登录");
      this.$router.push("/login");
      return;
    }

    this.userInfo = userInfo; // Store user info
    this.balance = this.userInfo.balance; // Sync balance
  },
  methods: {
    // Update price when cabin type is changed
    updatePrice() {
      if (this.cabinType == 0) {
        this.price = this.ecoPrice;  // Economy class
      } else if (this.cabinType == 1) {
        this.price = this.headPrice; // First class
      }
    },

    // Navigate to passenger selection page
    selectPassager() {
      this.$router.push({
        path: "/passager",
        query: { uid: this.uid }
      });
    },

    // Show payment methods if passenger is selected
    payMethods() {
      if (this.pasger.idNo == "") {
        this.$toast.center("请先选择乘机人！");
        return false;
      }
      this.showPayMethods = true;
    },

    // Handle payment processing
    async topPaySuccessPage() {
      if (!this.userInfo) {
        this.$toast.center("未找到用户信息，请重新登录！");
        return;
      }

      // Check if the balance is sufficient
      if (this.balance < this.price) {
        this.$toast.center("余额不足，请先充值！");
        return;
      }

      const orderPayload = {
        planId: this.planId,
        cabinType: this.cabinType,
        passengers: [
          {
            passengerName: this.pasger.name,
            idType: 0,
            idNumber: this.pasger.idNo,
            phone: this.pasger.phone
          }
        ]
      };

      try {
        // Call API to create order
        const response = await axios.post("/order/create", orderPayload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          }
        });

        if (response.data.code === 200) {
          this.$toast.center("预定成功！");

          // Deduct balance after successful booking
          this.userInfo.balance -= this.price;  // Deduct the balance
          localStorage.setItem("user-info", JSON.stringify(this.userInfo));  // Save updated info

          // Update balance variable
          this.balance = this.userInfo.balance;

          // Navigate to payment success page
          this.$router.push({
            path: "/paySuccess",
            query: { uid: this.uid }
          });
        } else {
          this.$toast.center("预定失败，请稍后再试！");
        }
      } catch (error) {
        console.error("订单创建失败:", error);
        this.$toast.center("预定失败，请稍后再试！");
      }
    }
  },
  components: {
    ticketCard,
    customerDesc,
    priceBar,
    payMethods
  }
};
</script>

<style lang="stylus" scoped>
@import '../../stylus/common.styl';
.book {
  padding-top: 16 * $px;
}

.cabin-select {
  margin: 16px 0;
}

select {
  padding: 8px;
  font-size: 14px;
}
</style>
