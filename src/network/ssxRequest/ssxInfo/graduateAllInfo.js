/**
 * 研究生所有的调用
 * 测试本地服务使用的是json
 * 华为函数服务只能使用 path、header、query 三种请求参数，然后通过网关统一转换
 * 
 * 
 */
import {
	requestSsxGraduate
} from '../request.js'
import {
	ssxAPIs
} from '@/api/API.js'
import {graduteEncoding,
        logOutInit,
		getStorageSync,
		filterSchedule,
		handleSchedule,
} from '@/utils/common.js'
import useSelectorOptions from '@/components/content/schedule/ScheduleContent/ScheduleSelector/SelectorController/classoptions-hook'


/**
 * @param {Object} token
 * 研究生课表获取
 */
export function getScheduleGraduateInfo(token) {
	return requestSsxGraduate({
		url: ssxAPIs.scheduleGetAPIGraduate
	})
}

/**
 * 通过cookies获取课表
 * @param {Object} params
 */
export function getScheduleGraduateInfoByCookies(params) {
	return requestSsxGraduate({
		url: ssxAPIs.scheduleGetAPIGraduateByCookies,
		method: 'POST',
		data: params,
		// params:params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}

/**
 * 研究生登录接口
 * @param {Object} params
 */
export function stuLoginGraduate(params) {
	return requestSsxGraduate({
		url: ssxAPIs.loginGraduate,
		method: 'POST',
		// params:params,
		data: params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}

/**
 * 研究生获得考试成绩接口
 * @param {Object} params
 */
export function getScoreGraduate(params) {
	return requestSsxGraduate({
		url: ssxAPIs.getScoreGraduate,
		method: 'POST',
		// params:params,
		data: params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}

/**
 * 检查cookies是否有效
 * @param {Object} params
 */
export function checkCookies(params) {
	return requestSsxGraduate({
		url: ssxAPIs.checkCookies,
		method: 'POST',
		// params:params,
		data: params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}

/**
 * 检查cookies是否有效
 * @param {Object} params
 */
export function getGraduteUserInfo(params) {
	return requestSsxGraduate({
		url: ssxAPIs.getUserInfo,
		method: 'POST',
		// params:params,
		data: params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}

/**
 * 检查cookies是否有效
 * @param {Object} params
 */
export function checkCaptcha(params) {
	return requestSsxGraduate({
		url: ssxAPIs.checkCaptcha,
		method: 'POST',
		// params:params,
		data: params,
		// 接口使用json
		headers: {
			"Content-Type": "application/json"
		},
	})
}
/**
 * 记录研究生课表刷新的时间，每隔一周自动刷新一次
 */
export function saveRefreshTime() {
	let time = new Date().getTime();
	uni.setStorageSync('graduateRefreshTime', time);
}
/**
 * 是否刷满足刷新要求
 */
export function isRefreshTime() {
	let old = uni.getStorageSync('graduateRefreshTime');
	if (old == null || old == undefined) {
		return false;
	}
	old = new Date(old);
	let now = new Date().getTime();
	console.log("现在的时间")
	console.log(now);
	console.log(now - old);
	// 六天一个刷新
	if (now - old > 518400000) {
		return true;
	}
	else{
		return false;
	}
}
/**
 * 重新登录
 */
export function graduateReLogin() {
	let params = {
		account: uni.getStorageSync('stuId'),
		password: graduteEncoding(uni.getStorageSync('stuId'), uni.getStorageSync('pass'))
	}
	// 登录
	stuLoginGraduate(params)
		.then(res => {
			if (!res.isLive) {
				
				// 账号或者密码出现问，不自动刷新
				let checkUser = {
					stdId: getStorageSync("stuId")
				}
				return checkCaptcha(checkUser).then(res => {
					if (res.isNeed) {
						uni.showToast({
							icon: 'error',
							title: '课表自动刷新失败，请手动刷新!',
						})
					}
				})
			}
			uni.setStorageSync('cookiesGradute', res.cookies); // 其他接口使用
		})
		.catch(err => {
			console.log('自动刷新失败！');
			console.log(err);
		})
}

/**
 * @param {Object} cookies'
 * 刷新课表，前提是保证cookies可用
 */
export function scheduleGraduateInfoFresh(cookies) {
	// 需要拿到学期和 cookies
	// _checkLive();
	let params = {
		cookies: getStorageSync('cookiesGradute'),
		semester: getStorageSync('semester')
	}
	return getScheduleGraduateInfoByCookies(params).then((res, req) => {
			let obj = filterSchedule(res.data)
			return obj;
		})
		.catch(err => {
			console.log(err)
			console.log("课表自动刷新失败！")
		})

}
