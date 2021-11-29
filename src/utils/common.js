import store from '@/store/index.js'
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
	let termStart = getStorageSync('schoolOpening', "2021.8.30");
	const start = termStart.split("."),
		inputTime = new Date(
			intervalDay * 86400000 +
			new Date(start[0], start[1] - 1, +start[2]).getTime()
		);
	return inputTime.getMonth() + 1 + "." + inputTime.getDate();
}

//获取现在的周数(相对于开学日期)
export function getWeek() {
	let termStart = getStorageSync('schoolOpening', "2021.8.30");
	const start = termStart.split("."),
		diff =
		new Date().getTime() -
		new Date(start[0], start[1] - 1, +start[2]).getTime();
	//从第0开始
	const week = Math.floor(diff / 604800000);
	return week;
}

//得到当前的week
export function getCurrentWeek() {
	const week = getWeek();
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
export function throttle(fn, {
	interval = 500
} = {}) {
	if (typeof fn != "function") return new Error("类型错误");
	const _self = fn;
	let timer,
		firstTime = true; //是否第一次调用
	return function(...args) {
		const _me = this;
		if (firstTime) {
			fn.apply(_me, args);
			return (firstTime = false);
		}
		if (timer) {
			return false;
		}
		timer = setTimeout(() => {
			clearTimeout(timer);
			timer = null;
			_self.apply(_me, args);
		}, interval);
	};
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
         
  let weeksData = scheduleInfo.filter((item, index) => {
    return index < 20;
  });
  let arr1 = [];
  for (let i = 0; i < weeksData.length; i++) {
    let arr = [[], [], [], [], [], [], []];
    for (let j = 0; j < weeksData[i].length; j++) {
      let classInfo = weeksData[i][j];
      arr[--classInfo.weekdays].push(classInfo);
    }
    arr1.push(arr);
  }
  weeksData = arr1;
  // weeksData.forEach((element, index) => {
  //   element.push(index + 1);
  // });
  for (let i = 0; i < weeksData.length; i++) {
    for (let j = 0; j < weeksData[i].length; j++) {
      for (let k = 0; k < weeksData[i][j].length; k++) {
        weeksData[i][j][k].clazzSection =
          weeksData[i][j][k].clazzSection.split(",");
      }
    }
  }

  return weeksData;
}


export function handleSchedule(weeksData,currentWeek){
  let swiperList = [weeksData[currentWeek], 0, 0];
  store.commit("scheduleInfo/setSchedule", { schedule: weeksData });
  store.commit("scheduleInfo/setPickWeekSchedule", {
    pickWeekSchedule: swiperList,
  });
}
