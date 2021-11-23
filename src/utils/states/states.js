import { computed } from 'vue'
import { mapGetters, mapState, useStore, createNamespacedHelpers } from 'vuex'

const useMapper = (mapper, mapFn) => {
  const store = useStore()

  const storeStateFns = mapFn(mapper)
  const storeState = {}
  Object.keys(storeStateFns).forEach((keyFn) => {
    const fn = storeStateFns[keyFn].bind({ $store: store })
    storeState[keyFn] = computed(fn)
  })

  return storeState
}

// 第一个参数是模块的名字，第二个参数是模块内的state
export const useState = (moduleName, mapper) => {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}


// 第一个参数是模块的名字，第二个是模块内的getters
export const useModuleGetters = (moduleName, mapper) => {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}