<template>
  <transition name="page-move">
    <router-view class="page-view"></router-view>
  </transition>
</template>

<script>
export default {}
</script>

<style>
.page-view {
  /* Notice: 解决 #page > * 需要设置层级，但是造成的问题的处理 */
  z-index: 3!important;
}
.page-move-enter, 
.page-move-leave-active {
  transform: translate(100%, 0);
}
.page-move-enter-active, 
.page-move-leave-active {
  transition: transform .5s;
}
</style>