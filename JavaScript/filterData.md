## 判断对象数组的值中，是否存在某个关键字
```js
  // 原始数组
  const initialData = [
    { name: 'Zhang', age: 20 },
    { name: 'Wang', age: 30 },
    { name: 'Li', age: 25 },
    { name: 'Zhao', age: 18 },
    { name: 'Liu00', age: 38 }
  ]
```
```js
  // 用for...in遍历对象属性，用exist()函数判断关键字是否存在
  // for循环里return语句没有意义，所以找到keyword的话就用break退出循环
  function filterData(keyword){
    let data
    keyword=keyword.toLowerCase()
    const exist=(val)=>String(val).toLowerCase().includes(keyword)
    data=initialData.filter(item=>{
       let rs=false
      for(let key in item){
        if(exist(item[key])){
          rs=true
          break
        }
      }
      return rs
    })
    console.log(data)
  }

  filterData('an')  // [ { name: 'Zhang', age: 20 }, { name: 'Wang', age: 30 } ]
  filterData('20')  // [ { name: 'Zhang', age: 20 } ]
```
```js
  // 优化：
  // Object.keys(item) 返回对象item的所有属性名组成的数组
  // some() 判断是否至少有一个属性值包含keyword
  // indexOf()/includes() 判断是否包含keyword
  function filterData(keyword) {
    let data
    keyword = keyword.toLowerCase() // 模糊匹配
    data = initialData.filter(item => 
      Object.keys(item).some(key => 
        // String(item[key]).toLowerCase().indexOf(keyword) > -1
        String(item[key]).toLowerCase().includes(keyword)
      )
    )
    console.log(data)
  }

  filterData('zh')  // [ { name: 'Zhang', age: 20 }, { name: 'Zhao', age: 18 } ]
  filterData('18')  // [ { name: 'Zhao', age: 18 } ]
```
```js
  // 进一步优化：判断数据中是否包含嵌套对象/数组
  function deepSearch(obj,keyword){
    return Object.values(obj).some(val=>{
      if(typeof val==='object'&& val!==null){
        return deepSearch(val,keyword)
      }
      return String(val).toLowerCase().includes(keyword)
    })
  }

  function filterData(keyword){
    keyword=keyword.toLowerCase()
    data=initialData.filter(item=>
      deepSearch(item,keyword)
    )
    console.log(data)
  }

  const initialData = [
    { name: 'Zhang', age: 20, address: { city: 'Beijing' } },
    { name: 'Wang', age: 30, address: { city: 'Shenzhen' } },
    { name: 'Li', age: 25, address: { city: 'Hannan' } },
    { name: 'Zhao', age: 18, address: { city: 'Guangzhou' } }
  ]

  filterData('Beijing')  // { name: 'Zhang', age: 20, address: { city: 'Beijing' } } ]
```
