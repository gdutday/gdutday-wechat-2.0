<template>
  <view>
    <wave-header title="千寻详情"></wave-header>
    <view class="detail-container p-3 my-3 w-1">
      <view class="detail-main w-1 h-1 mb-5">
        <view class="detail-left w-1">
          <view class="detail-name fw-0_5 px- 3"> {{ detail.name }} </view>
          <view class="detail-image w-1">
            <view class="image-container flex-center depth-2">
              <image :src="detail.picture.url" mode="" />
            </view>
          </view>
        </view>
        <ul class="detail-main-info w-1 p-2 rounded-2 depth-2">
          <li class="detail-child flex-center py-3 px-1 w-1 rounded-2 depth-2">
            {{ detail.type ? "我丢失了" : "我捡到了" }}
          </li>
          <li class="detail-child flex-center py-3 px-1 w-1 rounded-2 depth-2">
            {{ timestampToFulltime(new Date(detail.timestamp)) }}
          </li>
          <li class="detail-child flex-center py-3 px-1 w-1 rounded-2 depth-2">
            {{ detail.campus }}
          </li>
          <li class="detail-child flex-center py-3 px-1 w-1 rounded-2 depth-2">
            {{ detail.place }}
          </li>
          <li class="detail-child flex-center py-3 px-1 w-1 rounded-2 depth-2">
            {{ detail.user.contact }}
          </li>
        </ul>
      </view>
      <scroll-view
        scroll-y
        scroll-with-animation
        :scroll-into-view="scrollCenter"
        class="detail-description rounded-2 depth-2"
      >
        <view class="h-1 w-1 p-3">{{ detail.description }} </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import WaveHeader from "@/components/common/WaveHeader";
import { getSpecialPost } from "@/network/ssxRequest/ssxInfo/qianxun.js";
import { onMounted, ref } from "vue";
import { timestampToFulltime } from "@/utils/common";
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

  .detail-main {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .detail-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      min-height: 100%;

      .detail-name {
        font-size: 1.5rem;
      }

      .detail-image {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: flex-end;

        .image-container {
          width: 250rpx;
          height: 250rpx;
          background: rgb(240, 240, 240);

          image {
            max-width: 200rpx;
            max-height: 200rpx;
          }
        }
      }
    }

    .detail-main-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background: rgb(240, 240, 240);
      min-height: 340px;

      .detail-child {
        background-color: rgb(224, 224, 224);
        //height: 30px;
        min-width: 70px;
      }
    }
  }

  .detail-description {
    background-color: #000;
    background: rgb(240, 240, 240);
    height: 200px;
  }
}
</style>