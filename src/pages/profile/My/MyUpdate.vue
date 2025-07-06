<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>更新日志</div>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>更新日志</text> </template>
        <template v-slot:desc>
          <text>更新的信息在这里！</text>
        </template>
		<template v-slot:default>
		  <view class="w-1">
		    2.1.1 版本更新：兼容研究生客户端，研究生课表每六天自动刷新一次
		  </view>
		</template>
        <template v-slot:default>
          <view class="update-log">
            <view class="update-item">
              <div class="version">2.0.2(2025.07.06) 版本更新与修复：</div>
              <ul class="update-content">
                <li class="main-update">a.新增切换学期功能，提前查看下个学期的课表或查看之前学期课表内容</li>
                  <li>操作方法:</li>
                <li>~~1.点击主页下方“我的”.</li>
                <li>~~2.点击"用户信息与数据管理"</li>
                <li>~~3.选择你想要切换的当前“学期”</li>
                <li>~~4.刷新课程表</li>
                <li>~~5.返回主页，左右切换日期查看课表。</li>
              </ul>
              <ul class="update-content">
                <li>b.更新“关于我们”内容</li>
              </ul>
              <ul class="update-content">
                <li>c.修复无法获取最新成绩问题</li>
                <li>~~在设置以及账号管理页面点击“刷新成绩”刷新按钮即可获取</li>
              </ul>
            </view>
            <view class="update-item">
              <div class="version">2.0.1 版本更新：</div>
              <div class="update-content">课程表页面长按打开编辑课表功能（实在没太多时间开发了，更新日志就简单写一下吧！）</div>
            </view>
          </view>
      </ming-container>
    </view>
  </view>
</template>

<script>
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer'
export default {
  components: {
    Ztl,
    MingContainer,
  },
}
</script>

<style lang="scss" scoped>
.update-log {
  .update-item {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .version {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }

    .update-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;

      ul {
        list-style-type: none;
        padding-left: 20px;
        margin-top: 5px;

        li {
          margin-bottom: 5px;
          .main-update {
            font-size: 1.1em; 
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>