import {useStore} from 'vuex';
import { ref, computed} from 'vue'
export default function (){
  const allWeeks = store.state.scheduleInfo.allWeeks;


  //把每周变成合理的date
  const getWeeksInfo = () => {
    let result = []
    let tempObj = {
      month: 0,
      daysCount: []
    };
    let slow = 0;
    let fast = 0

    for (fast; fast < dataInfo.length; fast++) {
      let slowMonth = dataInfo[slow].month;
      let fastMonth = dataInfo[fast].month;
      if (slowMonth != fastMonth) {
        //如果里面的月份不一样，那么清空原有的数组，然后把slow变成fast
        //然后完成数据的初始化
        let beforeWeek = tempObj.daysCount[tempObj.daysCount.length - 1]
        let beforeWeekMon = beforeWeek[0];
        let beforeWeekSun = beforeWeek[6];

        result.push(tempObj);

        //实现初始化
        tempObj = {
          month: 0,
          daysCount: []
        };

        if (beforeWeekSun < beforeWeekMon) {
          tempObj.daysCount.push(beforeWeek)
        }
        slow = fast;
      }

      tempObj.month = slowMonth
      tempObj.daysCount.push(dataInfo[fast].daysCount)
    }
    
    return result;
  }
  

  return {
    getWeeksInfo,
    allWeeks
  }
}