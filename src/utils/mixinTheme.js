// 使用mixin混合机制，让每个组件都可以获得mixin中的方法或者属性l

import { mapGetters,mapMutations } from "vuex";

let themeMixin = {
  computed:{
    ...mapGetters([
      'getCurThemeType'
    ])
  },
  methods: {
    ...mapMutations([
      'setCurThemeType'
    ])
  },
}


export default themeMixin;