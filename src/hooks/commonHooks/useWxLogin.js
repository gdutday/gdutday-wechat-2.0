import { getAccessToken } from '@/network/commonRequest/wxRequest/checkIsLegal'
import { ref } from 'vue';
import { getStorageSync } from '@/utils/common.js'
export default function(){
  let access_token = ref(getStorageSync('access_token'));

  const getAccessTokenRequest = () => {
    getAccessToken().then((res) => {
      console.log(res);
      let { access_token } = res.data;
      uni.setStorageSync('access_token' ,access_token);
    }).catch((err) => {
      console.log(err);
    });
  } 
  return {
    access_token,
    getAccessTokenRequest
  }
}
 