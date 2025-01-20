# 组合式API
  * 组合式api(composition api)，是vue3新的编写组件逻辑的方式，更灵活、更强大。组合式api的核心是将相关的逻辑代码组织在一起，而不是分散在不同的生命周期钩子中
## `setup()`
* `setup()`函数是组合式API的入口函数，在组件创建之前执行，用于定义组件的响应式状态、计算属性、方法、生命周期钩子等
* 在单文件组件中使用：
```vue
  <script setup>
  import { ref } from 'vue'

  const count = ref(0)
  console.log(count.value)  // 0
  </script>
```
* 在非单文件组件/基于选项式api的组件中使用：
```vue
  <script>
  import {ref} from 'vue'

  export default {
    setup() {
      const count = ref(0)
      return {
        count
      }
    },
    mounted() {
      console.log(this.count)  // 0
    }
  }
  </script>
```
* 接受两个参数
  * props：组件的props
  ```vue
    <script>
    export default {
      props: {
        title: String
      },
      setup(props) {
        console.log(props.title)
      }
    }
    </script>
  ```
  * context：包含attrs、slots、emit等属性的上下文对象
  ```vue
   <script>
    export default {
      setup(props, context) {
        // 透传 非props的属性
        console.log(context.attrs)
        // 插槽内容
        console.log(context.slots)
        // 触发事件的方法
        console.log(context.emit)
        // 暴露公共属性
        console.log(context.expose)
      }
    }
    </script>
  ```
## 核心响应式API
## `ref()` 
* 创建基本响应式数据
```js
const count = ref(0)
console.log(count.value)  // 0
count.value++
console.log(count.value)  // 1
```
## `reactive()` 
* 创建响应式对象
```js
const state = reactive({count:0})
console.log(state.count)  // 0
state.count++
console.log(state.count)  // 1
```
## `readonly()`
* 创建一个只读的响应式对象
```js
import { ref, readonly, watchEffect } from 'vue'

const count = ref(0)
const copy = readonly(count)

watchEffect(() => {
  console.log(copy.value)  // 0 1
})
count.value++
copy.value++  // warn
```
## `computed()`
* 会缓存计算结果，只有当依赖的响应式数据发生变化时才会重新计算
* 计算属性跟方法的区别
  * 计算属性有缓存机制，适合派生数据
  * 方法每次调用都会重新计算，适合执行逻辑
```js
import { ref, computed } from 'vue'

const count = ref(1);
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value)  // 2
```
## `watch()`
* 侦听器，监听响应式数据的变化
```js
import { ref, watch } from 'vue'

const count = ref(0)
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
});
count.value++  // count changed from 0 to 1
```
## `watchEffect()`
* 立即执行传入的函数，并且响应式追踪其依赖，依赖发生变化时重新执行
```js
  import { ref, watchEffect } from 'vue'

  const count = ref(0)
  watchEffect(() => console.log(count.value))  // 0
  count.value++  // 1
```
## `onWatcherCleanup()` vue3.5+
* vue3.5的新特性，用在`在watchEffect()`和`watch()`函数的同步调用(不能在await之后用)，当监听器重新运行（依赖发生变化）或者监听器停止（组件卸载或手动停止监听）时执行的清理函数，可以用来：
  * 取消未完成的异步任务：例如取消未完成的网络请求
  * 清除副作用：例如清除定时器或事件监听器
  * 释放资源：例如关闭文件或数据库连接
```vue
  <template>
    <button class="count" @click="count++">{{ count }}</button>
  </template>
  
  <script setup>
  import { ref, watch, onWatcherCleanup } from 'vue'
  
  const count = ref(0)
  watch(count, (newVal, oldVal) => {
    console.log('watch:', count.value)
  
    onWatcherCleanup(() =>
      console.log('timer cleared')
    )
  })
  // count发生变化后：
  // 第一次发生变化：只触发watch()回调
  // 非第一次：先触发onWatcherCleanup()回调，再触发watch()回调
</script>
```

## 生命周期钩子
## `onMounted()`
* 在组件被挂载完成后执行，适合执行需要访问DOM的操作，如初始化第三方库
```vue
  <template>
    <div class="my-element"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  
  onMounted(() => {
    console.log('Component is mounted!')
    const element = document.querySelector('.my-element')
    if (element) {
      console.log('Element found:', element);
      // Element found: <div class=​"my-element">​</div>​
    }
  });
  </script>
```
## `onBeforeMount`
* 在组件被挂载在DOM前执行，用来执行跟DOM无关的初始化操作
```js
  import { onBeforeMount } from 'vue'

  onBeforeMount(() => console.log('组件即将挂载'))
```
## `onUpdated`
* 组件的响应式状态变化且更新其DOM树后调用
```vue
  <template>
    <button class="count" @click="count++">{{ count }}</button>
  </template>
  
  <script setup>
  import { ref, onUpdated } from 'vue'
  const count = ref(0)
  onUpdated(() => {
    console.log(document.querySelector('.count').textContent)  // 初始值0不会被打印
  });
  </script>
```
## `onBeforeUpdate`
* 在组件更新之前调用，用来在更新前执行一些逻辑
```vue
  <template>
    <button class="count" @click="count++">{{ count }}</button>
  </template>
  
  <script setup>
  import { ref, onUpdated, onBeforeUpdate } from 'vue'
  const count = ref(0)
  onUpdated(() => {
    console.log(document.querySelector('.count').textContent)  // 后输出
  });
  onBeforeUpdate(() => {
    console.log('组件即将更新')  // 先输出
  });
  </script>
```
## `onUnmounted()`
* 在组件被卸载后执行，用来执行最终的清理操作
```vue
  <script setup>
  import { ref, onUnmounted } from 'vue'
  const timer = setInterval(() => console.log('timer is running...'), 1000)
  onUnmounted(() => {
    console.log('Component is unmounted!')
    clearInterval(timer)
  })
  </script>
```
## `onBeforeUnmount`
* 在组件被卸载前执行，用来执行清理操作，如取消事件监听/定时器
```vue
  <script setup>
  import { ref, onBeforeUnmount } from 'vue'
  const timer = setInterval(() => console.log('timer is running...'), 1000)
  onBeforeUnmount(() => {
    console.log('组件即将被卸载')
    clearInterval(timer)
  })
  </script>
```