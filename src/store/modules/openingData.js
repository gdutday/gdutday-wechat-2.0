import { getStorageSync } from "@/utils/common"; // 引入 getStorageSync
import { getStartTime } from "@/network/ssxRequest/request-v2/getStartTime"; // 引入 getStartTime

export default {
  namespaced: true,
  state: () => ({
    openingData: getStorageSync(
      "schoolOpening",
      getStorageSync("platform") == "ios" ? "2025/1/1" : "2025.1.1"
    ),
  }),
  mutations: {
    // 新增的 mutation
    setOpeningData(state, payload) {
      state.openingData = payload.openingData;
    },
  },
  actions: {
    // 新增的 action，用于异步更新 openingData
    async fetchOpeningData({ commit }) {
      try {
        const res = await getStartTime(); // 调用接口获取开学日期
        const [isError, result] = res;

        if (isError) {
          console.error("获取开学日期失败:", result);
          return; // 如果出错，直接返回
        }

        const platform = getStorageSync("platform"); // 获取平台信息
        const openingData =
          platform === "ios" ? result.data.replace(/\./g, "/") : result.data; // 格式化日期

        commit("setOpeningData", { openingData }); // 调用 mutation 更新状态
        uni.setStorageSync("schoolOpening", openingData);
      } catch (error) {
        console.error("开学日期初始化异常:", error);
      }
    },
  },
  getters: {
    // 新增的 getter，用于获取 openingData
    openingData: (state) => state.openingData,
  },
};
