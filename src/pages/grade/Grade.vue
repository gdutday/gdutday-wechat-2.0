<template>
  <view> </view>
</template>

<script>
import { mapMutations } from "vuex";
export default {};
// export default {
//   data() {
//     return {
//       title: "Hello",
//       fag: false,
//     };
//   },
//   onLoad() {},
//   methods: {
//     ...mapMutations(["setCurThemeType"]),
//     handle(val) {
//       if (val == "light") {
//         this.setCurThemeType(val);
//       } else if (val == "dark") {
//         this.setCurThemeType(val);
//       }
//     },
//   },
// };
</script>

<style lang="scss" scoped>
// .layout-wrap {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;

//   .hander-wrap {
//     width: 100%;
//     height: 200rpx;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: $light-bg-primary;

//     .hander-item {
//       color: $light-font-itme;
//     }
//   }

//   .content-wrap {
//     flex: 2;
//     overflow: auto;
//     display: flex;
//     justify-content: space-between;

//     view {
//       width: 200rpx;
//       height: 100rpx;
//       background-color: red;
//       display: flex;
//       justify-content: center;
//       align-content: center;
//       margin-bottom: 30rpx;
//     }
//   }
// }

// .login-wrap-dark {
//   .hander-wrap {
//     background-color: $dark-bg-primary;

//     .hander-item {
//       color: $dark-font-itme;
//     }
//   }

//   .content-wrap {
//     flex: 2;
//     overflow: auto;
//   }
// }
</style>


 <!-- <view
      class="layout-wrap"
      :class="getCurThemeType == 'dark' ? 'login-wrap-dark' : ''"
    >
      <view class="hander-wrap">
        <view class="hander-item">切换主题</view>
      </view>
      <view class="content-wrap">
        <view @tap="handle('light')">浅色</view>
        <view @tap="handle('dark')">暗色</view>
      </view>
      <view :class="getCurThemeType == 'dark' ? 'login-wrap-dark' : ''"> </view>
    </view> -->
