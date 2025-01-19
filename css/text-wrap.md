# 文本换行
## 1.`word-break` 控制文本换行方式
* `word-break: normal;` 浏览器默认的换行规则
* `word-break: break-all;` 中/日/韩文本可在任意位置断行
* `word-break: keep-all;` 中/日/韩文本不断行，其他文本表现效果与`normal`相同
## 2.`white-space` 处理元素中的空白字符以及换行
* `white-space: normal;`      默认值，合并空格，按需换行
* `white-space: nowrap;`      强制不换行
* `white-space: pre;`         保留空格和换行
* `white-space: pre-wrap;`    保留空格，按需换行
* `white-space: pre-line;`    合并空格，保留换行符
## 3.`overflow-wrap` 处理长单词/不可分割内容（如URL）的换行
* `overflow-wrap: normal;`    只能在单词断点处换行
* `overflow-wrap: break-word;`可在任何位置换行
* `overflow-wrap: anywhere;`  
## 4.`text-overflow` 单行文本截断
* 一般与`overflow: hidden` `white-space: nowrap`一起使用
* `text-overflow: clip`    显示`?`
* `text-overflow: ellipsis`显示`...`
## 5.多行文本截断
* `-webkit-line-clamp`
```css
  .example {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3; /* 显示3行 */
      overflow: hidden;
      text-overflow: ellipsis;
  }
```