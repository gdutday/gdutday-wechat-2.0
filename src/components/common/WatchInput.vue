<template>
  <view style="position: relative" class="w-1 h-1">
    <input
      v-if="!textarea"
      class="simple-input transition-2 animation-slide-right"
      :class="[
        isPsw ? 'password' : '',
        show ? 'simple-input--focus ' : '',
        line ? 'simple-input--line' : '',
        'h-1',
        'w-1',
      ]"
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
      id=""
      class="simple-input transition-2 animation-slide-right p-2"
      :class="[
        textarea ? 'simple-textarea' : '',
        show ? 'simple-input--focus simple-textarea--focus' : '',
      ]"
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
import { ref } from "vue";
export default {
  props: {
    placeholder: String,
    modelValue: String,
    textarea: String,
    isPsw: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let value = ref("");
    let line = ref(false); //用于判断是否focus，然后控制下划线
    let show = ref(false); //用于判断是否focus
    let pswIsShowed = ref(false);
    let pswType = ref("");
    pswType.value = props.isPsw;

    const pswTypeChange = () => {
      pswIsShowed.value = !pswIsShowed.value;
      pswIsShowed.value ? (pswType.value = false) : (pswType.value = true);
    };

    const handleinput = () => {
      emit("input", value.value);
      console.log(value.value);
      console.log(props);
    };

    const handleFocus = () => {
      console.log(value.value);
      line.value = true;
      show.value = true;
    };

    const handleBlur = () => {
      line.value = false;
      show.value = false;
    };
    return {
      handleinput,
      handleFocus,
      handleBlur,
      value,
      line,
      show,
      pswIsShowed,
      pswType,
      pswTypeChange,
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

.simple-input--focus {
  border-bottom: 3px solid #17a2b8;
}

.simple-textarea {
  border: 3px solid transparent;
  border-bottom: 3px solid #ccc;
}

.simple-textarea--focus {
  border: 3px solid #17a2b8;
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
</style>