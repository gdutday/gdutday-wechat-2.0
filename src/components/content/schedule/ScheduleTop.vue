<template>
  <view class="position-relative depth-2">
    <view :style="{ zIndex: 99, top: 0 }">
      <view :style="{ height: navInfo.zltHeight + 'px' }"></view>
      <view
        class="scheduletop-nav"
        :style="{ height: navInfo.navHeight + 'px' }"
      >
        <view
          class="scheduletop-content"
          :style="{
            height: navInfo.jnHeight + 'px',
          }"
        >
          <text>{{ todayWeather }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, toRefs, computed, reactive, onMounted } from "vue";
import { getWeatherInfo } from "@/network/commonRequest/weather.js";
import { APIs } from "@/api/API.js";
export default {
  name: "ScheduleTop",
  props: {
    navInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    console.log(props);
    const weather = reactive({
      degree: "", //温度
      weather: "", //天气
      month: "",
      day: "",
    });

    let todayWeather = computed(() => {
      return `${weather.month}月${weather.day}日 ${weather.degree}°C ${weather.weather}`;
    });

    onMounted(() => {
      getWeather();
      getDate();
    });

    //获取天气信息
    const getWeather = () => {
      getWeatherInfo()
        .then((res) => {
          console.log(res.data);
          weather.degree = res.data.data.forecast_1h[0].degree;
          weather.weather = res.data.data.forecast_1h[0].weather;
        })
        .catch((err) => {
          err;
        });
    };

    //获取date信息
    const getDate = () => {
      const date = new Date();
      weather.month = date.getMonth() + 1;
      weather.day = date.getDate();
    };

    return {
      todayWeather,
    };
  },
};
</script>

<style lang="scss" scoped>
.scheduletop-nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  .scheduletop-content {
    display: flex;
    align-items: center;
    width: 100%;
    margin-left: 32rpx;
    font-size: 16px;
  }
}
</style>