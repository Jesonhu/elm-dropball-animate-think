<template>
  <div id="app">
    <hb-page-view/>
  </div>
</template>

<script>
import PageView from '@/components/move-page-view'

export default {
  name: 'App',
  components: {
    HbPageView: PageView
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#page {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y:scroll;
}
#page > * {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  z-index: 2;
}
</style>
