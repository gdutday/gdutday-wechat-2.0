import { ref } from "vue";
import useToast from "../toastHooks/useToast";
import useLogin from "../loginHooks/useLogin";
import {
  loginV2,
  sendVerV2,
  getTermV2,
} from "@/network/ssxRequest/request-v2/login.js";
import { getScoreV2 } from "@/network/ssxRequest/request-v2/score.js";
import { getExaminationV2 } from "@/network/ssxRequest/request-v2/examination";
import {
  getStorageSync,
  handleSchedule,
  filterSchedule,
} from "@/utils/common.js";
import { getScheduleV2 } from "@/network/ssxRequest/request-v2/schedule.js";
import * as LOGIN_ENUM from "@/modules/login/enum";
import {
  convertGradeV2,
  convertPostGraduateGradeV2,
} from "../../utils/convert/student-v2/grade";
import { handleGradeId } from "@/utils/tempHandleGrade.js";
import { useStore } from "vuex";
import { getTermId, transformTermIdWithZero } from "@/utils/termId";
import {
  scheduleStudentV2Adaptor,
  schedulePostGraduateStudentV2Adaptor,
} from "@/utils/convert/student-v2/schedule";
import useSelectorOptions from "@/components/content/schedule/ScheduleContent/ScheduleSelector/SelectorController/classoptions-hook";
import { FE_ERROR } from "@/network/enum";
import { getErrorMsgByCode } from "@/utils/reqErrorMsgUtil";
import { convertDateToSemester } from "@/utils/termId";
export default function () {
  const store = useStore();

  const {
    toastType,
    toastIsShow,
    resumeToastIsShow,
    inspireToastIsShow,
    warningInfo,
  } = useToast();

  const {
    login,
    getCurrentLoginType,
    getCurrentUserType,
    combineLoginTypeAction,
    separateLoginTypeAction,
  } = useLogin();

  const { insertScheduleWhileRefresh } = useSelectorOptions();

  const preCommonRequestHandler = (params = {}) => {
    const userType = getCurrentUserType();
    const loginType = getCurrentLoginType();
    const combineLoginType = combineLoginTypeAction(userType, loginType);

    // const termId = getTermId("20242");
    //新代码  动态生成termId
    console.log(uni.getStorageSync("selectedTermId"));

    const defaultTermId =
      uni.getStorageSync("selectedTermId") ||
      convertDateToSemester(store.state.openingData.openingData);
    console.log("termId", defaultTermId);

    let tmp = {
      ...params,
      userType,
      // 默认202402
      termId: params.termId || defaultTermId, // 优先使用传入的termId,
      loginType,
    };

    switch (combineLoginType) {
      case LOGIN_ENUM.UG_V1: {
        // 做一层处理
      }
      case LOGIN_ENUM.PG_V2:
      case LOGIN_ENUM.UG_V2: {
        tmp = {
          ...tmp,
          cookies: getStorageSync("weCookies"),
        };
        break;
      }
    }

    return tmp;
  };

  const commonRequest = (fn) => {
    // 处理一部分
    return async (params) => {
      params = params || {};
      params = preCommonRequestHandler(params);
      console.log("params", params);
      return fn(params);
    };
  };

  // 根据userLoginType决定到底采用哪个函数(在外部进行组合)
  const getSchedule = commonRequest(async (params) => {
    const combineLoginType = combineLoginTypeAction(
      getCurrentUserType(),
      getCurrentLoginType()
    );
    // 1. 做一些params加强的操作
    let res = await getScheduleV2(params);
    console.log("result", res);

    const [isError, result] = res;

    if (isError) {
      return [isError, result];
    }

    let scheduleData = result.data;

    if (!scheduleData) {
      console.log("data为空");
      return [
        false,
        {
          code: 200,
          msg: "请求无结果",
        },
      ];
    }

    switch (combineLoginType) {
      case LOGIN_ENUM.UG_V1:
      case LOGIN_ENUM.UG_V2:
      case LOGIN_ENUM.PG_V2: {
        // 做一层处理
        scheduleData = scheduleStudentV2Adaptor(scheduleData);
        break;
      }
    }

    let obj = filterSchedule(scheduleData);
    let weeksData = obj.weeksData;
    let scheduleIdColor = obj.scheduleIdColor;
    uni.setStorageSync("weeksData", weeksData);
    uni.setStorageSync("scheduleIdColor", scheduleIdColor);
    handleSchedule(
      weeksData,
      getStorageSync("currentWeek"),
      store.state.scheduleInfo.currentSwiperIndex
    );
    insertScheduleWhileRefresh();
    //此时登陆成功
    //从服务端获取的数据被拿去存储到
    uni.showToast({
      title: "获取课表成功",
      duration: 2000,
    });

    return [false, {}];
  });

  //
  const getExam = commonRequest(async (params) => {
    // 研究生无考试
    if (getCurrentUserType() === LOGIN_ENUM.USER_TYPE.postgraduate) {
      return [
        true,
        {
          code: FE_ERROR.PG_NO_EXAM,
          msg: getErrorMsgByCode(FE_ERROR.PG_NO_EXAM),
        },
      ];
    }

    const res = await getExaminationV2(params);

    const [isError, result] = res;

    if (isError) {
      return [isError, result];
    }

    const futureExam = result.data;

    if (!futureExam) {
      console.log("无data");
      return [
        false,
        {
          code: 200,
          msg: "请求无结果",
        },
      ];
    }

    uni.setStorageSync("futureExam", futureExam);
    store.commit("exam/setFutureExam", {
      futureExam: futureExam,
    });
    uni.showToast({
      title: "收获考试成功",
      duration: 2000,
    });

    return [false, {}];
  });

  const getGrade = commonRequest(async (params) => {
    const combineLoginType = combineLoginTypeAction(
      getCurrentUserType(),
      getCurrentLoginType()
    );

    const res = await getScoreV2(params);

    const [isError, result] = res;

    if (isError) {
      return [isError, result];
    }

    const { data } = result;
    // 做后置处理

    if (!data) {
      console.log("无data");
      return [
        false,
        {
          code: 200,
          msg: "请求无结果",
        },
      ];
    }

    let exam = data;

    switch (combineLoginType) {
      case LOGIN_ENUM.UG_V1:
      case LOGIN_ENUM.UG_V2: {
        exam = convertGradeV2(data);
        break;
      }
      case LOGIN_ENUM.PG_V2: {
        exam = convertPostGraduateGradeV2(data);
        console.log("进入了");
        break;
      }
      default: {
        console.log("未命中");
        return;
      }
    }

    console.log("dataWithConvert", exam);
    uni.setStorageSync("exam", exam);

    exam = handleGradeId();
    store.commit("exam/setExam", {
      exam: exam,
    });
    store.commit("exam/setCurrentExam", {
      termIndex: [0, 0, 0],
    });
    store.commit("exam/setGPAOfSix");

    uni.showToast({
      title: "获取成绩成功",
      duration: 2000,
    });

    return [
      false,
      {
        data: exam,
      },
    ];
  });

  const getVerV2 = async () => {
    const [isError, data] = await sendVerV2();

    if (isError) {
      return [isError, data];
    }

    const { jsessionId, verCode } = data.data || {};

    if (jsessionId) {
      uni.setStorageSync("jsessionId", jsessionId);
      console.log("jessionId", jsessionId);
    }

    if (verCode) {
      console.log("verCode", verCode);
    }

    return [
      false,
      {
        data: {
          jsessionId,
          verCode,
        },
      },
    ];
  };

  const getTermIdV2 = commonRequest(async (params) => {
    const res = await getTermV2(params);

    if (!res.data) {
      return [
        true,
        {
          msg: "响应无data",
        },
      ];
    }

    const { jsessionId, verCode } = res.data || {};

    if (jsessionId) {
      uni.setStorageSync("jsessionId", jsessionId);
      console.log("jessionId", jsessionId);
    }

    if (verCode) {
      console.log("verCode", verCode);
    }

    return [
      false,
      {
        data: {
          jsessionId,
          verCode,
        },
      },
    ];
  });

  const getAllData = async () => {
    let timeoutId;

    // 创建一个超时Promise
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject({
          code: "TIMEOUT",
          msg: "登录超时,请重试",
        });
      }, 15000); // 15秒超时
    });

    try {
      // 使用 Promise.race 竞争超时和实际请求
      let isErrorExist = false;
      let err = {};

      await Promise.race([
        Promise.all([getSchedule(), getExam(), getGrade()]).then((results) => {
          // 请求完成后清除定时器
          clearTimeout(timeoutId);

          results.forEach((result) => {
            const [isError, data] = result;
            if (isError) {
              const { code, msg } = data;
              if (code === FE_ERROR.PG_NO_EXAM) {
                return;
              }
              isErrorExist = true;
              err = { ...data };
              return;
            }
          });
        }),
        timeout,
      ]);

      if (isErrorExist) {
        return [true, { ...err }];
      } else {
        return [false, {}];
      }
    } catch (error) {
      // 处理超时错误
      return [true, error];
    } finally {
      // 确保在任何情况下都清除定时器
      clearTimeout(timeoutId);
    }
  };

  return {
    getExam,
    getGrade,
    getVerV2,
    getSchedule,
    getTermIdV2,
    getAllData,
  };
}
