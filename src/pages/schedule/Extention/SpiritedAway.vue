<template>
  <view
    class="w-1 position-relative"
    :style="{ 'min-height': '100vh', backgroundColor: 'rgb(245, 245, 245)' }"
  >
    <Ztl>
      <template v-slot:navName>
        <view>千与千寻</view>
      </template>
    </Ztl>
    <view class="news-search m-1 depth-1 position-relative rounded-4">
      <view class="position-absolute news-search-logo flex-center h-1">
        <text class="iconfont icon-icon-test8"></text>
      </view>
      <input
        type="text"
        placeholder="请输入关键字进行搜索"
        class="news-search-input w-1 h-1"
        v-model="keyword"
      />
    </view>
    <view class="message-container p-2" v-if="!keyword">
      <view class="sa-changer-container h-1 w-1">
        <view
          class="sa-changer h-1 w-1 mx-2"
          v-for="(item, index) of changerValue"
          :key="index"
        >
          <watch-button
            class="sa-changer-item flex-center rounded-5 h-1"
            :value="item"
            :themeColor="getThemeColor"
            @tap="jumpToTable(changerValue[index])"
          >
          </watch-button>
        </view>
      </view>
      <view
        class="h-1 w-1 my-5 py-5 flex-column flex-center rounded-5"
        :style="{
          ' background-image': `linear-gradient(to top, ${getThemeColor.curBg} 0%, ${getThemeColor.curBgSecond} 100%)`,
          color: getThemeColor.curTextC,
        }"
      >
        <view class="flex-center w-1">
          <picker
            @change="bindPickerChange"
            :value="index"
            :range="array"
            class="w-1 mx-2"
          >
            <view
              class="sa-type rounded-5 p-5 w-1 flex-center"
              :style="{ backgroundColor: `rgba(245, 245, 245, 0.4)` }"
              >{{ array[index] }}</view
            >
          </picker>
          <!-- <text
            class="iconfont icon-icon-test36 ml-1"
            :style="{ 'font-size': '40px' }"
          ></text> -->
        </view>
        <view class="text-dark mt-2">点击上方可以切换显示内容</view>
      </view>
    </view>

    <spirited-away-container
      :list="list"
      class="spiritedaway"
      :themeColor="getThemeColor"
      :canBeDeleted="index == 2 ? true : false"
      @deletePost="deletePost"
      @updatePost="updatePost"
      @enLargePic="enLargePic"
      @donotRefresh="donotRefresh"
    ></spirited-away-container>
    <refresh-button @refresh="init"></refresh-button>
    <ming-toast
      :isShow="toastIsShow"
      @resumeToastIsShow="resumeToastIsShow"
      :content="warningInfo"
      :toastType="toastType"
      :themeColor="getThemeColor"
    ></ming-toast>
    <image-enlarge
      :modalPicPath="modalPicPath"
      v-if="modalType == 'pic'"
    ></image-enlarge>

    <spirited-away-edit
      :themeColor="getThemeColor"
      :curId="curId"
      v-else
    ></spirited-away-edit>
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
import WatchButton from "@/components/common/WatchButton.vue";
import RefreshButton from "@/components/common/RefreshButton";
import MingModal from "@/components/common/MingModal";
import ImageEnlarge from "@/components/common/ImageEnlarge";
import MingToast from "@/components/common/MingToast";
import SpiritedAwayContainer from "@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/Exetention/SpiritedAway/SpiritedAwayContainer.vue";
import SpiritedAwayEdit from "@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/Exetention/SpiritedAway/SpiritedAwayEdit/SpiritedAwayEdit.vue";
import { useStore } from "vuex";
import { computed, onMounted, provide, reactive, ref, watch } from "vue";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import { getStorageSync } from "@/utils/common";
import { useToast, useMingModal } from "@/hooks/index.js";
import {
  postPageLimit,
  getMyPosts,
  getKeywordSearch,
  getHidePost,
  getDisplayPost,
} from "@/network/ssxRequest/ssxInfo/qianxun.js";
export default {
  components: {
    Ztl,
    WatchButton,
    SpiritedAwayContainer,
    RefreshButton,
    MingModal,
    ImageEnlarge,
    MingToast,
    SpiritedAwayEdit,
  },

  setup() {
    const store = useStore();
    const changerValue = ["我捡到了", "我弄丢了"];
    const modalPicPath = ref("");
    let curId = ref();
    let list = ref([]);
    let keyword = ref("");

    //下方是提示框hooks的调用
    const {
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
      warningInfo,
    } = useToast();

    //******************************************* */
    //控制切换
    const array = ref(["丢失千寻", "拾取千寻", "我的千寻"]);
    let index = ref(0);
    //监听种类的切换
    const bindPickerChange = (e) => {
      console.log(e);
      const beforValue = index.value;
      if (beforValue == +e.detail.value) {
        return;
      }
      index.value = +e.detail.value;
      //在此处完成部分初始化
      list.value = [];
      pageInfo.page = 1;
      switchMethod();
    };
    //******************************************* */
    //控制翻页的数据
    const pageInfo = reactive({
      page: 1,
      limit: 8,
      type: true, //true是丢失
    });

    //获取我自己的千寻
    const _getMyPosts = () => {
      uni.showLoading({
        title: "加载中",
      });
      return getMyPosts(getStorageSync("stuId"))
        .then((res) => {
          console.log(res);
          list.value = [...list.value, ...res.simpleList];
        })
        .catch((err) => {
          console.log(err);
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = "没有更多了";
        })
        .finally(() => {
          uni.hideLoading();
        });
    };

    //封装一下更新页面的函数
    const _postPageLimit = (obj) => {
      uni.showLoading({
        title: "加载中",
      });
      return postPageLimit(obj)
        .then((res) => {
          list.value = [...list.value, ...res.simpleList];
          pageInfo.page++;
        })
        .catch((err) => {
          console.log(err);
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = "没有更多了";
        })
        .finally(() => {
          uni.hideLoading();
        });
    };

    //搜索
    const searchByKeyword = () => {
      uni.showLoading({
        title: "加载中",
      });
      return getKeywordSearch(pageInfo, keyword.value)
        .then((res) => {
          console.log(res);
          list.value = [...list.value, ...res.simpleList];
          pageInfo.page++;
        })
        .catch((err) => {
          console.log(err);
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = "搜索失败";
          console.log(err);
        })
        .finally(() => {
          uni.hideLoading();
        });
    };

    //隐藏操作
    const deletePostMethod = (id) => {
      uni.showLoading({
        title: "加载中",
      });
      return getHidePost(id)
        .then((res) => {
          console.log(res);
          console.log(8888);
          list.value.forEach((item) => {
            if (item.id == id) {
              item.hide = true;
            }
          });
          toastType.value = "success";
          warningInfo.value = "隐藏成功";
        })
        .catch((err) => {
          toastType.value = "warning";
          warningInfo.value = "隐藏失败";
          console.log(err);
        })
        .finally(() => {
          inspireToastIsShow();
          uni.hideLoading();
        });
    };

    //隐藏
    const displayPostMethod = (id) => {
      uni.showLoading({
        title: "加载中",
      });
      return getDisplayPost(id)
        .then((res) => {
          console.log(res);
          list.value.forEach((item) => {
            if (item.id == id) {
              item.hide = false;
            }
          });

          toastType.value = "success";
          warningInfo.value = "恢复成功";
        })
        .catch((err) => {
          console.log(err);
          toastType.value = "warning";
          warningInfo.value = "恢复失败";
        })
        .finally(() => {
          inspireToastIsShow();
          uni.hideLoading();
        });
    };

    //用于切换种类的方法
    const switchMethod = () => {
      switch (index.value) {
        case 0:
          //丢失千寻
          pageInfo.type = true;
          _postPageLimit(pageInfo);
          break;
        case 1:
          //拾取千寻
          pageInfo.type = false;
          _postPageLimit(pageInfo);
          break;

        case 2:
          //我的千寻
          _getMyPosts();
          break;
      }
    };

    //触底的时候更新
    onReachBottom(() => {
      //console.log("触底了");
      //如果在搜索
      if (keyword.value) {
        searchByKeyword();
        return;
      }

      //index.value = 2不提供刷新功能
      if (index.value != 2) {
        switchMethod();
      }
    });

    // ***********************************
    // 控制是否刷新
    let isRefresh = ref(false); //控制是否刷新的变量

    const jumpToTable = (type) => {
      isRefresh.value = true;
      uni.navigateTo({
        url: `/pages/schedule/Extention/SaSubmit?type=${type}`,
      });
    };

    //不复制控制
    const donotRefresh = (value) => {
      isRefresh.value = false;
    };
    // ***********************************

    //图片放大
    const enLargePic = (path) => {
      modalType.value = "pic";
      openModal();
      modalPicPath.value = path;
    };

    //控制图片遮罩层
    const { isShow, close, openModal, modalType } = useMingModal();

    //初始化操作
    const init = () => {
      //如果输入改变，那么要进行一次初始化
      pageInfo.page = 1;
      list.value = [];
      console.log("search");
      if (keyword.value) {
        console.log("search");
        searchByKeyword();
      } else {
        //返回了正常的页面
        switchMethod();
      }
    };

    //删除帖子
    const deletePost = (value) => {
      let hide = value[1];
      let id = value[0];
      if (hide) {
        displayPostMethod(id);
      } else {
        deletePostMethod(id);
      }
    };

    //更新帖子`
    const updatePost = (value) => {
      modalType.value = "updatePost";
      curId.value = value;
      console.log(curId.value);
      openModal();
    };

    onShow(() => {
      if (isRefresh.value) {
        init();
      }
    });

    const getThemeColor = computed(() => store.state.theme);

    watch(
      () => keyword.value,
      () => {
        init();
      }
    );

    onMounted(() => {
      init();
    });

    return {
      keyword,
      changerValue,
      getThemeColor,
      list,
      jumpToTable,
      enLargePic,
      close,
      isShow,
      modalPicPath,
      array,
      bindPickerChange,
      index,
      searchByKeyword,
      init,
      deletePost,
      updatePost,
      donotRefresh,
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
      warningInfo,
      modalType,
      curId,
    };
  },
};
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .sa-changer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .sa-changer {
      height: 60px;
    }
  }

  .sa-type {
    flex: 1;
    font-size: 40px;
  }
}
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

.spiritedaway {
  box-sizing: border-box;

  overflow-y: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  background: #f2f2f2;
}

.enlarge-pic {
  max-width: 750rpx;
}
</style>