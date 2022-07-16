<template>
  <ming-confirm
    :showedScheduleInfo="showedScheduleInfo"
    :themeColor="themeColor"
    content="填写代表需要编辑，不填写某一输入框表示这一输入框不需要更改。往下滑动可以查看更多的可选项~"
    @fatherMethod="submitEdit"
  >
    <template v-slot:default>
      <view class="sa-table-input my-5">
        <watch-input
          type="text"
          class=""
          title="物品名称"
          must
          v-model="name"
          placeholder="请输入物品名称"
          :themeColor="themeColor"
        />
      </view>
      <!-- <view class="sa-table-input my-5">
        <watch-input
          type="text"
          class=""
          title="我的联系方式"
          v-model="contact"
          must
          placeholder="我的联系方式（邮箱或QQ），手机也行"
          :themeColor="themeColor"
        />
      </view> -->
      <view class="sa-table-input my-5">
        <watch-input
          type="text"
          class=""
          title="物品位置"
          v-model="place"
          placeholder="请输入物品位置"
          :themeColor="themeColor"
        />
      </view>
      <view class="sa-table-textarea my-5">
        <watch-input
          textarea
          class=""
          title=" "
          v-model="description"
          placeholder="请输入物品描述"
          :themeColor="themeColor"
        />
      </view>
    </template>
  </ming-confirm>
</template>

<script>
import { toRefs, ref, reactive, watch } from "vue";
import MingConfirm from "@/components/common/MingConfirm";
import WatchInput from "@/components/common/WatchInput";
export default {
  components: {
    MingConfirm,
    WatchInput,
  },
  props: {
    curId: {
      type: String | Number,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    //let id = props.curId;
    const newForm = reactive({
      id: "",
      name: "",
      place: "",
      description: "",
    });

    const submitEdit = () => {
      emit("submitEdit", newForm);
    };

    // const _getSpecialPost = () => {
    //   return getSpecialPost(props.curId)
    //     .then((res) => {
    //       console.log(res);
    //       const detail = res.post;
    //       const { place, description, name, id } = detail;
    //       newForm.place = place;
    //       newForm.description = description;
    //       newForm.name = name;
    //       newForm.id = id;
    //       console.log(newForm);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // };

    watch(
      () => props.curId,
      () => {
        newForm.id = props.curId;
      }
    );

    return {
      ...toRefs(newForm),
      submitEdit,
    };
  },
};
</script>

<style lang="scss" scoped>
.sa-table-input {
  height: 60px;
}

.sa-table-textarea {
  height: 120px;
}
</style>