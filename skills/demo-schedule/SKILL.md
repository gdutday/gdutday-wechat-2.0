---
name: demo-schedule
description: 在小程序中为课表类页面创建未登录可预览的 mock 数据模式。核心原则：独立演示态、不污染登录态、不写真实缓存、复用现有数据转换链路。
---

# Demo Schedule Pattern

在小程序课表页面为未登录用户提供可交互的 mock 数据预览，点击「换一批」重新生成随机课表，登录成功后自动清除。

## 核心原则

1. **独立演示态，不伪造登录**
   - 不修改 `common.isLogin`、`username`、`password`、`weCookies` 等登录相关状态。
   - 在课表 store 中新增独立字段（如 `isDemoSchedule`）作为演示模式开关。

2. **mock 数据只写内存，不写本地缓存**
   - 不调用 `uni.setStorageSync('weeksData', ...)` 或 `uni.setStorageSync('scheduleIdColor', ...)`。
   - 数据只通过 Vuex mutation 写入内存态（如 `state.schedule`）。
   - 登录成功或退出演示时，从缓存恢复真实数据或清空。

3. **复用现有数据转换链路**
   - 生成的 mock 数据与真实课表使用同一套字段映射（如 `courseName` → `cn`）和 `filterSchedule()` 处理。
   - 确保渲染层（如 `WeekContent`）不需要感知数据来源差异。

4. **演示颜色独立存储**
   - 课表颜色查找函数（如 `getColor()`）在演示模式下读取独立的 `demoScheduleIdColor`。
   - 避免演示课程 id 覆盖真实课表的颜色映射。

## 数据生成要点

### 字段类型

- 周几字段（如 `courseDay` → `wd`）必须保持**数字类型**，不要用 `String()` 包裹。
- 老的 `filterSchedule()` 逻辑会执行 `arr[--classInfo.wd].push(classInfo)`，字符串在部分小程序引擎中会递减为 `NaN`，导致 `undefined.push()` 报错。

### 数组边界

- 生成上课时段时，天数索引必须限制在 0-6（一周 7 天）。
- 不要用课程数组的长度来决定天数——如果课程有 16 门，就会生成 day 1 到 day 16，超出课表 `arr` 的 7 天边界。

### 嵌套数组展开

- 用 `Array.from({length: 7}, (_, dayIndex) => timeSlots.map(...)).flat()` 生成一维时段字符串数组。
- 忘记 `.flat()` 会导致 `slots[index]` 是嵌套数组而非字符串，`split('-')` 报错。

## UI 交互

### 入口

在课表空态（未登录）区域添加「示例课表」按钮，与「我要登陆」并排。

### 悬浮操作按钮（FAB）

进入演示模式后，在右下角显示一个 48px 圆形悬浮按钮：

```html
<view class="demo-fab">
  <view v-if="fabOpen" class="demo-fab-menu">
    <text @tap="changeDemo">换一批</text>
    <text @tap="exitDemo">退出</text>
  </view>
  <view class="demo-fab-button" @tap="toggleFab">
    <text>{{ fabOpen ? '×' : '+' }}</text>
  </view>
</view>
```

```scss
.demo-fab {
  position: absolute;
  bottom: 24px;
  right: 16px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.demo-fab-menu {
  margin-bottom: 8px;
  border-radius: 28px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.demo-fab-item {
  display: block;
  padding: 12px 16px;
  font-size: 24rpx;
  color: #333;
}

.demo-fab-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

## 状态清理

### 登录成功

在所有登录入口（新页面、旧页面、自动登录）的成功回调中调用：

```js
store.commit('scheduleInfo/clearDemoSchedule')
```

### 退出演示

FAB 菜单中的「退出」按钮直接调用同一个 mutation，恢复真实课表缓存或清空。

## 避坑清单

- 不要在 mock 生成函数中调用 `uni.setStorageSync`。
- 不要在 `filterSchedule()` 之前对 `wd` 做 `String()` 转换。
- 不要用课程数组长度决定上课天数。
- 不要忘记给 `Array.from({length: 7}, () => timeSlots.map(...))` 加 `.flat()`。
- 不要把演示颜色写进 `scheduleIdColor` 缓存。
- 不要在演示模式下触发自动刷新（`graduateReLogin` 等）。
