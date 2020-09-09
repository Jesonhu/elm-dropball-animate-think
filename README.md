# 饿了么H5-购物车小球动画分析与实现

## 背景

之前学习 "饿了么H5" Vue 版的课程，对其中点击商品到购物车时出现的小球动画印象深刻。为了弄懂动画的实现原理，于是就有了当前案例与实现。当前案例为了便于理解动画，没有将组件进行拆分，而是放在一个组件中实现。


## 分析

点击 “商品”，触发点击监听函数 `@click="addFood($event, index)"` `addFood()` 参数 `$event` 是将当前对象的事件对象传递过来

```js
addFood(e, index) {
  // https://cn.vuejs.org/v2/api/#v-on
  // Tips: 
  const currentTarget = e.target
  this.drop(currentTarget, index)
},
```
这里通过 `e.target` 获取触发事件的原生dom对象。接着执行 `drop()` 函数

```js
drop(el, index) {
  for (let i = 0; i < this.balls.length; i++) {
    const ball = this.balls[i]
    if (!ball.show) {
      ball.show = true
      ball.el = el
      ball.index = index
      this.dropBalls.push(ball);
      return
    }
  }
}
```
这里主要设置和添加一些属性并添加到 `dropBalls` 中。 `ball.show = true` 将属性 `show` 设置为 `true` 添加属性 `el` 为当前点击的dom对象。注意这里对象的引用问题，`dropBalls` 中对象与 `balls` 中对应的对象完全相同。

```html
<!--小球动画-->
<div class="ball-container">
  <div 
    v-for="(ball, index) in balls"
    :key="index"
  >
    <transition name="drop" 
      @before-enter="beforeDrop" 
      @enter="dropping" 
      @after-enter="afterDrop">
      <div class="ball" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </transition>
  </div>
</div>
```
在 `drop()` 方法中将一些小球 `.show` 改成了 `true` 因此这里就开始进行动画。在 `transition` 元素上添加了一些 [钩子函数](https://cn.vuejs.org/v2/guide/transitions.html#JavaScript-钩子) 下面为几个钩子函数相关的代码

```js
/** 动画开始 */
beforeDrop(el) {
  // Tips: 设置小球的初始位置为当前点击的元素位置
  let count = this.balls.length
  while (count--) {
    const ball = this.balls[count]
    if (ball.show) {
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
      let rect = ball.el.getBoundingClientRect()
      const x = rect.left - 30
      const y = -(window.innerHeight - rect.top - 40)
      // 外层元素: 垂直方向
      el.style.display = ''
      el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
      el.style.transform = `translate3d(0, ${y}px, 0)`
      // 内层元素: 水平方向
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
      inner.style.transform = `translate3d(${x}px, 0, 0)`
    }
  }
},

/** 动画进行中 */
dropping(el, done) {
  /* eslint-disable no-unused-vars */
  let rf = el.offsetHeight;//必须重绘，再进行transform才有用
  this.$nextTick(() => {
    // 外层整个部分
    el.style.webkitTransform = 'translate3d(0,0,0)';
    el.style.transform = 'translate3d(0,0,0)';
    // 内层
    let inner = el.getElementsByClassName('inner-hook')[0];
    inner.style.webkitTransform = 'translate3d(0,0,0)';
    inner.style.transform = 'translate3d(0,0,0)';
    // transitionend 过渡完成后 css3 transition 事件
    el.addEventListener('transitionend', done); // 告诉vue动画完成了
  });
},

/** 动画结束 */
afterDrop(el) {
  const ball = this.dropBalls.shift()
  if (ball) {
    ball.show = false
    el.style.display = 'none'
  }
}
```
**动画的原理是**：点击时，将动画小球设置到点击元素所在的位置。主要通过 `getBoundingClientRect()` 获取点击元素的位置属性。通过 CSS3 `transform:translate3d(*,*,*)` 设置小球的动画开始时位置属性。动画进行中给小球设置目的地属性 `transform:translate3d(0,0,0)` 即小球CSS 定义的位置。抛物线轨迹是通过 `transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);` 中的 `cubic-bezier(0.49,-0.29,0.75,0.41)` 实现。当动画结束时 `this.dropBalls.shift()` 移除运动过的一个小球。

有一点需要说明的是 `let rf = el.offsetHeight;` 这段代码看似无用实际不能省略。作用是 `必须重绘，再进行transform才有用`。如果缺少这行代码会出现: "每次第一次小球不是在点击处开始动画, 而第二次又正常" 的问题

更多详情请查看源码 `components/Shopcart/index.vue`
