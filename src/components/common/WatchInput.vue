<template>
  <view style="position: relative" class="w-1 h-1">
    <input
      v-if="!textarea"
      class="simple-input transition-2 animation-slide-right"
      :class="[
        show ? 'simple-input--focus ' : '',
        line ? 'simple-input--line' : '',
        'h-1',
        'w-1',
      ]"
      type="text"
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
  </view>
</template>

<script>
import { defineProps, defineEmits, ref } from "vue";
export default {
  props: {
    placeholder: String,
    modelValue: String,
    textarea: String,
  },
  setup(props, { emit }) {
    let value = ref("");
    let line = ref(false); //用于判断是否focus，然后控制下划线
    let show = ref(false); //用于判断是否focus
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
</style>