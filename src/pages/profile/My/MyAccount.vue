<template>
	<view class="content">
		<Ztl>
			<template v-slot:navName>
				<view>管理我的小号号</view>
			</template>
		</Ztl>
		<view class="w-1 px-3">
			<ming-container class="w-1 p-3">
				<template v-slot:title> <text>设置及账号管理</text> </template>
				<template v-slot:desc>
					<text>在这里可以刷新课程表，还可以退出账号登录。如果需要刷新课表且登陆状态失效，那么会进入验证码界面，填写正确后，在登录状态未过期的一段时间内，不用提供验证码也可刷新。
					&nbsp; &nbsp;&nbsp; &nbsp;研究生默认用原账号密码重新登录，请检查密码是否修改，多次错误手动在统一门户过滑块登录！
					</text>
				    <!-- <text></text>			 -->
				</template>
				<template v-slot:default>
					<view class="w-1">
						<view class="w-1 flex j-sb my-2 p-2 rounded-5" :style="{ backgroundColor: 'rgb(240,240,240)' }"
							v-for="(item, index) of account" :key="index">
							<view class="flex-center">
								<text class="iconfont icon-icon-test22 mr-1"></text>
								<text>{{ item.text }}</text>
							</view>

							<view class="account-button">
								<watch-button class="w-1 h-1 flex-center" :value="item.btn" @tap="open(item.operation)"
									:themeColor="getThemeColor"></watch-button>
							</view>
						</view>
						<view class="account-logout mt-4 w-1">
							<watch-button class="w-1 h-1 flex-center small-title-font" value="退出登录"
								:themeColor="getThemeColor" @tap="logout"></watch-button>
						</view>
					</view>
				</template>
			</ming-container>
		</view>
		<ming-modal @close="close" :isShow="isShow" class="w-1 h-1" v-if="isShow">
			<template v-slot:default>
				<vcode-platform :vcode="vcode" :themeColor="getThemeColor" @afterRefresh="afterRefresh">
				</vcode-platform>
			</template>
		</ming-modal>
		<ming-toast :isShow="toastIsShow" @resumeToastIsShow="resumeToastIsShow" :content="toastContent"
			:toastType="toastType" :themeColor="getThemeColor"></ming-toast>
	</view>
</template>

<script>
	import {
		onMounted,
		reactive,
		toRefs,
		computed,
		ref,
		provide,
		watch
	} from 'vue'
	import {
		useStore
	} from 'vuex'
	// import CryptoJS from "@/utils/crypto-js";
	import Ztl from '@/components/common/Ztl.vue'
	import MingContainer from '@/components/common/MingContainer'
	import WatchButton from '@/components/common/WatchButton'
	import MingModal from '@/components/common/MingModal'
	import vcodePlatform from '@/components/content/profile/VcodePlatform.vue'
	import MingToast from '@/components/common/MingToast.vue'
	import {
		throttle,
		debounce,
		graduteEncoding
	} from '@/utils/common'
	import {
		ssxInfo
	} from '@/static/data/ssxData'
	import {
		handleGradeId
	} from '@/utils/tempHandleGrade.js'

	import {
		getVcodeAndSession,
		stuLogin,
		getScheduleInfo
	} from '@/network/ssxRequest/ssxInfo/scheduleInfo.js'
	import {
		getFutureExamInfo,
		getPastExamAPIExamInfo
	} from '@/network/ssxRequest/ssxInfo/futureExamInfo.js'
	import {
		getJavaGodShensixie
	} from '@/network/ssxRequest/ssxInfo/libraryCode.js'
	import {
		logOutInit,
		getStorageSync,
		filterSchedule,
		handleSchedule
	} from '@/utils/common.js'
	import {
		useToast,
		useMingModal
	} from '@/hooks/index.js'
	import useSelectorOptions from '@/components/content/schedule/ScheduleContent/ScheduleSelector/SelectorController/classoptions-hook'

	// 研究生部分
	import {
		getScheduleGraduateInfo,
		getScheduleGraduateInfoByCookies,
		getScoreGraduate,
		stuLoginGraduate,
		checkCookies,
		getGraduteUserInfo,
		checkCaptcha
	} from '@/network/ssxRequest/ssxInfo/graduateAllInfo.js'
	
	export default {
		components: {
			Ztl,
			MingContainer,
			WatchButton,
			MingModal,
			vcodePlatform,
			MingToast,
		},
		data() {
			return {
				errorNum:0,// 错误次数
			}
		},
		setup(props) {
			const store = useStore()
			const {
				insertScheduleWhileRefresh
			} = useSelectorOptions()

			const getThemeColor = computed(() => store.state.theme)

			let fatherMethod
			const {
				isShow,
				close,
				openModal
			} = useMingModal()

			const {
				toastType,
				resumeToastIsShow,
				inspireToastIsShow,
				toastIsShow
			} = useToast()
			const toastContent = ref('')
			const handleToast = (type, content) => {
				inspireToastIsShow()
				toastType.value = type
				toastContent.value = content
			}

			const open = operation => {
				uni.showLoading({
					title: '刷新中',
				})
				fatherMethod = operation
				operation()
			}

			const afterRefresh = () => {
				fatherMethod()
			}

			//获取未来考试

			const _getFutureExamInfo = () => {
				let isGradute = getStorageSync('loginIsGraduteStudent');
				if (isGradute) {
					uni.hideLoading()
					handleToast('warning', '研究生暂不支持该功能!');
					return;
				}
				return getFutureExamInfo(getStorageSync('jSessionId'))
					.then((res, req) => {
						let futureExam = res.data
						uni.setStorageSync('futureExam', futureExam)
						store.commit('exam/setFutureExam', {
							futureExam: futureExam
						})
						uni.hideLoading()
						handleToast('success', '刷新考试安排成功')
					})
					.catch(err => {
						openModal()
						uni.hideLoading()
						handleToast('warning', '刷新考试失败')
					})
			}

			//获取以前考试
			const _getPastExamAPIExamInfo = () => {
				return getPastExamAPIExamInfo(getStorageSync('jSessionId'))
					.then((res, req) => {
						let exam = res.data
						uni.setStorageSync('exam', exam)
						exam = handleGradeId()
						store.commit('exam/setExam', {
							exam: exam
						})
						store.commit('exam/setCurrentExam', {
							termIndex: [0, 0, 0]
						})
						store.commit('exam/setGPAOfSix')
						uni.hideLoading()
						handleToast('success', '刷新成绩成功')
					})
					.catch(err => {
						console.log(err)
						openModal()
						uni.hideLoading()
						handleToast('warning', '刷新成绩失败')
					})
			}
			// 研究生-检查是否需要滑块登录
			const _checkCaptCha = ()=>{
				let checkUser = {
					stdId:getStorageSync("stuId")
				} 
				return checkCaptcha(checkUser).then(res=>{
					if(res.isNeed){
						uni.showToast({
							icon: 'error',
							title: '出现滑块验证!',
						})
					}
				})
			}
			// 研究生-获得用户信息、学期、校区
			const _getUserInfoGradute = ()=>{
				let postData = {
					cookies: getStorageSync('cookiesGradute'),
				}
				return getGraduteUserInfo(postData).then(res=>{
					//
					res = res.data;
					uni.setStorageSync('semester', res.semester); // 最新的学期信息
					uni.setStorageSync('campus', res.campus); // 获得校区
					uni.setStorageSync('userInfoGradute', res.userInfo); // 用户信息
					uni.hideLoading()
					handleToast('success', '登录成功！请重新点击刷新！');
				})
			}
			// 研究生-成绩获取
			const _getPastExamAPIExamInfoGraduate = () => {
				// 先登录
				let cookie = {
					cookies: getStorageSync('cookiesGradute')
				}
				return getScoreGraduate(cookie)
					.then((res, req) => {
						if(!res.isLive){
							uni.hideLoading();
							handleToast('warning', 'Cookies已失效，请重新登录！');
							uni.showLoading({
								title: '重新登录...',
							})
							_loginGradute();
							return
						}
						uni.hideLoading()
						// 判断cookies 是否有效，
						let exam = res.data
						uni.showToast({
							title: '收获成绩成功',
							duration: 2000,
						})
						uni.setStorageSync('exam', exam)
						exam = handleGradeId()
						store.commit('exam/setExam', {
							exam: exam
						})
						store.commit('exam/setCurrentExam', {
							termIndex: [0, 0, 0]
						})
						store.commit('exam/setGPAOfSix')
					})
					.catch(err => {
						console.log(err)
						uni.showToast({
							title: '收获成绩寄寄',
							duration: 2000,
							icon: 'error',
						})
					})
			}

			//获取课程表
			const _getScheduleInfo = () => {
				return getScheduleInfo(getStorageSync('jSessionId'))
					.then((res, req) => {
						let obj = filterSchedule(res.data)
						let weeksData = obj.weeksData
						let scheduleIdColor = obj.scheduleIdColor
						uni.setStorageSync('weeksData', weeksData)
						uni.setStorageSync('scheduleIdColor', scheduleIdColor)
						handleSchedule(weeksData, getStorageSync('currentWeek'), store.state.scheduleInfo
							.currentSwiperIndex)
						insertScheduleWhileRefresh()
						//此时登陆成功
						//从服务端获取的数据被拿去存储到
						uni.hideLoading()
						handleToast('success', '刷新课程表成功')
					})
					.catch(err => {
						console.log(err)
						console.log('err')
						uni.hideLoading()
						openModal()
						handleToast('warning', '刷新课程表失败')
					})
			}
			// 研究生课表获取
			const _getScheduleGraduateInfo = () => {
				// 需要拿到学期和 cookies
				// _checkLive();
				let params = {
					cookies: getStorageSync('cookiesGradute'),
					semester:getStorageSync('semester')
				}
				return getScheduleGraduateInfoByCookies(params).then((res, req) => {
						if(!res.isLive){
							handleToast('warning', 'Cookies已失效，请重新登录！');
							_loginGradute();
							return
						}
						uni.hideLoading()
						let obj = filterSchedule(res.data)
						let weeksData = obj.weeksData
						let scheduleIdColor = obj.scheduleIdColor
						uni.setStorageSync('weeksData', weeksData)
						uni.setStorageSync('scheduleIdColor', scheduleIdColor)
						handleSchedule(weeksData, getStorageSync('currentWeek'), store.state.scheduleInfo
							.currentSwiperIndex)
						insertScheduleWhileRefresh()
						uni.showToast({
							title: '获取课表成功',
							duration: 2000,
						})
					})
					.catch(err => {
						console.log(err)
						console.log('err')
						uni.hideLoading()
					})

			}
			// 研究生-刷新所有
			const _graduateAll = () => {
				let cookie = {
					cookies: getStorageSync('cookiesGradute')
				}
				return getScoreGraduate(cookie)
					.then((res, req) => {
						if(!res.isLive){
							uni.hideLoading();
							handleToast('warning', 'Cookies已失效，请重新登录！');
							uni.showLoading({
								title: '重新登录...',
							})
							_loginGradute();
							return
						}
						uni.hideLoading()
						// 判断cookies 是否有效，
						let exam = res.data
						uni.showToast({
							title: '收获成绩成功',
							duration: 2000,
						})
						uni.setStorageSync('exam', exam)
						exam = handleGradeId()
						store.commit('exam/setExam', {
							exam: exam
						})
						store.commit('exam/setCurrentExam', {
							termIndex: [0, 0, 0]
						})
						store.commit('exam/setGPAOfSix')
						//  然后在刷新课表
						uni.showLoading({
							title: '正在获取课表...',
						})
						_getScheduleGraduateInfo();
					})
					.catch(err => {
						console.log(err)
						uni.showToast({
							title: '收获成绩寄寄',
							duration: 2000,
							icon: 'error',
						})
					})
			}
			//获取图书馆二维码
			const _getJavaGodShensixie = () => {
				let isGradute = getStorageSync('loginIsGraduteStudent');
				if (isGradute) {
					uni.hideLoading()
					handleToast('warning', '研究生暂不支持该功能!');
					return;
				}
				return getJavaGodShensixie(getStorageSync('stuId'), getStorageSync('jSessionId'))
					.then(res => {
						console.log(res)
						const {
							data
						} = res
						uni.setStorageSync('libraryCode', data)
						uni.hideLoading()
						handleToast('success', '刷新二维码成功')
					})
					.catch(err => {
						console.log(err)
						uni.hideLoading()
						openModal()
						handleToast('warning', '刷新二维码失败')
					})
			}
			//登出
			const logout = () => {
				// 需要把身份回复正常
				uni.setStorageSync('loginIsGraduteStudent',false);
				logOutInit()
				uni.navigateBack({
					delta: 1,
				})
				uni.showToast({
					title: '退出成功',
					duration: 2000,
				})
			}
			const _loginGradute=()=>{
				let params = {
					account: getStorageSync('stuId'),
					password: graduteEncoding(getStorageSync('stuId'),getStorageSync('pass'))
				}
				stuLoginGraduate(params)
					.then(res => {
						if(!res.isLive){
							uni.hideLoading()
							handleToast('warning', res.msg);
							_checkCaptCha()
							return;
						}
						uni.hideLoading()
						uni.setStorageSync('cookiesGradute', res.cookies); // 其他接口使用
						_getUserInfoGradute();
						// 保存用户的身份
					})
					.catch(err => {
						uni.hideLoading()
						handleToast('warning', '自动登录失败，请手动退出重新登录！');
					})
			}
			let loginIsGraduteStudent = getStorageSync('loginIsGraduteStudent');
			const _checkLive = ()=>{
				// 研究生先检查cookies
				let params = {
					cookies:getStorageSync('cookiesGradute')
				}
				 checkCookies(params).then((res,req)=>{
					if(res.isLive){
						return
					}
					else{
						// 需要重新登录
						uni.showLoading({
							title: '自动登录中...',
						})
						_loginGradute();
					}
				 })
				 .catch(err => {
				 	handleToast('warning', '自动登录出现异常，请退出重新登录！');
				 })
			}
			const refreshSchedule = loginIsGraduteStudent ? debounce(_getScheduleGraduateInfo, 1500) : debounce(
				_getScheduleInfo, 1500);

			const refreshFutureExam = debounce(_getFutureExamInfo, 1500)
			
			const refreshExam = loginIsGraduteStudent ? debounce(_getPastExamAPIExamInfoGraduate, 1500) : (
				_getPastExamAPIExamInfo, 1500);
			
			const refreshAll = loginIsGraduteStudent ? debounce(() => {
				_graduateAll()
			}, 1500) :debounce(() => {
				_getPastExamAPIExamInfo()
				_getFutureExamInfo()
				_getScheduleInfo()
				_getJavaGodShensixie()
			}, 1500)
			const refreshLibraryCode = debounce(() => {
				_getJavaGodShensixie()
			}, 1500)

			const account = [{
					text: '刷新课程表',
					btn: '刷新',
					operation: refreshSchedule,
				},
				{
					text: '刷新考试安排',
					btn: '刷新',
					operation: refreshFutureExam,
				},
				{
					text: '刷新成绩',
					btn: '刷新',
					operation: refreshExam,
				},
				{
					text: '全部刷新',
					btn: '刷新',
					operation: refreshAll,
				},
				{
					text: '获取入馆二维码',
					btn: '获取',
					operation: refreshLibraryCode,
				},
			]

			return {
				account,
				open,
				logout,
				close,
				openModal,
				afterRefresh,
				isShow,
				getThemeColor,
				toastIsShow,
				toastType,
				resumeToastIsShow,
				toastContent,
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		height: 100%;
	}

	.account-button {
		width: 60px;
		height: 40px;
	}

	.account-logout {
		height: 60px;
	}
</style>
