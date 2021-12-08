<template>
  <view class="content h-1 w-1">
    <Ztl>
      <template v-slot:navName>
        <div>校内新闻</div>
      </template>
    </Ztl>
    <view class="news p-2">
      <view class="news-search m-2">
        <watch-input
          v-model="searchVal"
          placeholder="请输入想要搜索的新闻关键词"
          @input="_searchNewsInfo"
        ></watch-input>
      </view>
      <view class="m-2 depth-4 news-container">
        <view
          v-for="(item, index) of news"
          :key="index"
          class="news-info-container depth-1 w-1 px-3"
          @tap="toNewsDetail(item.content)"
        >
          <view class="news-info">{{ item.title }}</view>
          <view>...</view>
        </view>
      </view>
      <view class="changepage w-1 flex-center">
        <ming-page-changer @pageChange="pageChange"></ming-page-changer>
      </view>
    </view>
  </view>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import WatchInput from "@/components/common/WatchInput.vue";
import MingPageChanger from "@/components/common/MingPageChanger";
import {
  getNewsInfo,
  searchNewsInfo,
} from "@/network/ssxRequest/ssxInfo/news.js";
import { getStorageSync, debounce } from "@/utils/common";
export default {
  components: {
    Ztl,
    WatchInput,
    MingPageChanger,
  },
  setup() {
    const store = useStore();
    let news = ref([]);
    let searchVal = ref("");
    const _getNewsInfo = (page = 1, limit = 8) => {
      return getNewsInfo(page, limit)
        .then((res) => {
          news.value = res.data;
          // let newsTitle = Object.keys(newsInfo);
          // let newsContent = Object.values(newsInfo);
          // news.value = newsTitle.map((item, index) => {
          //   return {
          //     title: item,
          //     content: newsContent[index],
          //   };
          // });

          // console.log(news.value);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const _searchNewsInfo = () => {
      return searchNewsInfo(searchVal.value)
        .then((res) => {})
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

    const pageChange = (pageValue) => {
      _getNewsInfo(pageValue, 8);
      console.log("-------------");
      console.log(pageValue);
      console.log(news.value);
      console.log("-------------");
    };

    onMounted(() => {
      _getNewsInfo(1, 8);
    });

    return {
      news,
      toNewsDetail,
      searchVal,
      _getNewsInfo,
      pageChange,
      _searchNewsInfo,
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
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .news-info-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .news-info {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

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