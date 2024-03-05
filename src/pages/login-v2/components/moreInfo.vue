<template>
    <div class="question-container">
        <MingAccepted :title="'我已阅读并同意下方《用户服务条款》'" @onConfirm='changeIsConfirm' :isConfirm='isConfirm' />
        <div class="question-accept flex-center"> </div>

        <div class="questions">
            <div v-for="question in questions" :key="question.title" class="question-item" @tap="jump(question.path)">
                {{ question.title }}
            </div>
        </div>
    </div>
</template>

<script>
import {ref, watch} from 'vue'
import MingAccepted from '@/components/common/MingAccepted.vue'
export default {
    components: {
        MingAccepted
    },
    props: {
        isConfirm: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, {emit}) {
        const questions = ref([{
            title: '用户服务条款',
            path: '/pages/profile/My/MyPrivacy'
        }, {
            title: '关于我们',
            path: '/pages/profile/My/MyAbout'
        }, {
            title: '登录遇到问题',
            path: '/pages/profile/My/MyCommonProblem'
        },])

        const jump = url => {
            uni.navigateTo({
                url,
            })
        }

        const changeIsConfirm = (newValue) => {
            emit('onSelected', newValue)
        }

        return {
            questions,
            jump,
            changeIsConfirm
        }
    }
}

</script>

<style lang="scss" scoped>
.question-container {
    margin: 16px;

    .question-accept {
        margin-top: 8px;
    }

    .questions {
        margin-top: 4px;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        overflow-y: scroll;
        column-gap: 4px;
        color: #576B95;

        .question-item {
            flex-shrink: 0;
        }
    }


}
</style>