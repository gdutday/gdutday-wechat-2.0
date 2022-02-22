<template>
  <view style="position: relative" class="w-1 h-1 my-3">
    <view
      class="input-title px-2 transition-2"
      :style="{
        top: show ? `-20px` : '0',
        opacity: show ? 1 : 0,
        color: themeColor.curBgSecond,
      }"
    >
      {{ title }}
    </view>
    <input
      v-if="!textarea"
      class="simple-input animation-slide-right transition-1"
      :class="[isPsw ? 'password' : '', show ? '' : '', 'h-1', 'w-1']"
      :style="{
        borderBottom: show ? `3px solid ${themeColor.curBg}` : '',
      }"
      :password="pswType"
      :placeholder="placeholder"
      v-model="value"
      @input="handleinput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
     <textarea
      v-if="textarea"
      name=""
      class="simple-textarea transition-2 animation-slide-right p-2 h-1 w-1"
      :class="[textarea ? 'simple-textarea' : '']"
      :style="{
        border: show ? `3px solid ${themeColor.curBg}` : '',
      }"
      rows="10"
      v-model="value"
      :placeholder="placeholder"
      @input="handleinput"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    <view v-if="isPsw" class="psweyes h-1 flex-center" @tap="pswTypeChange"
      ><text class="iconfont icon-icon-test1" v-if="!pswIsShowed"></text
      ><text class="iconfont icon-icon-test" v-else></text>
    </view>
  </view>
</template>

<script>
import { ref, inject } from "vue";
export default {
  props: {
    placeholder: String,
    title: {
      type: String,
      default: "请输入",
    },
    modelValue: String,
    textarea: String,
    isPsw: {
      type: Boolean,
      default: false,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    let value = ref("");
    let show = ref(false); //用于判断是否focus
    let pswIsShowed = ref(false);
    let pswType = ref("");
    pswType.value = props.isPsw;
    //themeColor.value = props.themeColor;
    const pswTypeChange = () => {
      pswIsShowed.value = !pswIsShowed.value;
      pswIsShowed.value ? (pswType.value = false) : (pswType.value = true);
    };

    console.log(props.themeColor);

    const handleinput = () => {
      emit("input", value.value);
      console.log(value.value);
      console.log(props);
    };

    const handleFocus = () => {
      show.value = true;
    };

    const handleBlur = () => {
      if (value.value != "") return;
      show.value = false;
    };
    return {
      handleinput,
      handleFocus,
      handleBlur,
      pswTypeChange,
      value,
      show,
      pswIsShowed,
      pswType,
    };
  },
};
</script>


<style lang="scss" scoped>
.simple-input {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-left: 20upx;
  padding-right: 20upx;
  border-bottom: 3px solid #ccc;
}

.simple-textarea {
  position: absolute;
  border: 3px solid transparent;
  border: 3px solid #ccc;
  width: 100%;
  height: 100%;
  padding-left: 20upx;
  padding-right: 20upx;
  border-radius: 10px;
}

.psweyes {
  position: absolute;
  right: 0;
  width: 40px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 2;
}

.password {
  padding-right: 40px;
}

.input-title {
  position: absolute;
  top: -16px;
  font-size: 16px;
  z-index: 2;
}
</style>