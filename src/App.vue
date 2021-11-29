<script>
export default {
  onLaunch() {
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */

@import url(@/static/css/main.css);
@import url(@/static/css/zcm-main.css);

.ztl {
  width: 100%;
  background-color: red;
}
</style>
