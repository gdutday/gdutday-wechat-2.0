export const APIs = {
  //天气api
  weatherAPI:
    'https://wis.qq.com/weather/common?source=xw&weather_type=forecast_1h|forecast_24h|index|alarm|limit|tips&province=广东&city=广州',
}

export const ssxAPIs = {
  //此api用户获取课程表的信息
  scheduleGetAPI: '/stu/getAllClazzes.elc?jSessionId=', //获取课表
  getVcodeSessionAPI: '/login/sendVer.elc', //获取验证码第一次
  getVcodeSessionTwiceAPI: '/login/sendVer.elc?jSessionId=', //获取验证码第二次
  stuLoginAPI: '/login/login.elc', //登录接口
  futureExamAPI: '/stu/getStuExaminations.elc?jSessionId=',
  pastExamAPI: '/stu/getStuGrades.elc?jSessionId=',
  newsAPI: '/login/getLimitNews.elc',
  feedbackAPI: '/login/getStuAdvice.elc',
  searchNewsAPI: '/login/selectSomeNews.elc',
  libarayQRCodeAPI: '/stu/getLibQrByStuId.elc',

  //研究生api
  scheduleGetAPIGraduate:'/test',// 通过账号密码获得课表
  loginGraduate:'/gdutLogin', // 登录接口
  scheduleGetAPIGraduateByCookies:'/getCk', // 使用login登录的cookies获取课表
  getScoreGraduate:'/score', // 获得考试成绩
  checkCookies:'/live',// 检查cookies是否有效
  getUserInfo:'/getUserInfo', // 获取用户信息+校区
  checkCaptcha:'/checkCaptcha', // 检查是否需要滑块
  
  //下方是千与千寻api
  qianxunPostAPI: '/qianxun/addPost',
  qianxunPostPageLimitAPI: '/qianxun/getPosts',
  qianxunGetMyPostAPI: '/qianxun/getMyPosts?studentId=',
  qianxunGetOneTextAPI: '/qianxun/getPost',
  qianxunGetPageLimitAPI: '/qianxun/searchPosts',
  qianxunGetHidePostAPI: '/qianxun/hideMyPost?postId=', //隐藏帖子
  qianxunGetDisplayPostAPI: '/qianxun/displayMyPost?postId=', //隐藏帖子
  qianxunPostEditAPI: '/qianxun/updatePost',
}

export const wxAPIs = {
  getAccessTokenAPI: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
  justifyContentIsLegal: 'https://api.weixin.qq.com/wxa/msg_sec_check?',
}
