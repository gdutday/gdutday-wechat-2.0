<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>新闻详情</div>
      </template>
    </Ztl>
    <rich-text :nodes="getNewsDetail" class="aaaa"></rich-text>
  </view>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import Ztl from "@/components/common/Ztl.vue";

export default {
  components: {
    Ztl,
  },

  setup() {
    const store = useStore();

    const getNewsDetail = computed(() => {
      return store.state.news.newsDetail;
    });

    onMounted(() => {
      console.log(getNewsDetail);
    });

    return {
      getNewsDetail,
    };
  },
};
</script>

<style>
.aaaa {
  width: 100%;
}

.aaaa >>> image {
  margin-top: 50px;
  width: 100%;
}
</style>
