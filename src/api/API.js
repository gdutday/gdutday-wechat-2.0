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
  pastExamAPI:'/stu/getStuGrades.elc?jSessionId=',
  newsAPI:'/login/getLimitNews.elc',
  feedbackAPI:'/login/getStuAdvice.elc',
  searchNewsAPI:'/login/selectSomeNews.elc',
  
  //下方是千与千寻api
  qianxunPostAPI:'/qianxun/addPost',
  qianxunPostPageLimitAPI:'/qianxun/getPosts',
  qianxunGetMyPostAPI:'/qianxun/getMyPosts?studentId=',
  qianxunGetOneTextAPI:'/qianxun/getPost',
  qianxunGetPageLimitAPI:'/qianxun/searchPosts',
  qianxunGetHidePostAPI:'/qianxun/hideMyPost?postId=',//隐藏帖子
}

export const wxAPIs = {
  getAccessTokenAPI:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
  justifyContentIsLegal:'https://api.weixin.qq.com/wxa/msg_sec_check?'
}