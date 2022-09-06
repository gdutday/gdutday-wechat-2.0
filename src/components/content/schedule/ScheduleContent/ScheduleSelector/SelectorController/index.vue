<template>
  <view class="w-1 position-absolute bottom-0 bg-white p-4 main animation-slide-bottom" @tap.stop="() => {}">
    <text class="title-font mb-2">新增课程</text>
    <view class="flex row">
      <view class="main-input flex-1">
        <watch-input
          type="text"
          class=""
          v-model="classInfoOpts.classname"
          title="课程名称"
          placeholder="课程名称（必填）"
          :themeColor="getThemeColor"
        />
      </view>
      <view class="main-input flex-1">
        <watch-input
          type="text"
          class=""
          v-model="classInfoOpts.address"
          title="课程地址"
          placeholder="课程地址（必填）"
          :themeColor="getThemeColor"
        />
      </view>
    </view>
    <view class="mt-5 flex">
      <text>选择加入时间：</text>
      <picker
        mode="multiSelector"
        :range="classOptsRange"
        @columnchange="controllClassOptsColumn"
        @change="changeClassOptsActions"
      >
        <text class="mx-1 px-2"> {{ classOptsTextResult }}</text>
      </picker>
    </view>
    <view class="flex j-sb my-2">
      <text class="flex-center">选择周数</text>
      <view class="flex-row a-center">
        <text>全选</text>
        <ming-radio :themeColor="getThemeColor" :checked="isAllSelected" @check="changeSelectedActions"></ming-radio>
      </view>
    </view>
    <view class="week-container mb-2">
      <view
        v-for="(item, index) of 20"
        :key="index"
        class="week-item m-2 transition-5 ripple"
        :style="{
          backgroundColor: classInfoOpts.weeks[index] ? getThemeColor.curBgSecond : `#ccc`,
          color: getThemeColor.curTextC,
        }"
        @tap="addClassList(index)"
      >
        <text class="flex-center">
          <text v-if="availableWeeksList[index]">{{ item + 1 }}</text>
          <text v-else>{{ '×' }}</text>
        </text>
      </view>
    </view>
    <text class="my-2" :style="{ color: getThemeColor.curWarnColor }">
      {{ warningInfo }}
    </text>
    <view class="flex j-end">
      <text class="flex-center mx-2" :style="{ color: getThemeColor.curBgSecond }" @tap="adminInsertClass"
        >查看已经添加的课程</text
      >
      <view class="watch-button">
        <watch-button value="插入" :themeColor="getThemeColor" @tap="updateClasses"></watch-button>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import WatchInput from '@/components/common/WatchInput.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import SelectWeekPlugin from './SelectWeekPlugin'
import MingRadio from '@/components/common/MingRadio'
import useSelectorOptions from './classoptions-hook'
import useSelect from './select-hooks'

export default {
  components: {
    WatchInput,
    WatchButton,
    SelectWeekPlugin,
    MingRadio,
  },
  setup(props, { emit }) {
    const store = useStore()
    const { isAllSelected, changeSelected } = useSelect()
    const warningInfo = ref('请填写完信息再进行提交，提交后的课程不会随着刷新而消失，需要手动进行删除')
    const {
      controllClassOptsColumn,
      classOptsRange,
      classStartIndex,
      changeClassOpts,
      classOptsTextResult,
      classInfoOpts,
      availableWeeksList,
      insertNewClass,
    } = useSelectorOptions()

    const changeSelectedActions = () => {
      function successCallback() {
        // 第一个参数是允许的列表，第二个参数是添加的列表(对象)
        classInfoOpts.weeks = new Array(20).fill(0) // 完成初始化
        availableWeeksList.value.forEach((isWeekAvailable, index) => {
          if (isWeekAvailable) classInfoOpts.weeks[index] = 1
        })
      }
      function falseCallback() {
        classInfoOpts.weeks = new Array(20).fill(0) // 完成初始化
      }
      changeSelected(successCallback, falseCallback)
    }

    const getThemeColor = computed(() => store.state.theme)

    //真正将他加进列表
    const addClassList = index => {
      if (availableWeeksList.value[index]) {
        classInfoOpts.weeks[index] === 1 ? (classInfoOpts.weeks[index] = 0) : (classInfoOpts.weeks[index] = 1)
      }
      console.log(classInfoOpts.weeks[index])
    }

    const updateClasses = () => {
      function justifyClasses(obj) {
        const sum = obj.weeks.reduce((prev, cur) => cur + prev)
        return sum === 0 ? false : true
      }
      console.log(classInfoOpts)
      if (justifyClasses(classInfoOpts) && classInfoOpts.classname && classInfoOpts.address) {
        insertNewClass()
        emit('close')
      } else {
        warningInfo.value = '课程信息没有填写完全'
      }
    }

    const changeClassOptsActions = e => {
      changeClassOpts(e)
      // 进行全选初始化
      isAllSelected.value = false
    }

    const adminInsertClass = () => {
      uni.navigateTo({
        url: 'ScheduleAdminInsertClass/index',
      })
    }

    return {
      getThemeColor,
      classInfoOpts,
      controllClassOptsColumn,
      classOptsRange,
      classStartIndex,
      changeClassOptsActions,
      classOptsTextResult,
      availableWeeksList,
      insertNewClass,
      addClassList,
      updateClasses,
      isAllSelected,
      changeSelected,
      changeSelectedActions,
      warningInfo,
      adminInsertClass,
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 15px 15px 0 0;

  .main-input {
    height: 60px;
  }
}

.week-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 10%);

  .week-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 4px;
    width: 20px;
    height: 20px;
    text-align: center;
    border-radius: 9999px;
  }
}

.watch-button {
  height: 40px;
  width: 60px;
}
</style>
