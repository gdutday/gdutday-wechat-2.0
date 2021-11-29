export const APIs = {
  //天气api
  weatherAPI:'https://wis.qq.com/weather/common?source=xw&weather_type=forecast_1h|forecast_24h|index|alarm|limit|tips&province=广东&city=广州'
}

export const ssxAPIs = {
  //此api用户获取课程表的信息
  scheduleGetAPI:'/stu/getAllClazzes.elc?jSessionId=',//获取课表
  getVcodeSessionAPI:'/login/sendVer.elc',//获取验证码第一次
  getVcodeSessionTwiceAPI:'/login/sendVer.elc?jSessionId=',//获取验证码第二次
  stuLoginAPI:'/login/login.elc',//登录接口
  futureExamAPI:'/stu/getStuExaminations.elc?jSessionId=',
}