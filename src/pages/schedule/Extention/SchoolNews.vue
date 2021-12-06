<template>
  <view class="content h-1 w-1">
    <Ztl>
      <template v-slot:navName>
        <div>校内新闻</div>
      </template>
    </Ztl>
    <view class="news px-2 depth-4">
      <view class="news-search depth-1 w-1">
        <input type="text" class="input-ming" />
      </view>
      <view class="ming-container depth-4 news-container">
        <view
          v-for="(value, key) of news"
          :key="key"
          class="news-info-container depth-1 w-1 px-3"
          @tap="toNewsDetail(value)"
        >
          <view class="news-info">{{ key }}</view>
          <view>...</view>
        </view>
      </view>
      <view class="changepage depth-1 w-1 flex-center"></view>
    </view>
  </view>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import { getNews } from "@/network/ssxRequest/ssxInfo/news.js";
import { getStorageSync } from "@/utils/common";
export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore();
    let news = ref([]);
    const getNewsInfo = (page = 1, limit = 8, session) => {
      getNews(page, limit, session)
        .then((res) => {
          news.value = res.data;
          console.log(news.value);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const toNewsDetail = (htmlOfNews) => {
      store.commit("news/setNewsDetail", { newsDetail: htmlOfNews });
      uni.navigateTo({
        url: "/pages/schedule/Extention/SchoolNewsDetail",
      });
    };

    onMounted(() => {
      getNewsInfo(1, 8, getStorageSync("jSessionId"));
    });

    return {
      news,
      toNewsDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  .news {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .news-search {
      height: 60px;
    }

    .news-container {
      flex: 1;
      display: flex;
      flex-direction: flex-start;
      align-items: center;
      .news-info-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .news-info {
          max-width: 85%;
        }
      }
    }

    .changepage {
      height: 60px;
    }
  }
}
</style>