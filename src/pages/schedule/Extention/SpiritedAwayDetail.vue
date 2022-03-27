<template>
  <view>
    <wave-header title="千寻详情"></wave-header>
    <view class="detail-container my-3 w-1">
      <ul
        class="detail-main-info w-1 rounded-2 py-3"
        :style="{
          'background-image': `linear-gradient(to top, ${getThemeColor.curBg} 0%, #fff 100%)`,
        }"
      >
        <li class="detail-name fw-0_5 px-3">{{ detail.name }}</li>
        <li class="detail-child">
          <text class="detail-left">种类:</text>
          <text>{{ detail.type ? "我丢失了" : "我捡到了" }}</text>
        </li>
        <li class="detail-child">
          <text class="detail-left">时间:</text>
          <text>{{ timestampToFulltime(new Date(detail.timestamp)) }}</text>
        </li>
        <li class="detail-child">
          <text class="detail-left">校区:</text>
          <text>{{ detail.campus }}</text>
        </li>
        <li class="detail-child">
          <text class="detail-left">地点:</text>
          <text>{{ detail.place }}</text>
        </li>
        <li class="detail-child">
          <text class="detail-left">联系方式:</text>
          <text>{{ detail.user.contact }}</text>
        </li>
      </ul>
    </view>

    <scroll-view
      scroll-y
      scroll-with-animation
      :scroll-into-view="scrollCenter"
      class="detail-description rounded-2 depth-2 my-2"
    >
      <view class="h-1 w-1 p-3">{{ detail.description }} </view>
    </scroll-view>

    <view class="detail-image w-1 my-2" v-if="detail.picture.url">
      <view class="image-container flex-center w-1">
        <image
          class="w-1"
          :src="'http://192.168.123.44:8848/' + detail.picture.url"
          mode="widthFix"
        />
      </view>
    </view>
  </view>
</template>

<script>
import WaveHeader from "@/components/common/WaveHeader";
import { getSpecialPost } from "@/network/ssxRequest/ssxInfo/qianxun.js";
import { onMounted, ref, computed } from "vue";
import { timestampToFulltime } from "@/utils/common";
import { useStore } from "vuex";
export default {
  components: {
    WaveHeader,
  },
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore();

    const getThemeColor = computed(() => store.state.theme);

    console.log(props);
    let detail = ref({
      type: false,
      name: "小马珍珠礼堂丁大大大撒擦撒擦撒擦擦身上擦拭擦拭测试",
      place: "理塘1五号楼",
      timestamp: "2021-10-10",
      campus: "大学城校区",
      description:
        "1！5！哥们在这给你说唱！LTCE!礼堂丁真！哥们名叫丁真！Smoke Around E-Cigeratte",
      picture: {
        url: "https://gitee.com/zhang-mingyuan123/pic/raw/master/20220311161357.png",
      },
      user: {
        contact: "400800000",
      },
    });

    let concatIsShow = ref(false);
    const myInfo = ref({});

    onMounted(() => {
      getSpecialPost(props.id)
        .then((res) => {
          console.log(res);
          detail.value = res.post;
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return {
      getThemeColor,
      detail,
      timestampToFulltime,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .detail-main-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: rgb(240, 240, 240);
    min-height: 340px;

    .detail-name {
      font-size: 2.5rem;
    }

    .detail-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-end;

      .image-container {
        background: rgb(240, 240, 240);
      }
    }

    .detail-child {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .detail-left {
        margin-right: 5px;
      }
    }
  }

  ul > li {
    padding: 20px 20px;
    border-bottom: 2px solid #ccc;
  }
}

.detail-description {
  background-color: #000;
  background: rgb(240, 240, 240);
  height: 200px;
}
</style>