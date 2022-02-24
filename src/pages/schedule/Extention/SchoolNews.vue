<template>
  <view class="content h-1 w-1 position-relative">
    <Ztl>
      <template v-slot:navName>
        <div>校内新闻</div>
      </template>
    </Ztl>
    <view class="news-search m-1 depth-1 position-relative rounded-4">
      <!-- <watch-input
          v-model="keyword"
          placeholder="请输入想要搜索的新闻关键词"
          @input="aaa"
          :themeColor="getThemeColor"
        ></watch-input> -->
      <view class="position-absolute news-search-logo flex-center h-1">
        <text class="iconfont icon-icon-test8"></text>
      </view>
      <input
        type="text"
        placeholder="请输入关键字进行搜索"
        class="news-search-input w-1 h-1"
        v-model="keyword"
        @blur="aaa"
      />
    </view>
    <view class="news p-2">
      <view class="mb-4 rounded-3 news-container">
        <view
          v-for="(item, index) of news"
          :key="index"
          class="news-info-container w-1 p2-3"
          :style="{ borderBottom: `4px #ccc solid` }"
          @tap="toNewsDetail(item.content)"
        >
          <view class="news-info">{{ item.title }}</view>
          <view
            ><text
              class="icon-icon-test38 iconfont"
              :style="{ color: getThemeColor.curBg }"
            ></text
          ></view>
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
    <ming-toast
      :isShow="toastIsShow"
      @resumeToastIsShow="resumeToastIsShow"
      :content="warningInfo"
      :toastType="toastType"
      :themeColor="getThemeColor"
    ></ming-toast>
  </view>
</template>

<script>
import { onMounted, reactive, ref, watch, toRefs, computed } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import WatchInput from "@/components/common/WatchInput.vue";
import MingPageChanger from "@/components/common/MingPageChanger";
import MingToast from "@/components/common/MingToast";
import {
  getNewsInfo,
  searchNewsInfo,
} from "@/network/ssxRequest/ssxInfo/news.js";
import { getStorageSync, debounce } from "@/utils/common";
export default {
  components: {
    Ztl,
    WatchInput,
    MingToast,
    MingPageChanger,
  },
  setup() {
    const store = useStore();

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    const warningInfo = ref("");
    const toastType = ref("");
    const toastIsShow = ref(false);
    const resumeToastIsShow = () => {
      toastIsShow.value = false;
    };
    const inspireToastIsShow = () => {
      toastIsShow.value = true;
    };

    let news = ref([]);
    //let searchVal = ref("");
    let isSearch = ref(false);
    let searchInfo = reactive({
      keyword: "",
      pageCountStr: 1,
      limitCountStr: 8,
    });

    const _getNewsInfo = (page = 1, limit = 8) => {
      //inspireToastIsShow();
      //isSearch.value = false;
      return getNewsInfo(page, limit)
        .then((res) => {
          inspireToastIsShow();
          toastType.value = "success";
          warningInfo.value = "获取成功";

          news.value = res.data;
        })
        .catch((err) => {
          inspireToastIsShow();
          console.log(err);
          toastType.value = "warning";
          warningInfo.value = "已经没有数据了";

          // uni.showToast({
          //   title: "已经没有数据了",
          //   duration: 2000,
          //   icon: "error",
          // });
        });
    };

    const _searchNewsInfo = (searchInfo) => {
      //isSearch.value = true;
      return searchNewsInfo(searchInfo)
        .then((res) => {
          console.log(11111);
          inspireToastIsShow();
          toastType.value = "success";
          warningInfo.value = "搜索成功";

          news.value = res.data;
          console.log(news.value);
        })
        .catch((err) => {
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = "没有搜索到结果";
          // uni.showToast({
          //   title: "没有搜索到结果",
          //   duration: 2000,
          //   icon: "error",
          // });
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
      if (searchInfo.keyword.length == 0) return;
      _searchNewsInfo(searchInfo);
    }, 100);

    const pageChangeSearch = (pageValue) => {
      searchInfo.pageCountStr = pageValue;
      _searchNewsInfo(searchInfo);
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
      warningInfo,
      getThemeColor,
      toastIsShow,
      toastType,
      resumeToastIsShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;

  .news-search {
    height: 30px;
    background-color: #ccc;

    .news-search-logo {
      width: 30px;
    }

    .news-search-input {
      padding-left: 30px;
    }
  }
  .news {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
      height: 50px;
    }
  }
}
</style>