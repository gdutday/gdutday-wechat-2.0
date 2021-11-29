import axios from 'axios'

export function request(config){
  //config用于接收配置文件
    const instance = axios.create({
      baseURL:'',
      timeout:3000,
    })
  
    //请求拦截
     instance.interceptors.request.use(config=>{
       //如果有一个接口需要认证才能访问，就在这里统一进行设置
       // 比如token

       return config;
       //直接放行
     }, err=>{
       console.log(err);
     })
  
    // 响应拦截
  
    //  instance.interceptors.response.use(res=>{
    //    console.log(res);
    //    console.log(res);
    //    return res
    //  }, err => {
    //    if(err.response.status == '301')
    //    // 当状态码为未登陆的时候
    //    {
    //         router.push({path:'/login'})
    //    }
       
    //    //如果是需要授权才可与访问的接口同意去login授权
    //    //如果有错误这里会
   //  })
  
  
    return instance(config);
  }