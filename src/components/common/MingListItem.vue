<template>
  <view
    class="mli w-1 px-2 mt-2"
    :style="{ borderBottom: `${themeColor.curBgSecond} 2px solid` }"
  >
    <view class="mli-left">
      {{ content }}
    </view>
    <slot>
      <view class="mli-right h-1">
        <view
          class="mr-3"
          :style="{ color: themeColor.curBgSecond }"
          @tap="cancelMethod"
          >{{ cancelContent }}</view
        >
        <view class="mli-btn">
          <watch-button
            @tap="correctMethod"
            :value="correctContent"
            :themeColor="themeColor"
          ></watch-button>
        </view>
      </view>
    </slot>
  </view>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import WatchButton from "@/components/common/WatchButton.vue";

export default {
  components: {
    WatchButton,
  },
  props: {
    content: {
      type: String,
      default: "你的想法是",
    },
    cancelContent: {
      type: String,
      default: "删除",
    },
    correctContent: {
      type: String,
      default: "确认",
    },

    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const cancelMethod = () => {
      emit("cancelMethod");
    };

    const correctMethod = () => {
      emit("correctMethod");
    };

    return {
      cancelMethod,
      correctMethod,
    };
  },
};
</script>

<style lang="scss" scoped>
.mli {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  .mli-left {
    max-width: 130px;
  }

  .mli-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .mli-btn {
      width: 60px;
      height: 70%;
    }
  }
}
</style>