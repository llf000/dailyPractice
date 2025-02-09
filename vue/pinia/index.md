# Pinia
## 关于Pinia
* Pinia是Vue的轻量级状态管理库，可以提供一个简单、直观且类型安全的API来管理应用的状态，是Vuex的替代方案，但更加现代化和灵活，特别适合Vue3应用
### 为什么使用Pinia
* 轻量且简单：Pinia的API设计非常简洁，去除了Vuex中的mutations，直接通过actions修改状态
* 更好的TS支持
* 模块化设计：每个store都是独立的模块，无需像Vuex那样通过模块嵌套来组织代码
* Devtools 支持：Pinia与Vue Devtools集成良好，方便调试
* Composition API友好
* 热更新：不必重载页面即可修改Store，开发时可保持当前的State
## 核心概念
### Store
* 状态管理的核心单元
* 每个 Store 都是一个独立的模块，用于管理应用中的特定状态
* 包含了`state`、`actions`、`getters`
### State
* 状态是store的核心数据，使用state定义初始状态
### Actions
* 用于修改状态的方法
### Getters
* 类似于的计算属性，用于派生状态，接收 state 作为参数，返回计算后的值
## 基本使用
### 安装Pinia
```bash
npm install pinia
```
### 创建并挂载Pinia实例
```js
// src/stores/index.js
import { createPinia } from "pinia"

const MyPinia = createPinia()

export default MyPinia
```
```js
// main.js
import { createApp } from 'vue'
import MyPinia from './stores'
import App from './App.vue'

const app = createApp(App);

app.use(MyPinia).mount("#app")
```
### 定义一个Store
```js
// src/stores/counter.js
// 选项式API
import { defineStore } from "pinia"
// defineStore()的两个参数：唯一id，Option对象/Setup函数
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'haha'
  }),
  actions: {
    addCount() {
      this.count++
    },
    // $patch可以一次更新多个状态
    updateState() {
      this.$patch({
        count: this.count + 5,
        name: 'heihei'
      })
    }
  },
  getters: {
    dubCount: (state) => state.count * 2
  },
})
```
```js
// 组合式API
import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  // getters
  const dubCount = computed(() => count.value * 2)
  // actions
  function addCount() {
    count.value++
  }
  // 返回一个带有想暴露出去的属性和方法的对象
  return { count, dubCount, addCount }
})
```
### 在组件中使用Store
```vue
<template>
  <div>
    <button @click="counterStore.addCount">add</button>
    <p>{{ counterStore.count }}</p>
    <p>{{ counterStore.dubCount }}</p>
  </div>
  <div>
    <button @click="addCount">add</button>
    <p>{{ count }}</p>
    <p>{{ dubCount }}</p>
  </div>
  <div>
    <button @click="counterStore.updateState">updateState</button>
    <p>{{ counterStore.count }}</p>
    <p>{{ counterStore.name }}</p>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from './stores/counter';

const counterStore = useCounterStore()
// 不能这样解构，会失去响应性
// const { count, dubCount, addCount } = useCounterStore()
// 可以这样解构
const { count, dubCount } = storeToRefs(counterStore)
// addCount是 action 可以直接解构
const { addCount } = counterStore

// 还可以这样用$patch
const update = () => {
  counterStore.$patch({ count: count.value + 5, name: 'pinia' })
}

// 订阅state
const unsubscribe = counterStore.$subscribe((mutation, state) => {
  console.log('State changed:', state);
  localStorage.setItem('counterState', JSON.stringify(state));
  // detached: true 组件卸载之后仍然保留订阅器
},{ detached: true });
// 取消订阅
unsubscribe()
</script>
```