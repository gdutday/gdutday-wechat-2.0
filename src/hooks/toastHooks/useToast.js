import {ref}  from 'vue';


export default function(){
  //定义toast的类型
  const toastType = ref("");

  //定义toast是否展示
  const toastIsShow = ref(false);

  const warningInfo = ref('');

  //隐藏toast
  const resumeToastIsShow = () => {
    toastIsShow.value = false;
  };

  //展示toast
  const inspireToastIsShow = () => {
    toastIsShow.value = true;
  };

  return{
    toastType,
    toastIsShow,
    resumeToastIsShow,
    inspireToastIsShow,
    warningInfo
  }
}