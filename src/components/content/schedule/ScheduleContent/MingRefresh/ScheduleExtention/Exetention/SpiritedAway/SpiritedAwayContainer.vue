<template>
  <view class="px-2">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="position-relative messagecontainer w-1 border p-3 mb-3 depth-3"
      @tap="jumpToDetail(item.id)"
    >
      <view class="message-header w-1">
        <text class="message-title fw-2">{{ item.name }}</text>
        <text class="message-time text-dark">{{
          changeTimestamp(item.timestamp)
        }}</text>
      </view>
      <view class="mt-1 text-dark message-campus">{{ item.campus }}</view>
      <view class="mt-2 w-1 message-desc overflow-hidden">
        <text class="text-dark">{{ item.description }}</text>
      </view>
      <view
        v-if="item.pictureUrl"
        class="pic-container mt-4"
        @tap.stop="enLargePic('http://192.168.123.44:8848/' + item.pictureUrl)"
      >
        <image
          :src="'http://192.168.123.44:8848/' + item.pictureUrl"
          mode="aspectFill"
          class="pic"
        />
      </view>
      <view
        class="position-absolute delete-button"
        v-if="canBeDeleted"
        @tap.stop="deletePost(item.id)"
      >
        <watch-button
          class="flex-center rounded-5 w-1 h-1"
          value="删除"
          :style="{ backgroundColor: themeColor.curWarnColor }"
        ></watch-button>
      </view>
      <view
        class="position-absolute edit-button"
        v-if="canBeDeleted"
        @tap.stop="updatePost(item.id)"
      >
        <watch-button
          class="flex-center rounded-5 w-1 h-1"
          value="编辑"
          :style="{
            backgroundColor: themeColor.curBg,
            color: themeColor.curTextC,
          }"
        ></watch-button>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, ref } from "vue";
import WatchButton from "@/components/common/WatchButton";
import { timestampToFulltime } from "@/utils/common";
export default {
  components: {
    WatchButton,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    themeColor: {
      type: Object,
    },
    canBeDeleted: {
      type: Boolean,
      defualt: false,
    },
  },
  setup(props, { emit }) {
    const enLargePic = (path) => {
      emit("enLargePic", path);
    };

    const deletePost = (id) => {
      emit("deletePost", id);
    };

    const updatePost = (id) => {
      emit("updatePost", id);
    };

    const jumpToDetail = (id) => {
      uni.navigateTo({
        url: `/pages/schedule/Extention/SpiritedAwayDetail?id=${id}`,
      });
    };
    const changeTimestamp = (time) => timestampToFulltime(new Date(time));

    return {
      enLargePic,
      jumpToDetail,
      changeTimestamp,
      deletePost,
      updatePost,
    };
  },
};
</script>

<style lang="scss" scoped>
.messagecontainer {
  background-image: linear-gradient(
      90deg,
      rgba(179, 179, 179, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(148, 148, 148, 0.15) 10%, rgba(189, 189, 189, 0) 10%);
  border-radius: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-size: 15px 15px;

  .delete-button {
    right: 15px;
    bottom: 15px;
    width: 60px;
    height: 40px;
  }

  .edit-button {
    right: 90px;
    bottom: 15px;
    width: 60px;
    height: 40px;
  }

  .message-header {
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .message-title {
      font-size: 24px;
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: ellipsis; //文字隐藏后添加省略号
      white-space: nowrap; //强制不换行
      max-width: 60%;
    }
  }

  .message-campus {
    font-size: 14px;
  }

  .message-desc {
    overflow: hidden; //超出一行文字自动隐藏
    text-overflow: ellipsis; //文字隐藏后添加省略号
    white-space: nowrap; //强制不换行
  }

  .pic-container {
    width: 100px;
    height: 100px;

    .pic {
      max-width: 100px;
      max-height: 100px;
    }
  }
}
</style>