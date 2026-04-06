import re

with open('src/utils/courseRemark.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getCourseRemarkMap
new_get_map = """
const getRemarkFilePath = () => `${wx.env.USER_DATA_PATH}/${COURSE_REMARK_STORAGE_KEY.replace(':', '_')}.json`

const saveRemarkMapToFile = (remarkMap) => {
  if (typeof wx === 'undefined') {
    uni.setStorageSync(COURSE_REMARK_STORAGE_KEY, JSON.stringify(remarkMap))
    return
  }
  try {
    const fs = wx.getFileSystemManager()
    fs.writeFileSync(getRemarkFilePath(), JSON.stringify(remarkMap), 'utf8')
  } catch (e) {
    console.error('Save to file system failed', e)
  }
}

export const getCourseRemarkMap = () => {
  if (typeof wx === 'undefined') {
    return getStorageSync(COURSE_REMARK_STORAGE_KEY, {}, true)
  }
  
  try {
    const fs = wx.getFileSystemManager()
    const filePath = getRemarkFilePath()
    fs.accessSync(filePath)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent) || {}
  } catch (e) {
    // 降级：如果文件不存在，可能是老版本数据，尝试从 storage 读取并迁移
    const oldData = uni.getStorageSync(COURSE_REMARK_STORAGE_KEY)
    let parsedData = {}
    if (oldData) {
      try {
        parsedData = typeof oldData === 'string' ? JSON.parse(oldData) : oldData
        // 立即迁移到文件系统
        if (Object.keys(parsedData).length > 0) {
          saveRemarkMapToFile(parsedData)
        }
      } catch (err) {
        parsedData = {}
      }
    }
    return parsedData
  }
}
"""
content = re.sub(r'export const getCourseRemarkMap = \(\) => getStorageSync\(COURSE_REMARK_STORAGE_KEY, \{\}, true\)', new_get_map.strip(), content)

# Replace save calls in saveRemarkCourseDetail
content = content.replace('uni.setStorageSync(COURSE_REMARK_STORAGE_KEY, JSON.stringify(remarkMap))', 'saveRemarkMapToFile(remarkMap)')

# Append import/export functions
append_code = """

export const exportRemarkData = () => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))
    
    const filePath = getRemarkFilePath()
    try {
      const fs = wx.getFileSystemManager()
      fs.accessSync(filePath)
    } catch (e) {
      // 如果文件不存在，强制生成一次
      saveRemarkMapToFile(getCourseRemarkMap())
    }

    wx.shareFileMessage({
      filePath: filePath,
      fileName: 'gdutday_remarks_backup.json',
      success: resolve,
      fail: reject
    })
  })
}

export const importRemarkData = () => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['.json'],
      success(res) {
        const tempFilePath = res.tempFiles[0].path
        try {
          const fs = wx.getFileSystemManager()
          const fileContent = fs.readFileSync(tempFilePath, 'utf8')
          const importedData = JSON.parse(fileContent)

          if (!importedData || typeof importedData !== 'object' || Array.isArray(importedData)) {
            throw new Error('JSON 格式不正确')
          }

          // 合并数据（以导入的数据为主）
          const currentData = getCourseRemarkMap()
          const mergedData = { ...currentData, ...importedData }
          saveRemarkMapToFile(mergedData)
          
          uni.showToast({ title: '导入成功', icon: 'success' })
          resolve(mergedData)
        } catch (e) {
          uni.showToast({ title: '数据格式错误', icon: 'none' })
          reject(e)
        }
      },
      fail: reject
    })
  })
}
"""
content += append_code

with open('src/utils/courseRemark.js', 'w', encoding='utf-8') as f:
    f.write(content)
