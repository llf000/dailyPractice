# 全局API
## `createAPP()` 
* 创建一个vue应用实例
```js
import { createApp } from 'vue'

const app = createApp(...)
```
## ` app.mount()`
* 将应用实例挂载在容器元素中
```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount("#app")
```
## ` app.unmount()`
* 卸载挂载的应用实例，卸载时会触发该组件内所有组件的卸载生命周期钩子
## ` app.onUnmount()`
* 注册一个回调函数，应用被卸载时调用
## ` app.use()`
* 用来安装vue插件
```js
import router from './router'

app.use(router)
```
## ` app.component()`
* 注册全局组件，注册后所有组件都可以直接使用该组件
```js
import MyComponent from './MyComponent.vue'

app.component('MyComponent',MyComponent);
```
## `app.directive()`
* 注册全局自定义指令
```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
});
```
```vue
  <!-- 组件中使用 -->
  <template>
  <!-- input是聚焦状态 -->
    <input v-focus /> 
  </template>
```
## `app.provide()`
* 提供全局依赖注入，所有子组件可以通过`inject`访问
```js
appp.provide('message','hello')

// 子组件访问
import { inject } from 'vue'

console.log(inject('message'))  // hello
```
## `app.version()`
* 获取当前vue版本号
## `app.config()`
* 配置应用全局行为
* `errorHandler` 全局错误处理函数
* `warnHandler` 全局警告处理函数
* `globalProperties` 添加全局属性或方法
```js
app.config.errorHandler = (err, instance, info) => {
  console.log('Global error:',err)
}
app.config.warnHandler = (msg, instance, trace) => {
  // 参数分别是：信息、来源、组件追踪字符串
  // 这个配置只在开发坏境存在
}
app.config.globalProperties.$myGlobalMethod = () => {
  console.log('This is a global method')
}
```
## `nextTick()`
* 等待下次DOM更新的工具方法，适合在修改数据后立即操作DOM
```vue
  <template>
    <button class="count" @click="add">{{ count }}</button>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  
  const count = ref(0)
  
  async function add() {
    count.value++
    console.log(document.querySelector('.count').textContent)  // 0
    await nextTick()
    console.log(document.querySelector('.count').textContent)  // 1
  }
  </script>
```
## defineComponent()​
* 定义Vue组件时提供类型推导的辅助函数

