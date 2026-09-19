<template>
  <view class="w-1 h-1 bg-white">
    <Ztl>
      <template v-slot:navName>
        <view>导出课表</view>
      </template>
    </Ztl>
    <view class="p-3">
      <view class="text-bold mb-2">请选择需要导出的周数</view>
      <view class="grid-container">
        <view 
          v-for="week in weekList" 
          :key="week" 
          class="grid-item"
          :class="{'selected': selectedWeeks.includes(week)}"
          @tap="toggleWeek(week)"
        >
          第{{ week }}周
        </view>
      </view>
      
      <view class="flex-row justify-between mt-4">
        <button class="btn btn-default" @tap="selectAll">全选</button>
        <button class="btn btn-default" @tap="clearAll">清空</button>
      </view>
      
      <view class="mt-5">
        <button class="btn btn-primary w-1" @tap="exportExcel">一键导出所选内容</button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Ztl from '@/components/common/Ztl.vue';
import * as XLSX from 'xlsx';

export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore();
    const weekList = Array.from({length: 20}, (_, i) => i + 1);
    const selectedWeeks = ref(Array.from({length: 20}, (_, i) => i + 1)); // Default select all

    const toggleWeek = (week) => {
      const index = selectedWeeks.value.indexOf(week);
      if (index > -1) {
        selectedWeeks.value.splice(index, 1);
      } else {
        selectedWeeks.value.push(week);
      }
    };

    const selectAll = () => {
      selectedWeeks.value = Array.from({length: 20}, (_, i) => i + 1);
    };

    const clearAll = () => {
      selectedWeeks.value = [];
    };

    const exportExcel = () => {
      if (selectedWeeks.value.length === 0) {
        uni.showToast({ title: '请至少选择一周', icon: 'none' });
        return;
      }
      
      uni.showLoading({ title: '导出中...' });
      
      try {
        const weeksData = store.state.scheduleInfo.schedule;
        const wb = XLSX.utils.book_new();
        
        const sortedWeeks = [...selectedWeeks.value].sort((a, b) => a - b);
        
        for (let weekNum of sortedWeeks) {
          const weekIndex = weekNum - 1;
          const weekSchedule = weeksData[weekIndex];
          if (!weekSchedule) continue;
          
          const aoa = [
            ['节次\\星期', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
          ];
          
          const timeSlots = 12;
          for (let i = 1; i <= timeSlots; i++) {
            aoa.push([`第${i}节`, '', '', '', '', '', '', '']);
          }
          
          const merges = [];
          
          for (let d = 0; d < 7; d++) {
            const daySchedule = weekSchedule[d];
            if (Array.isArray(daySchedule)) {
              for (let cls of daySchedule) {
                const name = cls.cn || '';
                const address = cls.ad || '';
                const teacher = cls.te || '';
                const text = `${name}\n${address}\n${teacher}`.trim();
                
                if (Array.isArray(cls.cs) && cls.cs.length > 0) {
                  const sortedCs = [...cls.cs].map(Number).sort((a,b)=>a-b);
                  const start = sortedCs[0];
                  const end = sortedCs[sortedCs.length - 1];
                  
                  if (start >= 1 && start <= timeSlots) {
                    const endRow = Math.min(end, timeSlots);
                    // Check if already occupied
                    if (aoa[start][d + 1]) {
                      aoa[start][d + 1] += `\n\n${text}`;
                    } else {
                      aoa[start][d + 1] = text;
                      if (endRow > start) {
                        merges.push({
                          s: { r: start, c: d + 1 },
                          e: { r: endRow, c: d + 1 }
                        });
                      }
                    }
                  }
                }
              }
            }
          }
          
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          if (merges.length > 0) {
            ws['!merges'] = merges;
          }
          // Make columns a bit wider
          ws['!cols'] = [
            { wch: 10 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
          ];
          
          XLSX.utils.book_append_sheet(wb, ws, `第${weekNum}周`);
        }
        
        const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        
        const fs = uni.getFileSystemManager();
        const isWechat = typeof wx !== 'undefined' && wx.env;
        const filePath = isWechat 
          ? `${wx.env.USER_DATA_PATH}/课程表.xlsx` 
          : `${uni.env ? uni.env.USER_DATA_PATH : '_doc'}/课程表.xlsx`;
        
        fs.writeFile({
          filePath,
          data: base64,
          encoding: 'base64',
          success: () => {
            uni.hideLoading();
            uni.openDocument({
              filePath,
              showMenu: true,
              success: () => {
                uni.showToast({ title: '导出成功', icon: 'success' });
              },
              fail: (err) => {
                uni.showToast({ title: '打开文件失败', icon: 'none' });
                console.error(err);
              }
            });
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showToast({ title: '写入文件失败', icon: 'none' });
            console.error(err);
          }
        });
      } catch (err) {
        uni.hideLoading();
        uni.showToast({ title: '导出失败', icon: 'none' });
        console.error(err);
      }
    };

    return {
      weekList,
      selectedWeeks,
      toggleWeek,
      selectAll,
      clearAll,
      exportExcel
    };
  }
};
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.grid-item {
  width: calc(25% - 10px);
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
.grid-item.selected {
  background-color: #0081ff;
  color: #fff;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.justify-between {
  justify-content: space-between;
}
.mt-4 {
  margin-top: 20px;
}
.mt-5 {
  margin-top: 30px;
}
.mb-2 {
  margin-bottom: 10px;
}
.btn {
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.btn-default {
  background-color: #e0e0e0;
  color: #333;
}
.btn-primary {
  background-color: #0081ff;
  color: #fff;
}
.text-bold {
  font-weight: bold;
}
</style>
