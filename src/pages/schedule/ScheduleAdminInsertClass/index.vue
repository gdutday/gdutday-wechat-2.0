<template>
  <view class="w-1">
    <wave-header title="处理课表"></wave-header>

    <view class="mx-4">
      <view
        v-for="classes in insertClassesList"
        :key="classes.id"
        class="flex j-sb my-2 p-2 rounded-5 overflow-hidden"
        :style="{ backgroundColor: 'rgb(240,240,240)' }"
      >
        <view class="flex-center">
          <i class="iconfont icon-icon-test6 mr-2"></i>
          {{ classes.cn }}
        </view>
        <view class="watch-button">
          <watch-button @tap="deleteClasses(classes.id)" value="删除" :themeColor="getThemeColor"></watch-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import WaveHeader from '@/components/common/WaveHeader'
import WatchButton from '@/components/common/WatchButton'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  components: {
    WaveHeader,
    WatchButton,
  },

  setup(props) {
    const store = useStore()
    const insertClassesList = computed(() => {
      return Object.values(store.state.scheduleInfo.userDefinedClasses)
    })
    const getThemeColor = computed(() => store.state.theme)

    const deleteClasses = id => {
      try {
        const copyObj = { ...store.state.scheduleInfo.userDefinedClasses }
        delete copyObj[id]
        store.commit('scheduleInfo/refreshUserDefinedClasses', { ...copyObj, id })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      insertClassesList,
      deleteClasses,
      getThemeColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.watch-button {
  height: 40px;
  width: 60px;
}
</style>
