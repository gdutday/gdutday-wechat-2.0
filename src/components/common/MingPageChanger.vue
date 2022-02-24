<template>
  <view class="w-1 h-1 pagechanger">
    <view @tap="backPage"
      ><text class="iconfont icon-icon-test36"></text>
    </view>
    <view
      class="pagechanger-changer mx-5 my-2 flex-center transition-2 w-1"
      :class="isInput ? 'is-input' : ''"
    >
      <input
        type="text"
        v-model="page"
        class="text"
        @input="isInput = true"
        @focus="isInput = true"
        @blur="isInput = false"
      />
    </view>
    <view @tap="nextPage">
      <text class="iconfont icon-icon-test38"></text
    ></view>
  </view>
</template>

<script>
import { ref, watch } from "vue";
import { debounce } from "@/utils/common";
export default {
  components: {},
  props: {
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let page = ref(1);
    let isInput = ref(false);

    const backPage = () => {
      console.log(page.value);
      if (page.value == 1) {
        return;
      } else {
        page.value--;
      }
    };

    const nextPage = () => {
      console.log(page.value);
      page.value++;
    };

    watch(
      () => page.value,
      debounce(() => {
        if (!props.isSearch) {
          //如果不是search，就采用正常的方式去请求数据
          emit("pageChange", page.value);
        } else {
          //如果是search，就采用搜索的方式去请求数据
          emit("pageChangeSearch", page.value);
        }
      }, 600)
    );

    watch(
      () => props.isSearch,
      () => {
        page.value = 1;
      }
    );

    return {
      nextPage,
      backPage,
      page,
      isInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.pagechanger {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .pagechanger-changer {
    height: 35px;
    width: 90px;
    border-radius: 6px;
    border-bottom: 3px solid #ccc;
    border-top: 3px solid #ccc;
    font-size: 20px;

    .text {
      text-align: center;
      padding: 0 5px;
    }
  }
}

.is-input {
  border: 3px #17a2b8 solid !important;
  width: 50% !important;
}

.iconfont {
  font-size: 40px;
}
</style>