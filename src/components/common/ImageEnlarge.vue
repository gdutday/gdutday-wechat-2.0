<template>
  <ming-modal @close="close" :isShow="isShow">
    <template v-slot:default>
      <image
        :src="modalPicPath"
        mode="widthFix"
        class="position-center enlarge-pic"
      />
    </template>
  </ming-modal>
</template>

<script>
import MingModal from "@/components/common/MingModal";
import { useMingModal } from "@/hooks/index.js";
export default {
  components: {
    MingModal,
  },
  props: {
    modalPicPath: {
      type: String,
    },
  },
  setup(props) {
    const { isShow, close } = useMingModal();

    return {
      isShow,
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>