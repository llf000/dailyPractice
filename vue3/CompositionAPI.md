---
outline: deep
---
# 组合式API
## 组合式API的概念
  * 组合式API(composition api)，是一种新的编写组件逻辑的方式，更灵活、更强大。组合式api的核心是将相关的逻辑代码组织在一起，而不是分散在不同的生命周期钩子中
  * 组成：`setup()`函数、响应式API、生命周期钩子、依赖注入
  * 组合式API的优势
    * 更好的逻辑复用
    * 更灵活的代码组织​
    * 更好的类型推导​
    * 更小的打包体积​
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
## 响应式API核心
### `ref()` 
* 创建基本响应式数据
```js
const count = ref(0)
console.log(count.value)  // 0
count.value++
console.log(count.value)  // 1
```
### `reactive()` 
* 创建响应式对象
```js
const state = reactive({count:0})
console.log(state.count)  // 0
state.count++
console.log(state.count)  // 1
```
### `readonly()`
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
### `computed()`
* 会缓存计算结果，只有当依赖的响应式数据发生变化时才会重新计算
* 计算属性跟方法的区别
  * 计算属性有缓存机制，适合派生数据
  * 方法每次调用都会重新计算，适合执行逻辑
```js
import { ref, computed } from 'vue'

const count = ref(1)
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value)  // 2
```
### `watch()`
* 侦听器，监听响应式数据的变化
```js
import { ref, watch } from 'vue'

const count = ref(0)
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
});
count.value++  // count changed from 0 to 1
```
### `watchEffect()`
* 立即执行传入的函数，并且响应式追踪其依赖，依赖发生变化时重新执行
```js
  import { ref, watchEffect } from 'vue'

  const count = ref(0)
  watchEffect(() => console.log(count.value))  // 0
  count.value++  // 1
```
### `onWatcherCleanup()` vue3.5+
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
## 响应式API的工具函数
### `isRef()`
* 检测一个值是不是ref
```js
let a = ref(1), b = 2

console.log(isRef(a))  // true
console.log(isRef(b))  // false
```
### `unref()`
* `val = isRef(val)?val.value:val`的语法糖
```js
let a = ref(1), b = 2

console.log(unref(a))  // 1
console.log(unref(b))  // 2
```
### `isReactive()`
* 检测一个对象是不是reactive/shallowReactive
```js
const obj = { count: 0 }
const reactiveObj = reactive(obj)
const shallowReactiveObj = shallowReactive(obj)

console.log(isReactive(obj))  // false
console.log(isReactive(reactiveObj))  // true
console.log(isReactive(shallowReactiveObj))  // true
```
### `isReadonly()`
* 检测一个值是不是reactive/shallowReadonly
```js
const obj = { count: 0 }
const readonlyObj = readonly(obj)
const shallowReadonlyObj = shallowReadonly(obj)

console.log(isReadonly(obj))  // false
console.log(isReadonly(readonlyObj))  // true
console.log(isReadonly(shallowReadonlyObj))  // true
```
### `isProxy()`
* 检查一个对象是不是reactive/readonly/shallowReactive()/shallowReadonly
```js
const obj = { count: 0 }
const readonlyObj = readonly(obj)
const shallowReadonlyObj = shallowReadonly(obj)

console.log(isProxy(obj))  // false
console.log(isProxy(readonlyObj))  // true
console.log(isProxy(shallowReadonlyObj))  // true
```
### `toRef()`
* 将一个响应式对象的属性转换为ref并且保持与源对象的响应式连接
```js
const state = reactive({ count: 0 })
const countRef = toRef(state, 'count')

console.log(state.count)  // 0
countRef.value++
console.log(state.count)  // 1
state.count++
console.log(countRef.value)  // 2
```
### `toRefs()`
* 将一个响应式对象的所有属性结构成ref并且保持与源对象的响应式连接
```js
const state = reactive({ name: 'vue', age: 10 })
const stateAsRef = toRefs(state)
const { name, age } = toRefs(state)

console.log(name.value, age.value)   // vue 10

stateAsRef.age.value++
console.log(stateAsRef.age.value)  // 11
state.name = 'vue3'
console.log(stateAsRef.name.value)  // vue3
console.log(name.value, age.value)  // vue3 11
```
## 响应式API进阶
### `shallowRef()`
* ref的浅层作用形式，只有`.value`值是响应式的
```js
const state = shallowRef({ count: 1 })

watchEffect(() => console.log(state.value))// {count: 1} {count: 3}

state.value.count = 2  // 值会被修改，但不会触发更新
state.value = { count: 3 }  // 会触发更新
```
### `triggerRef()`
* 强制触发`ref()`和`shallowRef()`的更新
```js
const count = ref(0)

watchEffect(() => {
  console.log(count.value)  // 0 0
})

triggerRef(count)
```
```js
const shallow = shallowRef({ greet: 'hello,world' })

watchEffect(() => console.log(shallow.value))  // {greet: 'hello,world'} {greet: 'hello,vue'}

shallow.value.greet = 'hello,vue'

triggerRef(shallow)
```
### `customRef()`
* 创建一个自定义的ref，由开发者自主控制这个ref的依赖追踪和更新触发方式
* 接受一个factory工厂函数，factory接受两个函数`track()`和`trigger()`，返回一个包含`get()`和`set()`方法的对象
  * track()：显式追踪依赖
  * trigger()：显式触发更新
  * get()：定义如何获取ref的值
  * set()：定义如何设置ref的值
```js
// 创建一个防抖ref
import { customRef } from "vue";

export function useDebounceRef(value, delay = 200) {
  let timeout

  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```
```vue
<!-- 使用 -->
<template>
  <p>值每2s更新一次：{{ text }}</p>
  <input v-model="text" />
</template>

<script setup>
import { useDebounceRef } from './useDebounceRef'

let text = useDebounceRef('hello', 2000)
</script>
```
### `shallowReactive()`
* reactive的浅层作用形式
```js
const state = shallowReactive({
  foo: 1, nested: {
    bar: 2
  }
})

watchEffect(() => console.log(state.foo, state.nested.bar))  只打印一次：1 2
state.nested.bar++
```
### `shallowReadonly()`
* readonly的浅层作用形式
```js
const state = shallowReadonly({
  foo: 1, nested: {
    bar: 2
  }
})

// state.foo++  // warn
state.nested.bar++
console.log(state.nested.bar)  // 3
```
#### `toRaw()`
* 返回一个响应式对象的原始对象
```js
const stateReactive = reactive({ count: 0 })

console.log(stateReactive)  // Proxy {count: 0}
console.log(toRaw(stateReactive))  // {count: 0}
```
#### `markRaw()`
* 标记一个对象，让它永远不会被转化为响应式对象，用来显式地阻止vue对某个对象进行响应式处理
```js
const obj = { count: 10 }
const obj2 = { age: 20 }
const markRawObj = markRaw(obj)
const reactiveObj = reactive(markRawObj)
const reactiveObj2 = reactive(obj2)

console.log(reactiveObj)  // {count: 10}
console.log(reactiveObj2)  // Proxy  {age:20}
```
## 生命周期钩子
### `onMounted()`
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
      console.log('Element found:', element)
      // Element found: <div class=​"my-element">​</div>​
    }
  });
  </script>
```
### `onBeforeMount`
* 在组件被挂载在DOM前执行，用来执行跟DOM无关的初始化操作
```js
  import { onBeforeMount } from 'vue'

  onBeforeMount(() => console.log('组件即将挂载'))
```
### `onUpdated`
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
### `onBeforeUpdate`
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
### `onUnmounted()`
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
### `onBeforeUnmount`
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
## 依赖注入
* 通过`provide()`和`inject()`实现，可以不通过props，跨层级在组件中传递数据
* `provide()`：在父组件/祖先组件中提供数据，数据可以是任意类型，包括响应式数据、函数、对象等
* `inject()`：子组件/后代组件中注入由祖先组件提供的数据，可以设置默认值，以防止未提供数据时出现错误
```js
// 可以用Symbol生成值，作为provide和inject的键，避免命名冲突
export const ageKey = Symbol()
```
```vue
<!-- parent -->
<template>
  <Child />
  <button @click="count++">add</button>
</template>

<script setup>
import { provide, ref } from 'vue'
import Child from './layout/child.vue'
import { ageKey } from './keys'

const count = ref(0)
const age = ref(20)
const fn = (msg) => {
  console.log(msg)
}

provide('count', count)
provide(ageKey, age)
provide('fn', fn)
</script>

<!-- child -->
<template>
  <!-- count值会随父元素传递的值响应式变化 -->
  <p>{{ count }}</p>
  <!-- 20 -->
  <p>{{ age }}</p>
</template>

<script setup>
import { inject, watchEffect } from 'vue'
import { ageKey } from '@/keys'

const count = inject('count', 2)  // 如果没有传值，默认值式是2
const age = inject(ageKey)
const message = inject('fn')

message('child message')  // 打印：child.message
</script>
```