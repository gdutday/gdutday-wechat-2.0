<template>
  <view class="w-1">
    <Ztl>
      <template v-slot:navName>
        <view>四六级成绩</view>
      </template>
    </Ztl>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-area">
      <view class="loading-spinner" :style="{ borderTopColor: themeColor.curBg }" />
      <text class="loading-text">正在查询成绩...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="errorMsg" class="empty-area">
      <view class="empty-card depth-ming">
        <text class="iconfont icon-icon-test30 empty-icon"></text>
        <text class="empty-text">{{ errorMsg }}</text>
        <view class="retry-btn" :style="{ backgroundColor: themeColor.curBg }" @tap="fetchCetScore">
          <text class="retry-text">重新查询</text>
        </view>
      </view>
    </view>

    <!-- 无数据 -->
    <view v-else-if="!scoreList.length" class="empty-area">
      <view class="empty-card depth-ming">
        <text class="iconfont icon-icon-test30 empty-icon"></text>
        <text class="empty-text">暂无四六级成绩记录</text>
      </view>
    </view>

    <!-- 成绩列表 -->
    <view v-else class="score-container animation-scale-up">
      <view
        v-for="(item, index) in scoreList"
        :key="index"
        class="score-card depth-4"
        :style="{ borderLeft: `${themeColor.curBg} 6px solid` }"
      >
        <!-- 头部：考试类型和学期 -->
        <view class="score-header">
          <view class="score-badge" :style="{ backgroundColor: themeColor.curBg }">
            <text class="badge-text">{{ item.cetLevel }}</text>
          </view>
          <text class="score-term">{{ item.term }}</text>
        </view>

        <!-- 总分 -->
        <view class="total-score-area">
          <text class="total-label">总分</text>
          <text class="total-score" :style="{ color: themeColor.curBg }">{{ item.totalScore }}</text>
        </view>

        <!-- 分项成绩 -->
        <view class="detail-scores">
          <view class="detail-item">
            <text class="detail-label">听力</text>
            <view class="detail-bar-wrapper">
              <view
                class="detail-bar"
                :style="{
                  width: getBarWidth(item.part1Score, 248.5) + '%',
                  backgroundColor: themeColor.curBg,
                }"
              />
            </view>
            <text class="detail-value">{{ item.part1Score }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">阅读</text>
            <view class="detail-bar-wrapper">
              <view
                class="detail-bar"
                :style="{
                  width: getBarWidth(item.part2Score, 248.5) + '%',
                  backgroundColor: themeColor.curBgSecond,
                }"
              />
            </view>
            <text class="detail-value">{{ item.part2Score }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">写作/翻译</text>
            <view class="detail-bar-wrapper">
              <view
                class="detail-bar"
                :style="{
                  width: getBarWidth(item.part3Score, 212) + '%',
                  backgroundColor: themeColor.curWarnColor,
                }"
              />
            </view>
            <text class="detail-value">{{ item.part3Score }}</text>
          </view>
        </view>

        <!-- 是否通过标识 -->
        <view class="pass-indicator">
          <text
            class="pass-text"
            :style="{ color: Number(item.totalScore) >= 425 ? '#4caf50' : '#f44336' }"
          >
            {{ Number(item.totalScore) >= 425 ? 'PASS' : '未通过' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Ztl from '@/components/common/Ztl.vue'
import { getCetScore } from '@/network/ssxRequest/request-v2/cetScore.js'
import { getStorageSync } from '@/utils/common.js'
import useLogin from '@/hooks/loginHooks/useLogin.js'

export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore()
    const { getCurrentUserType } = useLogin()

    const scoreList = ref([])
    const loading = ref(false)
    const errorMsg = ref('')

    const themeColor = computed(() => store.state.theme)

    const getBarWidth = (score, maxScore) => {
      const value = Number(score) || 0
      return Math.min((value / maxScore) * 100, 100)
    }

    const fetchCetScore = async () => {
      loading.value = true
      errorMsg.value = ''
      scoreList.value = []

      try {
        const params = {
          userType: getCurrentUserType(),
          cookies: getStorageSync('weCookies'),
        }

        const [isError, result] = await getCetScore(params)

        if (isError) {
          errorMsg.value = result.msg || '查询失败，请稍后重试'
          return
        }

        const { data } = result

        if (!data || !data.length) {
          scoreList.value = []
          return
        }

        scoreList.value = data
      } catch (e) {
        errorMsg.value = '网络异常，请检查网络后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchCetScore)

    return {
      scoreList,
      loading,
      errorMsg,
      themeColor,
      getBarWidth,
      fetchCetScore,
    }
  },
}
</script>

<style lang="scss" scoped>
.score-container {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.score-card {
  position: relative;
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  overflow: hidden;
}

.score-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.score-badge {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.badge-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.score-term {
  font-size: 26rpx;
  color: #666;
}

.total-score-area {
  display: flex;
  align-items: baseline;
  margin-bottom: 28rpx;
}

.total-label {
  font-size: 28rpx;
  color: #999;
  margin-right: 16rpx;
}

.total-score {
  font-size: 72rpx;
  font-weight: bold;
  line-height: 1;
}

.detail-scores {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
  width: 130rpx;
  flex-shrink: 0;
}

.detail-bar-wrapper {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  margin: 0 16rpx;
}

.detail-bar {
  height: 100%;
  border-radius: 8rpx;
  transition: width 0.6s ease;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  width: 80rpx;
  text-align: right;
  flex-shrink: 0;
}

.pass-indicator {
  position: absolute;
  top: 28rpx;
  right: 24rpx;
}

.pass-text {
  font-size: 28rpx;
  font-weight: bold;
}

/* 加载状态 */
.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 300rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #eee;
  border-top-width: 6rpx;
  border-top-style: solid;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 空状态 / 错误状态 */
.empty-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 48rpx;
  background: #fff;
  opacity: 0.9;
  border-radius: 16rpx;
  min-width: 400rpx;
}

.empty-icon {
  font-size: 80rpx;
  color: #ccc;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.retry-btn {
  padding: 12rpx 48rpx;
  border-radius: 32rpx;
}

.retry-text {
  color: #fff;
  font-size: 28rpx;
}
</style>
