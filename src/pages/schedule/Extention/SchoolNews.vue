<template>
  <view
    class="content w-1 position-relative"
    :style="{ 'min-height': '100vh' }"
  >
    <Ztl>
      <template v-slot:navName>
        <div>校内新闻</div>
      </template>
    </Ztl>
    <scroll-to-top-button></scroll-to-top-button>
    <refresh-button @refresh="init"></refresh-button>
    <view class="news-search m-1 depth-1 position-relative rounded-4">
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
    <view class="news px-2 mt-5">
      <view class="rounded-3 news-container">
        <view
          v-for="(item, index) of news"
          :key="index"
          class="news-info-container w-1 p-3"
          :style="{ borderBottom: `4px #ccc solid` }"
          @tap="toNewsDetail(item.content)"
        >
          <view class="news-info fw-2">{{ item.title }}</view>
          <view
            ><text
              class="icon-icon-test38 iconfont"
              :style="{ color: getThemeColor.curBg }"
            ></text
          ></view>
        </view>
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
import { onReachBottom, onPull, onPullDownRefresh } from "@dcloudio/uni-app";
import Ztl from "@/components/common/Ztl.vue";
import WatchInput from "@/components/common/WatchInput.vue";
import MingToast from "@/components/common/MingToast";
import RefreshButton from "@/components/common/RefreshButton";
import { useToast } from "@/hooks/index.js";
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
    RefreshButton,
  },
  setup() {
    const store = useStore();
    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } =
      useToast();

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    const warningInfo = ref("");

    let news = ref([]);
    //let searchVal = ref("");
    let isSearch = ref(false);
    let searchInfo = reactive({
      keyword: "",
      pageCountStr: 1,
      limitCountStr: 8,
    });

    onPullDownRefresh(() => {
      console.log("上来了");
    });

    onReachBottom(() => {
      console.log("触底了");
      let { pageCountStr, limitCountStr } = searchInfo;
      _getNewsInfo(pageCountStr, limitCountStr);
    });

    const _getNewsInfo = (page = 1, limit = 8) => {
      uni.showLoading({
        title: "加载中",
      });
      return getNewsInfo(page, limit)
        .then((res) => {
          inspireToastIsShow();
          toastType.value = "success";
          warningInfo.value = "获取成功";
          news.value = [...news.value, ...res.data];
          searchInfo.pageCountStr = searchInfo.pageCountStr + 1;
          uni.hideLoading();
        })
        .catch((err) => {
          inspireToastIsShow();
          console.log(err);
          toastType.value = "warning";
          warningInfo.value = "已经没有数据了";
          uni.hideLoading();
        });
    };

    const _searchNewsInfo = (searchInfo) => {
      uni.showLoading({
        title: "加载中",
      });
      return searchNewsInfo(searchInfo)
        .then((res) => {
          inspireToastIsShow();
          toastType.value = "success";
          warningInfo.value = "搜索成功";
          news.value = res.data;
          searchInfo.pageCountStr = searchInfo.pageCountStr + 1;
          uni.hideLoading();
        })
        .catch((err) => {
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = "没有搜索到结果";
          console.log(err);
          uni.hideLoading();
        });
    };

    //********************** */
    const toNewsDetail = (htmlOfNews) => {
      store.commit("news/setNewsDetail", { newsDetail: htmlOfNews });
      uni.navigateTo({
        url: "/pages/schedule/Extention/SchoolNewsDetail",
      });
    };

    const aaa = () => {
      if (searchInfo.keyword.length == 0) return;
      searchInfo.pageCountStr = 1;
      _searchNewsInfo(searchInfo);
    };

    const init = (params) => {
      news.value = [];
      searchInfo.pageCountStr = 1;
      _getNewsInfo(1, 8);
    };

    watch(
      () => searchInfo.keyword,
      () => {
        if (searchInfo.keyword == "") {
          init();
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
      //pageChange,
      //pageChangeSearch,
      warningInfo,
      getThemeColor,
      toastIsShow,
      toastType,
      resumeToastIsShow,
      init,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
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
    .news-container {
      .news-info-container {
        height: 200rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        .news-info {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

          max-width: 85%;
        }
      }
    }

    // .changepage {
    //   height: 50px;
    // }
  }
}
</style>