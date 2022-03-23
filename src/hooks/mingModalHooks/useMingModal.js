import { useStore } from 'vuex';
import { computed } from 'vue';

export default function(){
  const store = useStore();

  //打开modal
  const openModal = () => {
    store.commit("scheduleInfo/setIsShow", { isShow: true });
  }

  const close = (initCloseType = false) => {
    store.commit("scheduleInfo/setIsShow", { isShow: false });
    
    //如果我们让遮罩层显示了不是默认的东西，我们就需要将他归为默认
    //默认的ModalType为空
    if(initCloseType){
      store.commit("scheduleInfo/setModalType", { modalType: "" });
    }
  };

  //将内容改为其他内容
  const changeCloseType = (modalType) => {
    store.commit("scheduleInfo/setModalType", { modalType });
  }

  //获取当前遮罩层种类
  const getModalType = computed(()=> store.state.scheduleInfo.modalType)

  //获取当前遮罩层状态
  const isShow = computed(() =>  store.state.scheduleInfo.isShow);

  return {
    isShow,
    close,
    openModal,
    changeCloseType,
    getModalType
  }
}