# 基本用法
## 怎么用
```js
// src/router/index.js
// 创建路由实例
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  {path: '/',component: HomeView},
  {path: '/about',component: AboutView},
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
```
```js
// main.js
// 注册路由插件
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

const app = createApp(App);

app.use(router).mount("#app");
```
```vue
<!-- 组件中 -->
<template>
  <div class='box'>
    <header>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
```
## 动态路由
```js
const routes=[
  // 用':'定义动态字段
  {path:'/user:id',component: User}
]
```
## 路由匹配语法
### 静态路径
```js
const routes=[
  { path: '/home', component: Home }
]

```
### 动态路径
```js
const routes=[
  { path: '/user:id', component: User }
]

```
### 多段动态路径
```js
const routes=[
  { path: '/user:id/post/postID', component: User }
]
```
### 可选参数
```js
const routes=[
  { path: '/user:id?', component: User }
]
```
### 通配符匹配
```js
const routes=[
  { path: '/:catchAll(.*)', component: NotFound }
]
```
### 正则匹配
```js
const routes=[
// 只匹配数字id
  { path: '/:id(\\d+)', component: User }
]
```
### `sensitive`和`strict`
```js
const routes=[
  { path: '/user', sensitive: true }  // 大小写敏感，不会匹配 /User
  { path: '/user', strict: true }  // 会匹配 /user，不会匹配 /user/
]
```
## 嵌套路由
```js
const routes=[
  {
    path: '/',
    component: HomeView,
    children:[
      // 可以按需引入，懒加载
    { path: '/child1', component: () => import('@/components/Child1.vue') },
    { path: '/child2', component: () => import('@/components/Child2.vue') },
    ]
  },
]
```
## 命名路由
```js
const routes=[
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
]
```
```vue
<!-- 用name来跳转 -->
<router-link :to="{ name: 'home' }">Home</router-link>
```
## 重定向
```js
const routes=[
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // 当用户访问'/home' 时，URL会被'/'替换，然后匹配成'/'
    redirect: 'home'
  },
]
```
## 别名
```js
// 别名允许多个路径访问同一个组件
const routes=[
  {
    path: '/',
    component: HomeView,
    // 访问home、welcome都会渲染HomeView
    alias: '/welcome'
  },
]
```
## 路由模式
### `Hash`模式
* URL中使用`#`，兼容性好
```js
import { createWebHashHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes:[
    /* ... */ 
  ]
})
```
### `History`模式：
* URL更简洁美观，需服务器支持
```js
import { createMemoryHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes:[
    /* ... */
  ]
})
```
## 编程式导航
```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// 跳转到home
const goHome = () => {
  router.push('/home')
}
// 跳转到user，传递动态参数
const goUser = (userId) => {
  router.push({ path: `/user/${userId}` });
};
// 跳转到about，传递查询参数
const goAbout = () => {
  router.push({ path: 'about', query: { from: 'home' } })
}
// 命名路由跳转
const goNameRoute = () => {
  router.push({ name: 'user', params: { id: '123' } })
}
// 替换当前页
const replaceCurrRoute = () => {
  router.replace('/home')
}
// 回退
const goBack = () => {
  router.back()
}
// 前进
const goForward = () => {
  router.forward()
}
// 刷新
const refreshPage = () => {
  router.go(0)
}
</script>
```
## 命名视图
* 通过给`<router-view>`指定`name`属性，可以将不同的组件渲染到不同的视图位置
* 如果没有指定就使用`default`作为默认视图
```js
import Home from '@/Home.vue'
import Main from '@/Main.vue'
import Footer from '@/Footer.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes:[
    {
      path: '/',
      // 注意是 components
      components: {
        default: Home,
        main: Main,
        footer: Footer
      }
    }
  ]
})
```
```vue
<template>
  <!-- home会被渲染到这里 -->
  <router-view></router-view>

  <router-view name="main"></router-view>
  <router-view name="footer"></router-view>
</template>
```
## 传递参数
### 通过`params`传参
* 适用于需要根据参数显示不同的数据/组件
```js
const routes=[
   {
    path: '/user/:id',
    name: 'user-id',
    component: User
  }
]
```
```vue
<template>
  <!-- 编程式导航 -->
  <button @click="goUser">go user</button>
  <!-- 声明式导航 -->
  <router-link :to="{ name: 'user-id', params: { id: '123' } }">
    User
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// 跳转到user
const goUser = () => {
  // params不能跟path一起用
  router.push({ name: 'user-id', params: { id: '123' } })
}
</script>
```
```vue
<!-- User.vue -->
<template>
  <div>userId:{{ userId }}</div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
// 获取参数
const userId = route.params.id
</script>
```
### 通过`query`传参
* 适用于传递一些不属于路径的其它信息
```js
const routes=[
   {
    path: '/user',
    component: User
  }
]
```
```vue
<template>
  <button @click="goUser">go user</button>

  <router-link :to="{ path: '/user', query: { id: '456', name: 'heihei' } }">
    User
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goUser = () => {
  router.push({ path: '/user', query: { id: '123', name: 'haha' } })
}
</script>
```
### 通过`props`传参
```js
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/user/:id',
    name: 'user-id',
    component: User,
    // 将params作为props传递
    props: true
  },
  {
    path: '/search',
    component: Search,
    // 将query作为props传递
    props: (route) => ({ query: route.query })
  },
]
```
```vue
<template>
  <button @click="goUser">user</button>
  <button @click="goSearch">search</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goUser = () => {
  router.push({ name: 'user-id', params: { id: '123' } })
}
const goSearch = () => {
  router.push({ path: '/search', query: { id: '456', name: 'heihei' } })
}
</script>
```
```vue
<!-- User.vue -->
<template>
  <div>userId:{{ id }}</div>
</template>

<script setup>
const props = defineProps({
  id: String
})
</script>
```
```vue
<!-- Search.vue -->
<template>
  <div>
    <p>ID: {{ query.id }}</p>
    <p>NAME: {{ query.name }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['query'])
</script>
```
