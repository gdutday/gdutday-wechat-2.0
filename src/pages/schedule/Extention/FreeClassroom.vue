<template>
  <web-view :src="url" />
</template>

<script>
export default {
  setup() {
    const url = 'https://jwcwx.gdut.edu.cn/free-class-room'
    return { url }
  },
}
</script>
