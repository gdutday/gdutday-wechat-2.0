<script>
import { ssxInfo } from "@/static/data/ssxData.js";
export default {
  onLaunch() {
    console.log("App Launch");

    const init = () => {
      uni.setStorageSync("schoolOpening", "2021.8.30");
      let weeksData = ssxInfo().filter((item, index) => {
        return index < 20;
      });

      let arr1 = [];

      for (let i = 0; i < weeksData.length; i++) {
        let arr = [[], [], [], [], [], [], []];
        for (let j = 0; j < weeksData[i].length; j++) {
          let classInfo = weeksData[i][j];
          arr[--classInfo.weekdays].push(classInfo);
        }
        arr1.push(arr);
      }
      weeksData = arr1;

      weeksData.forEach((element, index) => {
        element.push(index + 1);
      });

      for (let i = 0; i < weeksData.length; i++) {
        for (let j = 0; j < weeksData[i].length; j++) {
          for (let k = 0; k < weeksData[i][j].length; k++) {
            weeksData[i][j][k].clazzSection =
              weeksData[i][j][k].clazzSection.split(",");
            console.log(weeksData[i][j][k].clazzSection);
          }
        }
      }
      uni.setStorageSync("weeksData", weeksData);
      uni.setStorageSync({
        key: "weeksData",
        data: weeksData,
        success: function () {
          console.log("success");
        },
      });
    };

    init();
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
