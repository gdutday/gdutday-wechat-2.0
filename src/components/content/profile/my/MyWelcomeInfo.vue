<template>
  <view class="h-1 w-1 mw-info">
    <view class="mw-version">
      <text data-text="GDUTDAY 2.0.0">GDUTDAY 2.0.0</text>
    </view>
    <view class="mw-examwarning"><slot>近期没有考试~上号</slot></view>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.mw-info {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  position: relative;
  min-height: 100%;

  overflow: hidden;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 160%;
    min-height: 400%;
    background: #c4b8a3;
    animation-name: rotate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  &:before {
    top: 60%;
    border-radius: 45%;
    animation-duration: 7s;
  }

  &:after {
    top: 55%;
    opacity: 0.5;
    border-radius: 47%;
    animation-duration: 7s;
  }

  .mw-version {
    width: 100%;
    height: 70%;
    display: flex;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;

    text {
      position: relative;
      margin: auto;
      font-size: 2.5rem;
      word-spacing: 0.2em;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      color: transparent;
      background-color: #000;
      background-clip: text;
    }

    text::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      background-image: linear-gradient(
        120deg,
        transparent 0%,
        transparent 6rem,
        white 11rem,
        transparent 11.15rem,
        transparent 15rem,
        rgba(255, 255, 255, 0.3) 20rem,
        transparent 25rem,
        transparent 27rem,
        rgba(255, 255, 255, 0.6) 32rem,
        white 33rem,
        rgba(255, 255, 255, 0.3) 33.15rem,
        transparent 38rem,
        transparent 40rem,
        rgba(255, 255, 255, 0.3) 45rem,
        transparent 50rem,
        transparent 100%
      );
      background-clip: text;
      background-size: 150% 100%;
      background-repeat: no-repeat;
      animation: shine 5s infinite linear;
    }
  }

  .mw-examwarning {
    flex: 1;
    z-index: 99;
  }
}

@keyframes shine {
  0% {
    background-position: 50% 0;
  }
  100% {
    background-position: -190% 0;
  }
}

@keyframes move {
  80% {
    bottom: -30px;
    transform: translate(623px, 0);
  }
  93% {
    transform: translate(623px, 3px);
    opacity: 1;
  }
  100% {
    transform: translate(623px, 150px);
    opacity: 0;
  }
}

@keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }

  50% {
    transform: translate(-50%, -2%) rotateZ(180deg);
  }

  100% {
    transform: translate(-50%, 0%) rotateZ(360deg);
  }
}
</style>