import {ref}  from 'vue';


export default function(){
  
  const checkIsEmpty = (myList) => {
    //传入的需要是必须是数组
    //如果有一个为空就返回false
    return !myList[0].some((item) => {
      console.log(item);
        return item == '';
    })
  }

  return{
    checkIsEmpty
  }
}