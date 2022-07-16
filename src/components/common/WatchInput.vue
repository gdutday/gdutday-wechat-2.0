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
      class="simple-input animation-shake transition-1"
      :class="[
        isPsw || must ? 'password' : '',
        show ? 'animation-ripple' : '',
        'h-1',
        'w-1',
      ]"
      :style="{
        borderBottom: show ? `3px solid ${themeColor.curBg}` : '',
      }"
      :password="pswType"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
     <textarea
      v-if="textarea"
      name=""
      class="simple-textarea transition-2 animation-shake p-2 h-1 w-1"
      :class="[textarea ? 'simple-textarea' : '']"
      :style="{
        border: show ? `3px solid ${themeColor.curBg}` : '',
      }"
      rows="10"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>
    <view v-if="isPsw" class="psweyes h-1 flex-center" @tap="pswTypeChange"
      ><text class="iconfont icon-icon-test1" v-if="!pswIsShowed"></text
      ><text class="iconfont icon-icon-test" v-else></text>
    </view>
    <view v-if="must" class="psweyes h-1 flex-center" @tap="pswTypeChange"
      ><text class="text-danger">*</text>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  props: {
    placeholder: String,
    title: {
      type: String,
      default: "请输入",
    },
    value: {
      type: String,
    },
    textarea: String,
    isPsw: {
      type: Boolean,
      default: false,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
    must: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let show = ref(false); //用于判断是否focus
    let pswIsShowed = ref(false);
    let flag = ref(0);

    //*********************************************** */
    //这一部分用于设置密码的属性
    let pswType = ref("");
    pswType.value = props.isPsw;
    //themeColor.value = props.themeColor;
    const pswTypeChange = () => {
      pswIsShowed.value = !pswIsShowed.value;
      pswIsShowed.value ? (pswType.value = false) : (pswType.value = true);
    };
    //*********************************************** */
    const handleInput = (e) => {
      let newValue = e.target.value;
      emit("input", newValue);
      //vue2的v-model定义方式
      if (newValue.length > 0) {
        show.value = true;
        flag.value = 1;
      } else {
        show.value = false;
        flag.value = 0;
      }
    };
    const handleFocus = () => {
      show.value = true;
    };

    const handleBlur = () => {
      if (flag.value == 0) {
        show.value = false;
      }
    };

    onMounted(() => {
      if (props.value) {
        show.value = true;
      }
    });

    return {
      handleInput,
      handleFocus,
      handleBlur,
      pswTypeChange,
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