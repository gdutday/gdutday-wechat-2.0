import { getStorageSync, uuidV4 } from './common'
export function handleGradeId() {
  const examObj = getStorageSync('exam')
  console.log(examObj)
  for (const [term, examList] of Object.entries(examObj)) {
    examList.forEach(exam => {
      exam['id'] = uuidV4()
    })
  }

  console.log(examObj)
  uni.setStorageSync('exam', examObj)

  return examObj
}
