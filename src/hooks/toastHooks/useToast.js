import {ref}  from 'vue';


export default function(){
  //定义toast的类型
  const toastType = ref("warning");

  //定义toast是否展示
  const toastIsShow = ref(false);

  const warningInfo = ref('网络错误噢');

  //隐藏toast
  const resumeToastIsShow = () => {
    toastIsShow.value = false;
  };

  //展示toast
  const inspireToastIsShow = () => {
    toastIsShow.value = true;
  };

  const showToast = ({warningInfo: warningInfoParams, toastType: toastTypeParams} = {}) => {
    console.log();
    if(toastTypeParams) warningInfo.value = warningInfoParams
    if(toastTypeParams) toastType.value = toastTypeParams
    
    inspireToastIsShow();
  }

  const hideToast = () => {
    resumeToastIsShow()
  }

  return{
    toastType,
    toastIsShow,
    resumeToastIsShow,
    inspireToastIsShow,
    warningInfo,
    showToast,
    hideToast
  }
}