/**
 * 研究生所有的接口
 * requests 共用一个，没有分开
 * API 也汇总在一起，但是export 分开
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
		params: params,
	})
}
