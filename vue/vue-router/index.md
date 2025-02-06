# 关于Vue Router
## 什么是Vue Router
* Vue官方的路由管理器，专门用于`构建单页面应用（SPA，Single Page Application）`，允许开发者通过`URL`路径来管理应用的不同视图（组件），并在不刷新页面的情况下动态切换这些视图
## 功能
* 实现单页面应用的路由管理
  * 在单页面应用中，页面不会重新加载，而是通过JS动态更新内容
  * Vue Router负责将URL路径与Vue组件映射起来，当URL变化时自动渲染对应的组件
* 保持URL与视图同步
  * Vue Router确保URL的变化与应用的视图保持一致，用户可以通过URL直接访问特定页面
* 提供导航功能
  * 支持通过`<router-link>`或编程式导航（如`this.$router.push`）实现页面跳转
## `router`、`route`、`routes`
### `router`
* router：路由管理器，Vue Router的实例，负责管理应用的路由
* 作用：
  * 管理路由配置（routes）
  * 提供路由跳转方法（如 push、replace、go）
  * 监听URL变化并渲染对应的组件
### `route`
* route：当前激活的路由对象，表示当前URL对应的路由信息
* 作用：
  * 提供当前路由的详细信息，如路径、参数、查询参数等
* 常用属性：
  * path：当前路由的路径（如 /user/123）
  * params：动态路由参数（如 { id: '123' }）
  * query：URL 查询参数（如 { name: 'foo' }）
  * meta：路由元信息
### `routers`
* routes：路由配置，一个数组，用于定义路由的映射关系（URL路径与组件的对应关系）
* 作用：
  * 配置应用中所有路由的路径和组件
  * 每个路由对象通常包含`path`和`component`属性
