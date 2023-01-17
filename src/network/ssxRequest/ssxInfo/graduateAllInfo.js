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
		headers:{
			"Content-Type":"application/json"
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
		headers:{
			"Content-Type":"application/json"
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
		headers:{
			"Content-Type":"application/json"
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
		headers:{
			"Content-Type":"application/json"
		},
	})
}