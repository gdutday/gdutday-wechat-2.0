// skills/schedule/index.js
const { queryTodaySchedule } = require('./apis/queryTodaySchedule')

const skill = wx.modelContext.createSkill('skills/schedule')

// 中间件：统一登录取session
skill.use(async (ctx, next) => {
  console.info('[ai-mode] middleware: schedule skill entry, name=' + ctx.name)
  await next()
})

skill.registerAPI('queryTodaySchedule', queryTodaySchedule)
