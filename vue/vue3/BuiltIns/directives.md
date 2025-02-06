# 内置指令
## `v-text`
* 更新元素的textContent
```vue
<span v-text="msg"></span>
<!-- 相等 -->
<span>{{msg}}</span>
```
## `v-html`
* 更新元素的innerHTML，要注意只对可信值使用，容易导致`XSS`攻击
```vue
<div v-html="html"></div>
```
## `v-show`
* 根据表达式值的真假切换元素`display`属性
```vue
<div v-show="isShow">{{showMsg}}</div>
```
## `v-if`, `v-else`,`v-else-if`
* 根据表达式值的真假性，条件性地渲染元素
```vue
<div v-if="type === 'A'">Type A</div>
<div v-else-if="type === 'B'">Type B</div>
<div v-else>Type C</div>
```
## `v-for`
* 基于原始数据多次渲染元素或模板块
```html
<ul>
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</ul>
```
## `v-on`
* 给元素绑定事件监听器，缩写为`@`
* 修饰符
  * `stop` 调用`event.stopPropagation()`，阻止事件冒泡
  * `prevent` 调用`event.preventDefault()`，阻止默认行为
  * `capture` 在捕获阶段处理事件
  * `self` 只有事件从元素本身发出才触发回调
  * `{keyAlias}` 只在某些按键下触发处理函数
  * `once` 事件只触发一次
  * `passive` 通过 `{ passive: true }`附加一个DOM事件，通常用于优化性能
```vue
<!-- 阻止事件冒泡 -->
<button @click.stop="handleClick">Stop Propagation</button>
<!-- 阻止默认行为 -->
<form @submit.prevent="handleSubmit">Prevent Default</form>
<!-- 事件只会触发一次 -->
<button @click.once="handleClick">Trigger Once</button>
<!-- 只在元素本身触发 -->
<div @click.self="handleClick">Only Self</div>
```
## `v-bind`
* 给表达式动态的绑定一个/多个属性或一个组件的prop，缩写为`:`
```vue
<img :src="imageSrc" :alt="imageAlt" />
```
## `v-model`
* 在表单输入元素或组件上创建双向绑定
* 仅限`input`、`select`、`textarea`元素和组件
* 修饰符
  * `lazy` 监听change事件而不是input
  ```html
  <input v-model.lazy="message" placeholder="Enter">
  <!-- 当input失去焦点时，message才会更新 -->
  <p>{{ message }}</p>
  ```
  * `number` 将输入的合法字符串转为数字
  ```html
  <input v-model.number="age" type="number" placeholder="Enter age">
  <p>Age: {{ age }} ({{ typeof age }})</p>
  ```
  * `trim` 移除输入内容两端空格
  ```html
  <input v-model.trim="username" placeholder="Enter your username">
  <p>Username: "{{ username }}"</p>
  ```
## `v-slot`
* 定义插槽内容，缩写为`#`
* 仅限`template`和组件(用于带有prop的单个默认插槽)
```vue
<template v-slot:header>
  <h1>Header Content</h1>
</template>
<template #main>
  <main>Main Content</main>
</template>
```
## `v-pre`
* 跳过该元素及其所有子元素的编译
```vue
<span v-pre>{{ this will not be compiled }}</span>
```
## `v-once`
* 只渲染元素和组件一次，并跳过之后的更新
```vue
<!-- 单个元素 -->
<span v-once>This will never change: {{msg}}</span>
```