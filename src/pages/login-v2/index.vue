<template>
    <div>
        <button @click="login1">点我登陆本科生 教务系统</button>
        <button @click="login2">点我登陆本科生 统一系统</button>
        <button @click="login3">点我登陆研究生 统一认证系统</button>
    </div>
</template>

<script>
import {requestSsxV3} from '@/network/ssxRequest/request.js'
import {ref} from 'vue'
// 研究生部分
import {
	getScheduleGraduateInfo,
	getScheduleGraduateInfoByCookies,
	getScoreGraduate,
	stuLoginGraduate,
	checkCookies,
	getGraduteUserInfo,
	checkCaptcha,
	saveRefreshTime
} from '@/network/ssxRequest/ssxInfo/graduateAllInfo.js'

import {graduteEncoding,
        logOutInit,
		getStorageSync,
		filterSchedule,
		handleSchedule,
} from '@/utils/common.js'

export default {
    setup() {
        const userName2 = ref('3122002311')
        const password2 = ref('UA8LlkfehaBKZ3iyMzIGNQ==')

        const userName3 = ref('2112205176')
        const password3 = ref('OcJ2DWU3hBnjdymzqMYQXg==')

        //点我登陆本科生 教务系统
        const login1 = () => {

        }

        // 点我登陆本科生 统一系统
        const login2 = () => {
            let params = {
					user: userName2.value,
					password:  password2.value,
                    "userType":1,
                    "loginType":2,
				}

            requestSsxV3({
                url: '/login',
                method: 'POST',
                data: params,
                // params:params,
                // 接口使用json
                headers: {
                    "Content-Type": "application/json"
                },
            })
        }

        //点我登陆研究生 统一认证系统
        const login3 = () => {
            let params = {
					user: userName3.value,
					password:  password3.value,
                    "userType":2    ,
                    "loginType":2,
				}

            requestSsxV3({
                url: '/login',
                method: 'POST',
                data: params,
                // params:params,
                // 接口使用json
                headers: {
                    "Content-Type": "application/json"
                },
            })
        }

                //点我登陆研究生 统一认证系统
        const requestSchedule = () => {
            let params = {
					user: userName3.value,
					password:  password3.value,
                    "userType":2    ,
                    "loginType":2,
				}

            requestSsxV3({
                url: '/login',
                method: 'POST',
                data: params,
                // params:params,
                // 接口使用json
                headers: {
                    "Content-Type": "application/json"
                },
            })
        }


        return {
            login1,
            login2,
            login3
        }
    }
}
</script>