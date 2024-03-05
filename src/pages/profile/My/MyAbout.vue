<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <view>关于我们</view>
      </template>
    </Ztl>
    <view class="version-choose pt-3">
      <view v-for="(item, index) of version" :key="index" class="version-choose-item py-2"
        :class="{active: index == currentChoose}" @tap="chooseVer(index)">{{ item }}</view>
    </view>
    <view class="w-1 px-2">
      <ming-container class="w-1 p-3" v-if="2 === currentChoose">
        <template v-slot:title> <text>4.0 Version</text> </template>
        <template v-slot:desc>
          <text>4.0（现）开发者！</text>
        </template>
        <template>
          <my-introduction :introduction="introduction3"></my-introduction>
        </template>
      </ming-container>
      <ming-container class="w-1 p-3" v-if="1 === currentChoose">
        <template v-slot:title> <text>2.0 Version</text> </template>
        <template v-slot:desc>
          <text>2.0（前）开发者！</text>
        </template>
        <template>
          <my-introduction :introduction="introduction2"></my-introduction>
        </template>
      </ming-container>
      <ming-container class="w-1 p-3" v-if='0 === currentChoose'>
        <template v-slot:title> <text>1.0 Version</text> </template>
        <template v-slot:desc>
          <text>1.0（原）开发者！</text>
        </template>
        <template v-slot:default>
          <my-introduction :introduction="introduction1"></my-introduction>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import {ref} from "vue";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import MyIntroduction from "@/components/content/profile/my/MyIntroduction";
import {
  introduction2,
  introduction1,
  introduction3
} from "@/static/staticData/introduction.js";
export default {
  components: {
    Ztl,
    MingContainer,
    MyIntroduction,
  },
  setup() {
    const version = ["1.0版本", "2.0版本", "4.0版本"];
    let currentChoose = ref(2);

    const chooseVer = (index) => {
      currentChoose.value = index;
    };

    return {
      version,
      currentChoose,
      chooseVer,
      introduction1,
      introduction2,
      introduction3
    };
  },
};
</script>

<style lang="scss" scoped>
.version-choose {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .version-choose-item {
    border-bottom: 3px solid transparent;
  }
}

.active {
  border-bottom: 3px solid red !important;
}
</style>