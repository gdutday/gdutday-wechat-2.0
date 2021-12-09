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
          v-model="keyword"
          placeholder="请输入想要搜索的新闻关键词"
          @input="aaa"
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
        <ming-page-changer
          @pageChange="pageChange"
          @pageChangeSearch="pageChangeSearch"
          :isSearch="isSearch"
        ></ming-page-changer>
      </view>
    </view>
  </view>
</template>

<script>
import { onMounted, reactive, ref, watch, toRefs } from "vue";
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
    //let searchVal = ref("");
    let isSearch = ref(false);
    let searchInfo = reactive({
      keyword: "",
      pageCountStr: 1,
      limitCountStr: 8,
    });

    const _getNewsInfo = (page = 1, limit = 8) => {
      //isSearch.value = false;
      return getNewsInfo(page, limit)
        .then((res) => {
          news.value = res.data;
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: "已经没有数据了",
            duration: 2000,
            icon: "error",
          });
        });
    };

    watch(
      () => searchInfo.keyword,
      () => {
        if (searchInfo.keyword == "") {
          isSearch.value = false;
          _getNewsInfo(1, 8);
        } else {
          isSearch.value = true;
        }
      },
      {
        immediate: true,
      }
    );

    const _searchNewsInfo = (searchInfo) => {
      //isSearch.value = true;
      return searchNewsInfo(searchInfo)
        .then((res) => {
          console.log(11111);
          news.value = res.data;
          console.log(news.value);
        })
        .catch((err) => {
          uni.showToast({
            title: "没有搜索到结果",
            duration: 2000,
            icon: "error",
          });
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
      _getNewsInfo(pageValue);
    };

    const aaa = debounce(() => {
      _searchNewsInfo(searchInfo);
    }, 600);

    const pageChangeSearch = (pageValue) => {
      searchInfo.pageCountStr = pageValue;
      _searchNewsInfo(searchInfo);
    };
    return {
      news,
      toNewsDetail,
      ...toRefs(searchInfo),
      isSearch,
      _getNewsInfo,
      aaa,
      _searchNewsInfo,
      pageChange,
      pageChangeSearch,
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