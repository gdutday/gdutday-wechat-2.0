<template>
    <view class="content">
        <Ztl>
            <template v-slot:navName>
                <view>刷新数据/退出登陆</view>
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
                <!-- 想要在这里插入一个选择学期的组件，比如可以选择20241学期 -->
                <template v-slot:default>
    <!-- 添加学期选择器 -->
                <view class="term-selector w-1 flex j-sb my-2 p-2 rounded-5" :style="{backgroundColor: 'rgb(240,240,240)'}">
                <view class="flex-center">
                    <text class="iconfont icon-icon-test22 mr-1"></text>
                    <text>选择当前学期</text>
                </view>
                <picker @change="handleTermChange" :value="currentTermIndex" :range="terms" class="picker-content">
                    <text>{{ terms[currentTermIndex] }}</text>
                </picker>
                </view>
                    <view class="w-1">
                        <view class="w-1 flex j-sb my-2 p-2 rounded-5" :style="{backgroundColor: 'rgb(240,240,240)'}"
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
        <ming-toast :isShow="toastIsShow" @resumeToastIsShow="hideToast" :content="warningInfo" :toastType="toastType"
            :themeColor="getThemeColor"></ming-toast>
    </view>
</template>

<script>
import {
    computed, ref
} from 'vue'
import {
    useStore
} from 'vuex';
import MingToast from '@/components/common/MingToast.vue'
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer'
import WatchButton from '@/components/common/WatchButton'
import useLoginCallback from '@/hooks/loginHooks/useLoginCallback.js'
import {
    logOutInit,
    getStorageSync
} from '@/utils/common.js'
import useUserData from "@/hooks/userDataHooks/useUserData.js";
import {useToast} from "@/hooks/index.js";
import {FE_ERROR} from '@/network/enum';
import { convertDateToSemester } from "@/utils/termId";
export default {
    components: {
        MingToast,
        Ztl,
        MingContainer,
        WatchButton
    },
    setup() {
        const store = useStore()
        const {updateLoginCallback} = useLoginCallback()
        const {getSchedule, getExam, getGrade, getAllData, getTermIdV2} = useUserData();
        const getThemeColor = computed(() => store.state.theme)

        const isLocked = ref(false)

        const {
            toastType,
            showToast,
            hideToast,
            toastIsShow,
            warningInfo
        } = useToast()
// 添加学期选择相关的数据
    // 默认学期
    const defaultTerm = convertDateToSemester(store.state.openingData.openingData)
    // 当前学期
    let currentTerm = uni.getStorageSync('selectedTermId')||defaultTerm //20242
    
    // 生成学期数组
    const generateTerms = () => {
        const terms = []
        const currentYear = parseInt(defaultTerm.slice(0, 4))
        // 生成前后4年的学期
        for (let year = currentYear + 1; year >= currentYear - 3; year--) {
            terms.push(`${year}秋季`)
            terms.push(`${year}春季`)
        }
        return terms
    }
    
    const terms = generateTerms()
    
    // 计算当前学期在数组中的索引
    const findCurrentTermIndex = () => {
        let year = currentTerm.slice(0, 4)
        const semester = currentTerm.slice(4) // 1或2
        if (semester === '2') {
           year = parseInt(year) + 1
        } 
        const searchTerm = `${year}${semester === '1' ? '秋季' : '春季'}`
        return terms.findIndex(term => term === searchTerm)
    }
    
    // 设置默认索引为当前学期
    const currentTermIndex = ref(findCurrentTermIndex())
    const selectedTermId = ref(uni.getStorageSync('selectedTermId')||defaultTerm) // 默认设置为当前学期
  
  // 处理学期选择变化
  const handleTermChange = async (e) => {
    const TemcurrentTermIndex = e.detail.value
    const term = terms[TemcurrentTermIndex]
    // 转换格式：如 "2024秋季" => "20241" 或 "2025春季" => "20242"
    const year = term.slice(0, 4)
    const semester = term.includes('秋季') ? '1' : '2'
    if(semester === '1'){
        selectedTermId.value = year + semester
    }else{
        selectedTermId.value = (parseInt(year) - 1) + semester
    }
    if(selectedTermId.value === currentTerm){
        return
    } 
    // await refreshSchedule(selectedTermId.value)
    currentTermIndex.value = e.detail.value
    currentTerm = selectedTermId.value
    uni.setStorageSync("selectedTermId", selectedTermId.value) // 更新学期选择
  }

        const logout = () => {
            // 需要把身份回复正常
            uni.setStorageSync('loginIsGraduteStudent', false);
            logOutInit()
            uni.navigateBack({
                delta: 1,
            })
            uni.showToast({
                title: '退出成功',
                duration: 2000,
            })
        }

        const open = operation => {
            if (isLocked.value) {
                return
            }

            uni.showLoading({
                title: '刷新中',
            })

            const func = () => {
                isLocked.value = true
                updateLoginCallback(() => operation())
                operation()
            }

            Promise.resolve(func())
        }

        const navigateToLogin = () => {
            uni.navigateTo({
                url: "/pages/login-v2/index?isRefresh=true",
            })
        }
        const refreshSchedule = async (termId) => {
        if (!termId) {
        // 如果没有传入termId，拿存储在本地的之前选择的学期
        termId = uni.getStorageSync('selectedTermId') || defaultTerm
         }
         console.log(termId);
        const [isError, result] = await getSchedule({termId})

            // console.log(5546464);
            // const [isError232, result232] = await getSchedule({
            //     termId: "20241"
            // })
            // console.log(result232);
            

            uni.hideLoading()

            isLocked.value = false

            if (isError) {
                const {code, msg} = result

                showToast({
                    toastType: 'warning',
                    warningInfo: msg,
                })
                navigateToLogin()

                return
            }

            showToast({
                toastType: 'success',
                warningInfo: '刷新课表成功',
            })

            return result
        }

        const refreshFutureExam = async () => {
            const [isError, result] = await getExam()

            isLocked.value = false

            uni.hideLoading()

            if (isError) {
                const {code, msg} = result

                showToast({
                    toastType: 'warning',
                    warningInfo: msg,
                })

                // 研究生无成绩
                if (code === FE_ERROR.PG_NO_EXAM) {
                    return
                }

                navigateToLogin()

                return
            }

            showToast({
                toastType: 'success',
                warningInfo: '刷新考试成功',
            })

            return result
        }

        const refreshExam = async () => {
            const [isError, result] = await getGrade()

            isLocked.value = false

            uni.hideLoading()

            if (isError) {
                const {code, msg} = result

                showToast({
                    toastType: 'warning',
                    warningInfo: msg,
                })

                navigateToLogin()

                return
            }

            showToast({
                toastType: 'success',
                warningInfo: '刷新成绩成功',
            })
            uni.setStorageSync("currentExam",uni.getStorageSync('exam'));
            store.commit('exam/setCurrentExam', {
						termIndex: [0, 0, 0]
					})
            uni.setStorageSync('deleteMap', {})
            //设置为空map
            store.commit("exam/setDeleteMap", new Map());

            return result
        }   

        const refreshAll = async () => {
            const [isError, data] = await getAllData()

            isLocked.value = false

            uni.hideLoading()

            if (isError) {
                const {code, msg} = data
                showToast({
                    toastType: 'warning',
                    warningInfo: msg,
                })

                navigateToLogin()
                return
            }

            showToast({
                toastType: 'success',
                warningInfo: '刷新数据成功',
            })
        }



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
            // {
            //     text: '获取入馆二维码',
            //     btn: '获取',
            //     operation: refreshLibraryCode,
            // },
        ]



        return {
            getThemeColor,
            logout,
            account,
            open,

            // toast 
            toastType,
            showToast,
            hideToast,
            toastIsShow,
            warningInfo,
            currentTermIndex,  // 当前选中的索引
            terms,            // 学期选项数组
            handleTermChange, // 选择变化的处理函数
        }
    }
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
.term-selector {
  .picker-content {
    min-width: 120px;
    text-align: right;
  }
}
</style>
