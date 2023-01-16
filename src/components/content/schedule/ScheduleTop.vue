<!--
 * @Date: 2022-07-18 21:37:31
 * @LastEditors: zhang-mingyuan123 2369558390@qq.com
 * @LastEditTime: 2022-10-21 21:51:39
 * @FilePath: \GDUTDays-wechat\gdutday-wechat-2.0\src\components\content\schedule\ScheduleTop.vue
 * @description: none
-->
<template>
  <view class="position-relative depth-2">
    <view :style="{ zIndex: 99, top: 0 }">
      <view :style="{ height: navInfo.zltHeight + 'px' }"></view>
      <view class="scheduletop-nav" :style="{ height: navInfo.navHeight + 'px' }">
        <view
          class="scheduletop-content"
          :style="{
            height: navInfo.jnHeight + 'px',
          }"
        >
          <text v-if="0">{{ todayWeather }}</text>
          <text v-else @tap="clickToJoinUs">加入我们</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, toRefs, computed, reactive, onMounted, inject } from 'vue'
import { getWeatherInfo } from '@/network/commonRequest/weather.js'
import { APIs } from '@/api/API.js'
import { useToast } from '@/hooks/index.js'
export default {
  name: 'ScheduleTop',
  props: {
    navInfo: {
      type: Object,
      default: () => {},
    },
    handleOpen: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    console.log(props)
    const weather = reactive({
      degree: '', //温度
      weather: '', //天气
      month: '',
      day: '',
    })
    let todayWeather = computed(() => {
      return `${weather.month}月${weather.day}日 ${weather.degree}°C ${weather.weather}`
    })

    const clickToJoinUs = () => {
      emit('open')
    }

    onMounted(() => {
      getWeather()
      getDate()
    })

    //获取天气信息
    const getWeather = () => {
      getWeatherInfo()
        .then(res => {
          console.log(res.data)
          weather.degree = res.data.data.forecast_1h[0].degree
          weather.weather = res.data.data.forecast_1h[0].weather
        })
        .catch(err => {
          err
        })
    }

    //获取date信息
    const getDate = () => {
      const date = new Date()
      weather.month = date.getMonth() + 1
      weather.day = date.getDate()
    }

    return {
      todayWeather,
      clickToJoinUs,
    }
  },
}
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
