<template>
  <view class="p-2 sa-table w-1">
    <view class="sa-table-input my-5">
      <watch-input type="text" class="" title="我的学号" v-model="user.studentId" :value="user.studentId" must
        placeholder="我的学号：不展示（主要用于在拾取物品成功后删除帖子）" :themeColor="getThemeColor" />
    </view>
    <view class="sa-table-input my-5">
      <watch-input type="text" class="" title="我的联系方式" v-model="user.contact" :value="user.contact" must
        placeholder="我的联系方式（邮箱或QQ），手机也行" :themeColor="getThemeColor" />
    </view>

    <view class="sa-table-input my-5">
      <watch-input type="text" class="" title="物品名称" must v-model="name" :value="name" placeholder="请输入物品名称"
        :themeColor="getThemeColor" />
    </view>
    <view class="sa-table-input my-5">
      <watch-input type="text" class="" title="物品位置" v-model="place" :value="place" placeholder="请输入物品位置"
        :themeColor="getThemeColor" />
    </view>
    <!-- <view class="sa-table-input my-5" v-if="type == false">
        <watch-input
          type="text"
          class=""
          title="丢失人饭卡的学号（可选）"
          v-model="stuId"
          placeholder="丢失人饭卡的学号（可选）"
          :themeColor="getThemeColor"
        />
      </view> -->
    <view class="sa-table-textarea my-5">
      <watch-input textarea class="" title=" " v-model="description" :value="description" placeholder="请输入物品描述"
        :themeColor="getThemeColor" />
    </view>
    <view class="sa-table-image my-5">
      <!-- 图片上传area -->
      <view class="image-upload-image mr-4">
        <watch-button @tap="choosePic" value="+" :themeColor="getThemeColor"></watch-button>
      </view>
      <view class="image-show flex-center position-relative" v-show="picPath">
        <image :src="picPath" mode="" />
        <view class="image-cancel position-absolute rounded-circle flex-center" @tap="removePicPath">x</view>
      </view>
    </view>
    <view class="w-1 my-5" :style="{ height: '60px' }">
      <watch-button @tap="submitMyTable" value="提交我的请求" :themeColor="getThemeColor">
      </watch-button>
    </view>
    <ming-toast :isShow="toastIsShow" @resumeToastIsShow="resumeToastIsShow" :content="warningInfo" :toastType="toastType"
      :themeColor="getThemeColor"></ming-toast>
  </view>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import WatchInput from "@/components/common/WatchInput";
import WatchButton from "@/components/common/WatchButton";
import MingToast from "@/components/common/MingToast";

import { getStorageSync, becomePromise } from "@/utils/common.js";
import { postQianXun } from "@/network/ssxRequest/ssxInfo/qianxun.js";
import { useToast, useSubmit } from "@/hooks/index.js";
export default {
  props: {
    type: String,
  },
  components: {
    WatchInput,
    WatchButton,
    MingToast,
  },
  setup(props) {
    const store = useStore();

    const getThemeColor = computed(() => store.state.theme);

    //************* */
    const { checkIsEmpty } = useSubmit();

    const {
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
      warningInfo,
    } = useToast();
    //******************* */

    const userTable = reactive({
      user: {
        studentId: "",
        contact: "",
      },
      //contactInfo: 0,
      name: "",
      place: "",
      campus: getStorageSync("campus"),
      //stuId: "", //可选项
      description: "",
      picPath: "", //可选项
      type: props.type == "我捡到了" ? false : true,
    });

    const uploadFile = (id) => {
      return uni.uploadFile({
        url: "http://192.168.123.44:8848/gdutday2/qianxun/addPicture/" + id, //仅为示例，非真实的接口地址
        filePath: userTable.picPath,
        name: "picture",
        header: {
          "Content-Type": "application/octet-stream",
          "Content-Type": "multipart/form-data",
          "Content-Type": "image/gif",
          "Content-Type": "application/json",
        },
        // formData: {
        //   post: userTable,
        // },
        success: (uploadFileRes) => {
          console.log(uploadFileRes.data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    };

    //post我们的表单给后端
    const submitMyTable = () => {
      let needtoCheckList = [
        userTable.user.studentId,
        userTable.user.contact,
        userTable.name,
      ];
      if (checkIsEmpty([needtoCheckList])) {
        _postQianXun();
      } else {
        inspireToastIsShow();
        warningInfo.value = "必填项不能为空";
        toastType.value = "warning";
      }
    };

    const _postQianXun = async () => {
      uni.showLoading({
        title: "加载中",
      });
      await postQianXun(userTable)
        .then((res) => {
          console.log(res);
          uploadFile(res.postId);

          uni.showToast({
            title: "提交成功",
            duration: 2000,
          });
          if (res.postId) {
            uni.navigateBack({
              delta: 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          console.log(err);
          inspireToastIsShow();
          toastType.value = "warning";
          warningInfo.value = err.message;
          uni.hideLoading();
        });
    };

    const choosePic = async (e) => {
      //this.$isShake ? uni.vibrateShort() : '';
      try {
        const {
          tempFilePaths: [path],
        } = await becomePromise(uni.chooseImage, { count: 1 }, "chooseImage");
        const { savedFilePath: newPath } = await becomePromise(
          uni.saveFile,
          { tempFilePath: path },
          "saveFile"
        );
        //此处获得了上传图片的路径
        console.log(newPath);
        userTable.picPath = newPath;
        //const backgroundImage = getStorageSync("backgroundImage", "");
        // if (backgroundImage != "") uni.removeStorageSync(backgroundImage);
        // await becomePromise(
        //   uni.setStorage,
        //   { key: "backgroundImage", data: newPath },
        //   "setStorage"
        // );
        // store.commit("common/setBackgroundImage", {
        //   backgroundImagePath: newPath,
        // });
        //inspireToastIsShow();
        // warningInfo.value = "背景图片上传成功";
        // toastType.value = "success";
        //close();
      } catch (e) {
        console.log(e);
        //inspireToastIsShow();
        // toastType.value = "warning";
        // if (e[1] == "chooseImage") warningInfo.value = "系统不支持选择图片";
        // else if (e[1] == "saveFile") warningInfo.value = "保存图片失败";
        // else if (e[1] == "setStorage") warningInfo.value = "保存图片路径失败";
      }
    };

    const removePicPath = () => {
      userTable.picPath = "";
    };

    return {
      ...toRefs(userTable),
      getThemeColor,
      choosePic,
      removePicPath,
      _postQianXun,
      submitMyTable,
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
      warningInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.sa-table {
  max-width: 500px;

  .sa-table-input {
    height: 60px;
  }

  .sa-table-textarea {
    height: 120px;
  }

  .sa-table-image {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .image-upload-image {
      width: 70px;
      height: 70px;
    }

    .image-show {
      width: 70px;
      height: 70px;

      image {
        max-width: 70px;
        max-height: 70px;
      }

      .image-cancel {
        width: 20px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.3);

        right: 0;
        top: 0;
      }
    }
  }
}
</style>