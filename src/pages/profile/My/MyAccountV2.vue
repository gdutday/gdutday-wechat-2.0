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
                <template v-slot:default>
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
        const refreshSchedule = async () => {
            const [isError, result] = await getSchedule()

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
</style>
