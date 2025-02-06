---
outline: [2,6]
---
# 特殊元素和属性
## 特殊元素
### `<component>`
* 动态组件，根据`is`属性值动态渲染不同的组件
```vue
<component :is="currentComponent"></component>
```
### `<slot>`
* 模板中的插槽内容出口
```vue
<!-- myButton.vue -->
<template>
  <button class="btn">
  	<slot></slot>
	</button>
</template>
<style scope>
.btn{
  /* ... */
}
</style>

<!-- 使用 -->
<template>
  <MyButton>Click</MyButton>
</template>

<script setup>
import MyButton from './MyButton.vue'
</script>
```
### `<template>`
* 用于包裹多个元素或指令，但不会渲染为实际的DOM元素
* 结合v-if、v-for指令
```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>

<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li>{{ item.detail }}</li>
  </template>
</ul>
```
* 定义插槽内容(具名插槽)
```vue
<!-- MyLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="main"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* style */
</style>

<!-- 使用 -->
<template>
  <MyLayout>
    <template #header>
      <h1>title</h1>
    </template>
    <template #main>
      <p>content</p>
    </template>
    <template #footer>
      <p>footer</p>
    </template>
  </MyLayout>
</template>

<script setup>
import MyLayout from './MyLayout.vue'
</script>
```
## 特殊属性
### `key`
* 用于标识元素的唯一性，帮助vue跟踪元素的变化
* v-for中为每个元素提供唯一的key
```vue
<div v-for="(item, index) in items" :key="index">
  {{ item.text }}
</div>
```
* 强制重新渲染元素
```vue
<Transition>
  <span :key="count">{{ count }}</span>
</Transition>
```
### `ref`
*获取DOM元素/组件实例的引用
```vue
<template>
  <div ref="myDiv">Hello, Vue!</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const myDiv = ref(null)

onMounted(() => {
  console.log(myDiv.value) // <div>Hello, Vue!</div>
})
</script>
```
### `is`
* 绑定动态组件
```vue
<component :is="currentComponent"></component>
```