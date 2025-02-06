---
outline: [2,6]
---
# 内置组件
## `<Transition>`
* 为单个元素或组件提供动画过渡效果
* 触发条件
  * 由v-if所触发的切换
  * 由v-show所触发的切换
  * 由`<component>`切换的动态组件
  * 改变特殊的key属性
### 基于CSS过渡
* transition
```vue
<template>
  <button @click="isShow = !isShow">fade</button>
  <Transition name="fade">
    <p v-if="isShow">hello vue</p>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(true)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
```
* animation
```vue
<template>
  <button @click="isShow = !isShow">bounce</button>
  <Transition name="bounce">
    <p v-if="isShow">css动画</p>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(true)
</script>

<style scoped>
.bounce-enter-active,
.bounce-leave-active {
  animation: bounce-in 3.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
```
* 深层级过渡
```vue
<template>
  <button @click="isShow = !isShow">toggle</button>
  <!-- duration=元素内部duration+delay -->
  <Transition :duration="750" name="nested">
    <div v-if="isShow" class="outer">
      <div class="inner">hello</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(true)
</script>

<style scoped>
.outer,
.inner {
  max-width: 300px;
  min-height: 100px;
  padding: 30px;
  background-color: #eee;
}

.inner {
  text-align: center;
  background-color: #ccc;
}

.nested-enter-active,
.nested-leave-active {
  transition: all 0.5s ease-in-out;
}
/* 延迟父元素的离开 */
.nested-leave-active {
  transition-delay: 250ms;
}

.nested-enter-from,
.nested-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.5s ease-in-out;
}
/* 延迟子元素的进入 */
.nested-enter-active .inner {
  transition-delay: 250ms;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```
### JS钩子
* 通过监听`<Transition>`事件的方式在过渡过程中挂上钩子函数
* 支持的钩子函数
  * `before-enter`	进入过渡开始前触发
  * `enter`	进入过渡开始时触发
  * `after-enter`	进入过渡完成时触发
  * `enter-cancelled`	进入过渡被取消时触发
  * `before-leave`	离开过渡开始前触发
  * `leave`	离开过渡开始时触发
  * `after-leave`	离开过渡完成时触发
  * `leave-cancelled`	离开过渡被取消时触发
```vue
<template>
  <button @click="show = !show">Toggle</button>

  <Transition @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
    <div class="gsap-box" v-if="isShow"></div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const isShow = ref(true)

function onBeforeEnter(el) {
  gsap.set(el, {
    scaleX: 0.25,
    scaleY: 0.25,
    opacity: 1
  })
}

function onEnter(el, done) {
  gsap.to(el, {
    duration: 1,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: 'elastic.inOut(2.5, 1)',
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    duration: 0.7,
    scaleX: 1,
    scaleY: 1,
    x: 300,
    ease: 'elastic.inOut(2.5, 1)'
  })
  gsap.to(el, {
    duration: 0.2,
    delay: 0.5,
    opacity: 0,
    onComplete: done
  })
}
</script>

<style scoped>
.gsap-box {
  background: #42b883;
  margin-top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
```
### 可复用效果
```vue
<!-- 把上面的动画封装成一个组件 -->
<template>
  <Transition name="my-transition" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
    <slot v-if="isVisible"></slot>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  enterDuration: {
    type: Number,
    default: 1,
  },
  leaveDuration: {
    type: Number,
    default: 0.7,
  },
  enterEase: {
    type: String,
    default: 'elastic.inOut(2.5, 1)',
  },
  leaveEase: {
    type: String,
    default: 'elastic.inOut(2.5, 1)',
  },
})

const isVisible = ref(props.show)

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal
  }
)

function onBeforeEnter(el) {
  gsap.set(el, {
    scaleX: 0.25,
    scaleY: 0.25,
    opacity: 1,
  })
}

function onEnter(el, done) {
  gsap.to(el, {
    duration: props.enterDuration,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: props.enterEase,
    onComplete: done,
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    duration: props.leaveDuration,
    scaleX: 1,
    scaleY: 1,
    x: 300,
    ease: props.leaveEase,
  })
  gsap.to(el, {
    duration: 0.2,
    delay: props.leaveDuration - 0.2,
    opacity: 0,
    onComplete: done,
  })
}
</script>
```
```vue
<!-- 使用 -->
<template>
  <button @click="isShow = !isShow">toggle</button>
  <my-transition :show="isShow">
    <div class="gsap-box"></div>
  </my-transition>
</template>

<script setup>
import { ref } from 'vue'
import MyTransition from './MyTransition.vue'

const isShow = ref(true)
</script>

<style scoped>
.gsap-box {
  background: #42b883;
  margin-top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
```
### `appear`
* 在元素初次渲染时就出现动画
```vue
<template>
  <button @click="isShow = !isShow">fade</button>
  <Transition name="fade" appear>
    <p v-if="isShow">hello vue</p>
  </Transition>
</template>
```
### 在元素间切换
* 利用v-if系列，保持每次只有一个元素被渲染
```vue
<template>
  <span>点击切换：</span>
  <div class="btns">
    <!-- mode: 实现先执行离开动画，然后在其完成之后再执行下一个元素的进入动画 -->
    <Transition name="slide" mode="out-in">
      <button class="btn" v-if="doState === 'saved'" @click="doState = 'edited'">saved</button>
      <button class="btn" v-else-if="doState === 'edited'" @click="doState = 'editing'">edited</button>
      <button class="btn" v-else-if="doState === 'editing'" @click="doState = 'saved'">editing</button>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const doState = ref('saved')
</script>

<style scoped>
.btns {
  display: inline-block;
  position: reactive;
  height: 5px;
}

.btn {
  position: absolute;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-out;
}

.slide-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
```
### `key attribute`
* 用来强制重新渲染过渡元素，当key发生变化时，会销毁旧元素并创建新元素，从而触发过渡动画
```vue
<template>
  <div class="box">
    <Transition>
      <span :key="count">{{ count }}</span>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
setInterval(() => {
  count.value++
}, 1000)
</script>

<style scoped>
.box {
  position: relative;
  text-align: center;
}

span {
  position: absolute;
  font-size: 50px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```
## `<TransitionGroup>`
* 为列表中的多个元素或组件提供过渡效果，用来处理动态列表的的动画
```vue
<template>
  <button @click="add">add</button>
  <TransitionGroup name="fade" tag="ul" class="list">
    <li class="item" v-for="(item, index) in items" :key="item">
      <span>{{ item }}</span>
      <button @click="del(index)">del</button>
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue'

const initialVal = () => [1, 2, 3, 4, 5]
const items = ref(initialVal())

function add() {
  const i = Math.round(Math.random() * items.value.length)
  items.value.splice(i, 0, items.value.length + 1)
}

function del(i) {
  items.value.splice(i, 1)
}
</script>

<style scoped>
.list {
  position: relative;
}

.fade-move, /* 移动中的元素 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in;
}

.fade-leave-active {
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```
```vue
<!-- 渐进列表+延迟动画 -->
<template>
  <input v-model="search" />
  <TransitionGroup tag="ul" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
    <li class="item" v-for="(item, index) in filterItem" :key="item" :data-index="index">
      <span>{{ item }}</span>
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

const items = [1, 2, 3, 4, 5, 6, 7]
const search = ref('')

const filterItem = computed(() =>
  items.filter((item) => String(item).includes(search.value))
)
console.log(filterItem)
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
</script>
```
## `<KeepAlive>`
* 能在多个组件间动态切换时缓存被移除的组件实例
## `<Teleport>`
* 将组件的内容渲染到DOM中的其他位置。比如处理模态框、通知、弹出菜单等
```vue
<template>
  <button @click="showModel = true">ShowModel</button>
  <Teleport to="body">
    <div class="mask" v-show="showModel">
      <button @click="showModel = false">Close</button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const showModel = ref(false)
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
  transition: opacity 0.3s ease;
}
</style>
```