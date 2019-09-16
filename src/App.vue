<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  margin: 0;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: block;
  overflow-x: hidden;

  font-family: PingFangSC-Regular;
  /*font-size: 28px;*/
  color: #000000;
  letter-spacing: 0;
}

/* 提示框样式 */
.el-message {
  top: 35px !important;     /* 覆盖内联样式 */
  min-width: 300px !important;
  border-radius: 7px !important;
}

/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
