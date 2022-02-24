import axios from 'axios'

export function requestSsx(config){
  //config用于接收配置文件
    const instanceSsx = axios.create({
      baseURL:'https://gdutday.gdutelc.com/gdutDay2',
      timeout:5000,
    })
  
    //请求拦截
    instanceSsx.interceptors.request.use(config=>{
       //如果有一个接口需要认证才能访问，就在这里统一进行设置
       // 比如token

       return config;
       //直接放行
     }, err=>{
       console.log(err);
     })
  
    // 响应拦截
  
    instanceSsx.interceptors.response.use(res=>{
      console.log(res);
      console.log('responsetrue');
      //这个用于判断网络是否错误
      if(!res.status){
        uni.showToast({
          title: '网络错误哟~',
          duration: 2000,
          icon: "error",
        });
        throw new Error('网络错误哟~');
      } 

      //以下用于获取后台返回的信息
      let info = res.data.msg ? res.data.msg : '';

      //非4000时的数值
      if(res.data.code != 4000){
        switch(res.data.code){
          case 4001:
            uni.showToast({
              title: "请先前往登录熬",
              duration: 2000,
              icon: "error",
            });
            break;
          case 4002:
            // uni.showToast({
            //   title: info,
            //   duration: 2000,
            //   icon: "error",
            // });
            break;
          case 4003:
            // uni.showToast({
            //   title: info,
            //   duration: 2000,
            //   icon: "error",
            // });
            break;
          case 4004:{
            uni.showToast({
              title: '后台正在维护中',
              duration: 2000,
              icon: "error",
            });
            break;
          }
          default:{
            info = '网络错误'
            uni.showToast({
              title: info,
              duration: 2000,
              icon: "error",
            });
            break;
          }
        }
        throw new Error(info);
      }
      
      return res.data?res.data:res;
    }, err => {
      console.log('responseerror');
      uni.showToast({
        title: '网络错误哟~',
        duration: 2000,
        icon: "error",
      });
      throw new Error('网络错误哟~');
      // if(err.response.data.code == '4001')
      // // 当状态码为未登陆的时候
      // {
      //      uni.navigateTo({
      //         url: 'pages/profile/Login'
      //      });
      // }
      //如果是需要授权才可与访问的接口同意去login授权
      //如果有错误这里会
    })
  
  
    return instanceSsx(config);
  }