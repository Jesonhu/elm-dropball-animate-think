<template>
  <div class="shop-cart">
    <!-- list -->
    <div class="content">
      <div class="left_nav">左<br/>侧<br/>菜<br/>单</div>
      <ul class="list">
        <li class="item" :class="{'s-active': index === activeIndex}" v-for="(item, index) in foodList" :key="index">
          <span class="item__text">Food - {{index+1}}</span>
          <span class="item__add add" @click="addFood($event, index)"></span>
        </li>
      </ul>
    </div>

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

    <!-- 购物车控制 -->
    <div class="shop-cart__controller">
      <span class="shop-cart__logo"></span>
    </div>
  </div>
</template>

<script>
// @see https://github.com/Jesonhu/elm-live-demo/blob/master/src/elm/src/components/shopcart/shopcart.vue
// @see https://cn.vuejs.org/v2/guide/transitions.html#JavaScript-钩子
// @see https://blog.csdn.net/weixin_42424660/article/details/83751622
export default {
  name: 'ShopCart',
  data() {
    return {
      foodList: new Array(20),
      activeIndex: -1,
      // ====================
      // 小球动画
      // ====================
      balls: [ // 小球相关
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      /** 当前正在运动的小球 */
      dropBalls: [], // 小球相关
    }
  },
  methods: {
    addFood(e, index) {
      // https://cn.vuejs.org/v2/api/#v-on
      // Tips: 
      const currentTarget = e.target
      this.drop(currentTarget, index)
      this.activeIndex = index
    },
    // ====================
    // 小球动画
    // ====================
    drop(el, index) {
      // ball.show = true
      // ball.el = el
      // this.dropBalls.push(ball)
      // Tips: 往 dropBalls 中添加数据
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
    },
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

  }

}
</script>

<style lang="less" scoped>
.shop-cart {
  width: 100vw;
  height: 100vh;
  position: relative;

  &__controller {
    position: absolute;
    height: 80px;
    width: 100%;
    background-color:#fff;
    left:0;
    bottom:0;
    z-index: 2;
    text-align: left;
    // box-shadow: 0 0 8px #333;
  }

  &__controller::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    background-color:#fff;
    width: 76px;
    height: 10px;
  }

  &__logo {
    // display
    display: block;
    width: 50px;
    height: 50px;
    background-color:#00a0dc;
    margin-left: 20px;
    margin-top: 15px;
    border-radius: 50%;
  }
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
}
.left_nav {
  width: 100px;
  height: 100%;
  background-color: #fff;
  text-align: center;
  padding-top: 50%;
  font-size: 16px;
  color:#333;
  // box-shadow: 3px 0 3px rgba(0,0,0,.1);
}
.list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y:scroll;
  padding-bottom: 90px;
}
.item {
  position: relative;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  text-align: left;
  line-height: 50px;
  padding-left: 10px;

  &:last-child {
    border-bottom: none;
  }
}
.item.s-active .item__text {
  color: #00a0dc;
}
.item__text {
  font-size: 14px;
  position: relative;
  z-index: 1;
}
.item__add {
  position: absolute;
  right: 50px;
  top: 50%;
  margin-top: -12.5px;
  z-index: 2;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, .5);
  border-radius: 50%;
}
.item__add::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  left: 0;
  top: 50%;
  margin-top:-1px;
  background-color:rgba(0, 0, 0, .5);
}
.item__add::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 100%;
  left: 50%;
  top: 0;
  margin-left:-1px;
  background-color:rgba(0, 0, 0, .5);
}

// ====================
// 小球动画
// ====================
.ball-container{
  .ball{
    // background-color: red;
    position: fixed;
    left:37px;
    bottom:33px;
    z-index: 200;
    transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
    .inner{
      width:16px;
      height: 16px;
      border-radius: 50%;
      background-color: rgb(0,160,220);
      transition:all 0.4s linear;
    }
  }
}
</style>