export function getTermDate(openningDate) {
  let monthName = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  let myDate = new Date(openningDate)
  let openningDateInfo = {
    openningDateYear: myDate.getFullYear(),
    openningDateMonth: myDate.getMonth() + 1,
    openningDateDay: myDate.getDate(),
  }
  //一个学期的长度
  let oneTermLength = 140
  // 第一个参数是月份的名字,第二个参数是每个月的天数(要判断是平年还是闰年)
  let arr = []
  //临时数组变量
  let sum = 0
  //用于计算全长
  let monthDateInfo = getMonthInfo(monthName, getYearType(openningDateInfo.openningDateYear))
  monthDateInfo = monthDateInfo.filter((item, index) => {
    return index + 1 >= openningDateInfo.openningDateMonth
  })
  //第一个参数是一年的所有信息
  setMonthCorrect(monthDateInfo, openningDateInfo.openningDateDay)
  //获得目前的年份数量，用于判断是上学期还是下学期
  let oneYearSumDay = getSum(monthDateInfo)
  if (oneYearSumDay <= oneTermLength) {
    sum = oneYearSumDay
    //这种情况下，属于是年底了，要递补到第二年，一般用于上学期
    let monthDateInfoNext = getMonthInfo(monthName, getYearType(++openningDateInfo.openningDateYear))
    for (let i = 0; i < monthDateInfoNext.length; i++) {
      sum += monthDateInfoNext[i].daysCount
      monthDateInfo.push(monthDateInfoNext[i])
      if (sum >= oneTermLength) {
        break
      }
    }
    setMonthCorrect(monthDateInfo, openningDateInfo.openningDateDay)
  } else {
    //这属于上半年，日期超过了一学期应该有的

    for (let i = 0; i < monthDateInfo.length; i++) {
      sum += monthDateInfo[i].daysCount.length
      arr.push(monthDateInfo[i])
      if (sum >= oneTermLength) {
        break
      }
    }
    monthDateInfo = arr
  }
  //对最后一个月份进行处理
  monthDateInfo[monthDateInfo.length - 1].daysCount = filterLastMonth(
    oneTermLength,
    sum,
    monthDateInfo[monthDateInfo.length - 1].daysCount
  )
  sum = getSum(monthDateInfo)
  monthDateInfo = cutArray(monthDateInfo)

  return monthDateInfo
}

export const getYearType = year => {
  let month_olympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    return month_olympic
  } else {
    return month_normal
  }
}

export const getMonthInfo = (arr1, arr2) => {
  var objArr = []
  for (var i = 0; i < arr1.length; i++) {
    var obj = {}
    obj.month = arr1[i]
    obj.daysCount = arr2[i]
    objArr.push(obj)
  }
  return objArr
}

export const setMonthCorrect = (arr, openningDate) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].daysCount instanceof Array) {
      ;('')
    } else {
      let firstWeeKLen = arr[i].daysCount
      arr[i].daysCount = []
      if (i) {
        //当i不为首元素时的情况
        while (firstWeeKLen) {
          arr[i].daysCount.unshift(firstWeeKLen--)
        }
      } else {
        //当为第一个元素的情况
        while (openningDate <= firstWeeKLen) {
          arr[i].daysCount.unshift(firstWeeKLen--)
        }
      }
    }
  }
}

export const getSum = arr => {
  return arr.reduce((total, item) => {
    return total + item.daysCount.length
  }, 0)
}

//用于对最后一个数组进行调整，使其为一个学期应该有的情况
export const filterLastMonth = (should, sum, arr) => {
  let diff = sum - should
  arr = arr.slice(0, arr.length - diff)
  //这里用于切割数组,使其完成适配
  return arr
}

//第2个参数是每一个数组的元素个数
export const getCuttingArray = (arr, onPieceNum) => {
  let diff = sum - should
  arr = arr.slice(0, arr.length - diff)
  //这里用于切割数组,使其完成适配
  return arr
}

export const cutArray = arr => {
  let newArr = []
  let index = 0
  let daysCountIndex = 0
  for (let i = 0; i < 20; i++) {
    let newObj = {
      month: '',
      daysCount: [],
    }
    newObj.month = arr[index].month
    for (let j = 0; j < 7; j++) {
      newObj.daysCount.push(arr[index].daysCount[daysCountIndex])
      daysCountIndex++
      if (daysCountIndex == arr[index].daysCount.length) {
        index++
        daysCountIndex = 0
      }
    }
    newArr.push(newObj)
  }
  return newArr
}
