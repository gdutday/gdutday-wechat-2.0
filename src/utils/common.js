import store from '@/store/index.js'
import {color, classColor} from "@/static/color/color.js";
import { openningDate } from '@/static/time.js'
import { toNumber } from '@vue/shared';
import {ref} from 'vue'
import CryptoJS from "@/utils/crypto-js";//加密算法


//通用函数,异步设置缓存,没有就设置缓存值
export function getStorage(key, success = () => {}, fail = () => {}, def) {
	if (typeof key !== "string") throw new Error("请输入字符");
	uni.getStorage({
		key: key,
		success: success,
		fail: () => {
			if (typeof def !== "undefined") {
				uni.setStorage({
					key: key,
					data: def
				});
			}
			fail();
		}
	});
}

//!!通用函数 同步获取缓存,如果没有设置默认值并返回缓存值
export function getStorageSync(key, def, toJSONparse = false) {
	//uni.getStorageSync(key)无时不报错 拿到空白字符串;
	key = key + "";
	const storageKeys = uni.getStorageInfoSync().keys;
	let result = storageKeys.some(item => item == key) ?
		uni.getStorageSync(key) :
		(() => {
			if (def === undefined) return "";
			if (typeof def == "object") def = JSON.stringify(def);
			uni.setStorageSync(key, def);
			return def;
		})();
	try {
		result =
			toJSONparse && typeof result == "string" ? JSON.parse(result) : result;
	} catch (e) {}
	return result;
}


//开学日期
// let termStart = getStorageSync('schoolOpening', "2020.9.7");
//输入距离开学日期的天数,输出日期
export function getDate(intervalDay) {
	let termStart = getStorageSync('schoolOpening', openningDate());
	const start = termStart.split("."),
		inputTime = new Date(
			intervalDay * 86400000 +
			new Date(start[0], start[1] - 1, +start[2]).getTime()
		);
	return inputTime.getMonth() + 1 + "." + inputTime.getDate();
}

//获取现在的周数(相对于开学日期)
export function getWeek() {
	let termStart = getStorageSync('schoolOpening', openningDate());
	const start = termStart.split("."),
		diff =
		new Date().getTime() -
		new Date(start[0], start[1] - 1, +start[2]).getTime();
	//从第0开始
	const week = Math.floor(diff / 604800000);
	return week;
}


// Ios时获得当前是第几周
export function getWeekIos(){
  let termStart = getStorageSync('schoolOpening', openningDate());
	const start = termStart.split("/"),
		diff =
		new Date().getTime() -
		new Date(start[0], start[1] - 1, +start[2]).getTime();
	//从第0开始
	const week = Math.floor(diff / 604800000);
	return week;
}

//得到当前的week
export function getCurrentWeek() {
  let week = {}
  if(uni.getSystemInfoSync().platform == 'ios'){
    week = getWeekIos();
  }else{
    week = getWeek();
  }

	if (week < 0) return 0;
	else if (week > 19) return 19;
	else return week;
}

//记录每周刷新课表次数
export function countTimes() {
	const week = getCurrentWeek();
	uni.getStorage({
		key: "countTimes",
		success: res => {
			let count = JSON.parse(res.data);
			//从0开始
			count[week]++;
			uni.setStorageSync("countTimes", JSON.stringify(count));
		}
	});
}



export function clearCountTimes() {
	uni.setStorageSync('countTimes', JSON.stringify(Array.from({
		length: 20
	}, () => 0), ))
}


//节流函数
  //防抖---用于登录按钮等,input
export  function debounce (fn, delay) {
    let timer
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn()
      }, delay)
    }
  }

  //节流---用于输入按钮等
export function throttle (fn, delay) {
  let isThtottle = ref(true)
  return () => {
    if (!isThtottle.value) return
    isThtottle.value = false
    setTimeout(() => {
      fn()
      isThtottle.value = true
    }, delay)
  }
}

//计算 形如11:20与11:00 字符串的分钟差(单位/min)
export function computedTimeString(front, back, character = "-") {
	front = front.split(":");
	front = front[0] * 60 + 1 * front[1];
	back = back.split(":");
	back = back[0] * 60 + 1 * back[1];
	switch (character) {
		case "-":
			return front - back;
			break;
		case "+":
			return front + back;
			break;
	}
}


//去除rgba的透明度
export function removeOpacity(str) {
	str = str.split(",");
	str = str[0] + "," + str[1] + "," + str[2] + ")";
	return str;
}

// 深拷贝
export function deepCopy(obj) {
	if (typeof obj == "object") {
		let result = obj.constructor == Array ? [] : {};
		Object.keys(obj).forEach(item => (result[item] = deepCopy(obj[item])));
		return result;
	} else return obj;
}

//rgba转换为十六进制颜色
export function hexify(color) {
	var values = color
		.replace(/rgba?\(/, "")
		.replace(/\)/, "")
		.replace(/[\s+]/g, "")
		.split(",");
	var a = parseFloat(values[3] || 1),
		r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
		g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
		b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
	return (
		"#" +
		("0" + r.toString(16)).slice(-2) +
		("0" + g.toString(16)).slice(-2) +
		("0" + b.toString(16)).slice(-2)
	);
}

//用来设置默认皮肤
export function setDefaultTheme (val) {
  let curThemeType = val;
  if (!!uni.getStorageSync("curThemeType")) {
  curThemeType = uni.getStorageSync("curThemeType");
  }
  store.commit('setCurThemeType',curThemeType);
}


//改变rpx到px
export const changeRpxToPx = (rpx) => {
  let px = rpx / 750 * uni.getSystemInfoSync().windowWidth;
  return px
}

export const filterSchedule = (scheduleInfo) => {
  // 以下是正常方法
  // let weeksData = scheduleInfo.filter((item, index) => {
  //   return index < 20;
  // });
  // let arr1 = [];
  // let arr2 = [];
  // for (let i = 0; i < weeksData.length; i++) {
  //   let arr = [[], [], [], [], [], [], []];
  //   for (let j = 0; j < weeksData[i].length; j++) {
  //     let classInfo = weeksData[i][j];
  //     arr[--classInfo.weekdays].push(classInfo);
  //   }
  //   arr1.push(arr);
  // }
  // weeksData = arr1;
  // // weeksData.forEach((element, index) => {
  // //   element.push(index + 1);
  // // });
  // for (let i = 0; i < weeksData.length; i++) {
  //   for (let j = 0; j < weeksData[i].length; j++) {
  //     for (let k = 0; k < weeksData[i][j].length; k++) {
  //       weeksData[i][j][k].clazzSection =
  //         weeksData[i][j][k].clazzSection.split(",");
  //         arr2.push(weeksData[i][j][k].id);
  //     }
  //   }
  // }
  // let x = Array.from(new Set(arr2));

  //********************************************************* */
  // let arr1 =[];
  // let arr2 = [];
  // let weeksData = scheduleInfo;
  // for(let i=1; i<21;i++){
  //   let arr = [[], [], [], [], [], [], []];
 
      
  //     for (let j = 0; j < weeksData[i].length; j++) {
  //       let classInfo = weeksData[i][j];
  //       arr[--classInfo.weekdays].push(classInfo);
  //     }
  //     arr1.push(arr);
    
  // }
  // console.log(arr1);
  // weeksData = arr1;
  // console.log(weeksData);
  // for (let i = 0; i < weeksData.length; i++) {
  //   for (let j = 0; j < weeksData[i].length; j++) {
  //     for (let k = 0; k < weeksData[i][j].length; k++) {
  //       weeksData[i][j][k].clazzSection =
  //         weeksData[i][j][k].clazzSection.split(",");
  //         arr2.push(weeksData[i][j][k].id);
  //     }
  //   }
  // }
  // let scheduleIdColor = Array.from(new Set(arr2));//这个X即是classesId数组
  // scheduleIdColor = commitScheduleColor(scheduleIdColor);

  //*** 以上部分是为改名的js*/
  let arr1 =[];
  let arr2 = [];
  let weeksData = scheduleInfo;
  for(let i=1; i<21;i++){
    let arr = [[], [], [], [], [], [], []];
      for (let j = 0; j < weeksData[i].length; j++) {
        let classInfo = weeksData[i][j];
        arr[--classInfo.wd].push(classInfo);
      }
      arr1.push(arr);
    
  }
  weeksData = arr1;
  for (let i = 0; i < weeksData.length; i++) {
    for (let j = 0; j < weeksData[i].length; j++) {
      for (let k = 0; k < weeksData[i][j].length; k++) {
        weeksData[i][j][k].cs =
          weeksData[i][j][k].cs.split(",");
          arr2.push(weeksData[i][j][k].id);
      }
    }
    weeksData[i].push(i);
  }
  let scheduleIdColor = getAllValuesSet(arr2)//这个X即是classesId数组
  scheduleIdColor = commitScheduleColor(scheduleIdColor);
  //**** */
  return {
    weeksData,scheduleIdColor
  };
}

//处理课程表（提交部分）
export function handleSchedule(weeksData,currentWeek,currentIndex){
  let swiperList = [0,0,0];
  swiperList[currentIndex] =
        weeksData[currentWeek];
      swiperList[(currentIndex + 1) % 3] =
        weeksData[(currentWeek + 1) % 20];
      swiperList[(currentIndex + 2) % 3] =
        weeksData[(20 + ((currentWeek - 1) % 20)) % 20];

      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList,
      });

  store.commit("scheduleInfo/setSchedule", { schedule: weeksData });
  store.commit("scheduleInfo/setPickWeekSchedule", {
    pickWeekSchedule: swiperList,
  });
}

//设置主题颜色
export function setThemeColor(colorName, colorInfo){
  let nowTheme = getStorageSync('currentThemeName');
  if(!nowTheme){
    //如果本地中没有储存主题，则使用默认主题
    store.commit('theme/setCurrentThemeName',{currentThemeName: colorName});
    store.commit('theme/setCurrentThemeInfo',{
      curBg:colorInfo.bgColor,
      curTextC:colorInfo.textColor,
      curBgSecond:colorInfo.bgSecond,
      curWarnColor:colorInfo.warnColor,
  })

  }else{
    //如果本地中有主题，则使用本地中保存的主题
    store.commit('theme/setCurrentThemeName',{currentThemeName: nowTheme});
    store.commit('theme/setCurrentThemeInfo',{
      curBg:color[nowTheme].bgColor,
      curTextC:color[nowTheme].textColor,
      curBgSecond:color[nowTheme].bgSecond,
      curWarnColor:color[nowTheme].warnColor,
  })
  }
}

// 分配课程表里课程的颜色
export const commitScheduleColor = (classesId) => {
  let classesColor = classColor;
  //在此处通过过滤，让颜色和课程的个数一样
  classesColor = classesColor.filter((item, index) => {
    return index < classesId.length
  })

  let obj = classesColor.map((item, index) => {
    return {
      color: item,
      class: classesId[index],
    };
  });

  return obj;
}

// 得到颜色
export const getColor = (id) => {
  let color = "";
  let scheduleIdColor = getStorageSync("scheduleIdColor");
  
  for (let i = 0; i < scheduleIdColor.length; i++) {
    if (scheduleIdColor[i].class == id) {
      color = scheduleIdColor[i].color;
      break;
    }
  }
  return color;
};

//通过这个方法，我们可以获取一个数组中某个key值中不重复的value
// 实现数组去重功能
export const getAllValuesSet = (arr) => {
  return Array.from(new Set(arr));
}


//通过递归的方法，获得对象或数组中某个key的所有值
export function searchValueByKey(object, key, removeDuplicate=true, value) {

  function search(object, key, newArr, value) {
    //object是传入的数组或者对象 key是我们需要查找的键
    if (object instanceof Array) {
      for (let i = 0; i < object.length; i++) {
        search(object[i], key, newArr, value);
      }
    } else if (object instanceof Object) {
      if (object[key]) {
        if (value) {
          if (value == object[key]) {
            newArr.push(object[key]);
          }
        } else {
          newArr.push(object[key]);
        }
        return;
      } else {
        for (i in object) {
          search(object[i], key, newArr, value);
        }
      }
    } else {
      return;
    }
  }


  let newArr = [];
  search(object, key, newArr, value);
  if (removeDuplicate) {
    newArr = Array.from(new Set(newArr))
  }
  return newArr;
}


//计算绩点的占比（大学四年）
export const caculateGPA = (arr,key) => {
  let GPA = [
    {
      name: "乱杀(4-5)",
      value: 0,
    },
    {
      name: "海星(3-4)",
      value: 0,
    },
    {
      name: "麻麻(2-3)",
      value: 0,
    },
    {
      name: "小拉(1-2)",
      value: 0,
    },
    {
      name: "拉(0-1)",
      value: 0,
    },
  ];
  for(let i=0;i<arr.length;i++){
    let value = arr[i][key];
    if(value<=5 && value>=4){
      GPA[0].value++;
    }else if(value<4 && value>=3){
      GPA[1].value++;
    }else if(value<3 && value>=2){
      GPA[2].value++;
    }else if(value<3 && value>=2){
      GPA[3].value++;
    }else if(value<3 && value>=2){
      GPA[4].value++;
    }
  }

  return GPA;
}


// 计算平均绩点
export const average = (obj,key) => {
  function getKey(item) {
    return item[key];
  }
  function addScores(sum, cur) {
    return sum + toNumber(cur);
 }
 
 let oneScore = obj.map(getKey);
 let scoresTotal = oneScore.reduce(addScores,0);
 let averageValue = scoresTotal/oneScore.length;
 console.log(averageValue);
 return averageValue.toFixed(3);
}


// 计算平均绩点
export const averageGPA = (obj) => {
  function getGp(item) {
    return item.gp;
  }
  function getCredit(item){
    return item.credit
  }
  function addScores(sum, cur) {
    return sum + toNumber(cur);
  }
 
  let oneGp = obj.map(getGp);
  let oneCredit = obj.map(getCredit);
  let newArr = oneCredit.map((item,index) => {
    return toNumber(item)*toNumber(oneGp[index])
  })
  let totalCredit = oneCredit.reduce(addScores,0);
  let totalScore = newArr.reduce(addScores,0);
  let averageValue = totalScore/totalCredit;
  return averageValue.toFixed(3);
}


export const search = (beFiltered, key, searchInfo) => {
  console.log(beFiltered,key,searchInfo);
  //搜索算法：第一个参数是传入的数组（数组里包含对象）,第二个参数是键，第三个参数是我要搜索的值
  //此处返回的是包含搜索条件的数组
  return beFiltered.filter((product) => {
    let searchField = {};
    searchField[key] = product[key];
    // console.log(searchField);

    return Object.keys(searchField).some((key) => {
      // console.log(Object.keys(searchField));
      // console.log("key值", key);
      // console.log(
      //   "indexof(searchInfo)",
      //   String(product[key]).toLowerCase().indexOf(searchInfo)
      // );
      return String(product[key]).toLowerCase().indexOf(searchInfo) > -1;
    })

  })
}


export const getClassTime = (classSection, time, getBeginTime = false) => {
  //第一个参数是上课的节数数组，第二个是时间表
  let sT = classSection.map((ele) => {
    return +ele < 10 ? ele.slice(-1) : ele;
  });
  let beginIndex = sT[0] - 1;
  let endIndex = sT[sT.length - 1] - 1;
  
  if(getBeginTime){
    return `${time[beginIndex]}`
  }else{
    return `${time[beginIndex]}-${time[endIndex]}`
  }
  
  //
}

export const myDate = (date = openningDate()) => {
  if(getStorageSync('platform') == 'ios'){
    return date.split('-').join('/');
  }else{
    return date.split('-').join('.');
  }
}

export const initVuex = () => {
  store.commit('common/setIsLogin', {isLogin:false});
  store.commit('common/setKeyValue');
}


//加密算法
export function encoding(pass, vCode) {
  var verifycode = vCode;
  var password = pass;
  var key = CryptoJS.enc.Utf8.parse(
    verifycode + verifycode + verifycode + verifycode
  );
  var srcs = CryptoJS.enc.Utf8.parse(password);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  var pw = encrypted.ciphertext.toString();
  return pw;
}

//得到最近的一次考试
export const getNearestExam = (obj) => {
  console.log(obj);
  if(!obj)
    return {}
  let timeArr = obj.map((item) => {
   //console.log(item.date);
    return getCountDown(myDate(item.date))
  })
  let newObj = obj.map((item,index) => {
    return{
      countDown : timeArr[index],
      name:item.clazzName
    }
  }).filter((item) => {
    return item.countDown > 0
  })
  if(newObj.length == 0){
    return 0;
  }

  if(newObj[timeArr.indexOf(Math.min(...timeArr))]){
    return newObj[timeArr.indexOf(Math.min(...timeArr))]
  }else{
      let _timeArr = timeArr.filter((item) => {
        return item > 0;
      })
      return newObj[_timeArr.indexOf(Math.min(..._timeArr))]
    }
}


// 获得倒计时
export const getCountDown = (date) => {
  class createDate {
    constructor(x){
      x ? x=new Date(x) : x=new Date();
      this.year = x.getFullYear();
      this.month = x.getMonth() + 1;
      this.date = x.getDate();
    }
  }

  let nowDate = new createDate();
  let triggerDay = new createDate(date);

  if (getStorageSync("platform") == "ios") {
    return Math.ceil(
      (+new Date(`${triggerDay.year}/${triggerDay.month}/${triggerDay.date}`) - +new Date(`${nowDate.year}/${nowDate.month}/${nowDate.date}`)) /
  1000 /
  60 /
  60 /
  24)
  } else {
    return Math.ceil(
      (+new Date(`${triggerDay.year}/${triggerDay.month}/${triggerDay.date}`) - +new Date(`${nowDate.year}-${nowDate.month}-${nowDate.date}`)) /
        1000 /
        60 /
        60 /
        24
    );
  }
};