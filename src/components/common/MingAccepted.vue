<template>
    <div class='accepted'>
        <div class='outer' @click='updateIsConfrom'>
            <div :class='isConfirm ? "inner" : "inner-no-select"'></div>
        </div>
        <div>{{ title }}</div>
    </div>
</template>
  
<script>
import {ref, watch} from 'vue'
export default {
    props: {
        isConfirm: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: ''
        }
    },
    setup(props, {emit}) {
        const updateIsConfrom = () => {
            emit('onConfirm', !props.isConfirm)
        }

        return {
            updateIsConfrom
        };
    },
};
</script>
  
<style lang="scss" scoped>
.accepted {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 4px;
    padding: 8px;

    .outer {
        height: 16px;
        width: 16px;
        border: 1px solid #000;
        border-radius: 4px;
        display: flex;
        justify-self: center;
        align-items: center;
        padding: 3px;

        .inner {
            height: 100%;
            width: 100%;
            background: #000;
            border-radius: 4px;
            transition: .3s all;
        }

        .inner-no-select {
            background: transparent;
            transition: .3s all;
        }
    }
}
</style>