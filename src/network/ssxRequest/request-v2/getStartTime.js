//新增接口由于获取开学时间
import { requestSsxV3 } from "@/network/ssxRequest/request.js";

export const getStartTime = () => {
  return requestSsxV3({
    url: "/admissionDate",
    method: "GET",
    // 接口使用json
    headers: {
      "Content-Type": "application/json",
    },
  });
};
