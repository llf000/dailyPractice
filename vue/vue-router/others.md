---
outline: deep
---
# others
## 导航守卫
* 导航守卫（Navigation Guards），可以在路由跳转前后执行一些逻辑，比如用于权限验证、页面跳转前的数据获取、全局错误处理等
### 全局导航守卫
* 包括全局前置守卫`beforeEach()`和`全局后置守卫afterEach()`，在路由即将改变前和改变后触发
* 参数
  * `to`: 目标路由对象
  * `from`: 当前路由对象
  * `next`: 可选参数，回调函数，用来继续导航或重定向，如果没有next()函数，则默认允许用户访问每一个路由。如果接收了next()函数，则必须调用next()函数，否则不允许用户访问任何一个路由。
    * 3种调用方式
      * `next()`: 执行下一个钩子函数
      * `next(false)`: 强制停留在当前页面
      * `next('/')`: 跳转到其他地址               
#### 全局前置守卫`beforeEach`
* 在路由导航之前执行，适合用来权限验证
```js
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) {
    // 没有通过验证就重定向到login页
    next({ name: 'Login' })
  } else {
    // 通过就继续导航
    next()
  }
})
```
#### 全局解析守卫`beforeResolve`
* 导航被确认之前执行，适合用来数据预加载
```js
router.beforeResolve((to, from, next) => {
  if (to.meta.requiresData) {
    fetchData().then(() => next()); // 预加载数据
  } else {
    next() // 继续导航
  }
})
```
#### 全局后置钩子`afterEach`
* 导航完成后执行，适合用来日志记录/页面滚动/声明或更改页面标题
* 没有`next`函数也不会改变导航本身
```js
router.afterEach((to, from, failure) => {
  logPageView(to.path)   // 记录页面访问
  window.scrollTo(0, 0)  // 滚动到页面顶部

})
```
### 路由独享守卫`beforeEnter`
* 路由配置中的守卫，仅对特定路由生效
```js
const routes = [
  {
    path: '/user-detail',
    component: UserDel,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    },
  },
]
```
### 组件内守卫
#### 选项式API
* `beforeRouteEnter`
* `beforeRouteUpdate`
* `beforeRouteLeave`
```vue
<script>
export default {
  beforeRouteEnter(to, from) {
    // 组件实例被创建前调用
    // 不能获取组件实例 this--守卫执行时，组件实例还没被创建
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是组件被复用时调用
  },
  beforeRouteLeave(to, from) {
    // 在导航离开当前路由时调用
  },
}
</script>
```
#### 组合式API
* `onBeforeRouteUpdate`
* `onBeforeRouteLeave`
```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue';

onBeforeRouteUpdate((to, from, next) => {
  console.log('路由更新')
  next()
})

onBeforeRouteLeave((to, from, next) => {
  const confirmLeave = confirm('确定离开吗？')
  if (confirmLeave) {
    next()   // 允许离开
  } else {
    next(false)   // 取消离开
  }
})
</script>
```
### 导航解析流程
导航被触发
* 组件内`beforeRouteLeave`
* 全局`beforeEach`
* 重用组件内`beforeRouteUpdate`(2.2+)
* 路由配置`beforeEnter`
* 组件内`beforeRouteEnter`
* 全局`beforeResolve`(2.5+)
* 导航完成
* 全局`afterEach`
* `beforeRouteEnter`的`next`回调
## 路由元信息
* 通过在路由中添加`meta`字段，可以在路由定义中添加额外的信息，这些信息可以在路由守卫、组件内等地方被访问和使用。在管理权限、页面标题、SEO 设置等场景中非常有用
```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      // 任何人都可以访问home页
      requiresAuth: false,
      title: 'Home Page'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      // 通过验证才可以访问about
      requiresAuth: true,
      title: 'About Us'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Login Page'
    }
  }
]

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters.isAuthenticated // 假设getter用于检查用户是否已登录
 
  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})
```
