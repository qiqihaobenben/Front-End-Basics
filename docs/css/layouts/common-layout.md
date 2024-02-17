# 常见布局

常见的布局有：

- 居中
  - 水平居中
  - 垂直居中
  - 水平垂直居中
- 两列布局
- 三列布局
  - 普通三列布局
    - float + margin html 结构必须两个浮动元素在前
    - position + margin
  - 双飞翼布局 float + 负 margin
  - 圣杯布局 float + 负 margin
  - flex 解决方案
- 三行自适应布局
- 页脚置底（sticky footer）

## 两列布局：一列定宽 + 一列自适应

```html
<body class="container">
  <div class="left"></div>
  <div class="main"></div>
</body>
```

### float + margin

```
.main {
  box-sizing: border-box;
  margin-left: 200px;
  height: 100vh;
  background-color: brown;
  border: 4px solid gold;
}

.left {
  box-sizing: border-box;
  width: 200px;
  float: left;
  height: 100vh;
  background-color: antiquewhite;
}
```

### flex

```
.container {
  display: flex;
  height: 100vh;
}

.main {
  flex-grow: 1;
  background-color: brown;
  border: 4px solid gold;
}

.left {
  width: 200px;
  background-color: antiquewhite;
}
```

### grid

```
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 100vh;
}

.main {
  background-color: brown;
  border: 4px solid gold;
}

.left {
  background-color: antiquewhite;
}

```

## 三列布局

### float + margin

```html
<body class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</body>
```

注意 DOM 文档的书写顺序，先写两侧栏，再写主面板，如果更换位置，侧栏会被挤到下一列

```
.container {
  height: 100vh;
}

.left {
  float: left;
  width: 100px;
  height: 100%;
  background-color: antiquewhite;
}

.main {
  box-sizing: border-box;
  margin-left: 100px;
  margin-right: 200px;
  height: 100%;
  background-color: brown;
  border: 4px solid gold;
}

.right {
  float: right;
  width: 200px;
  height: 100%;
  background-color: aquamarine;
}
```

优点：简单明了

缺点：渲染时先渲染了侧边栏，而不是比较重要的主面板。

### 圣杯布局

float + 负 margin + padding + position

```html
<body class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</body>
```

```
.container {
  padding-left: 100px;
  padding-right: 200px;
  height: 100vh;
}

.left {
  float: left;
  margin-left: -100%;
  position: relative;
  left: -100px;
  width: 100px;
  height: 100%;
  background-color: antiquewhite;
}

.main {
  box-sizing: border-box;
  float: left;
  width: 100%;
  height: 100%;
  background-color: brown;
  border: 4px solid gold;
}

.right {
  float: left;
  margin-left: -200px;
  position: relative;
  right: -200px;
  width: 200px;
  height: 100%;
  background-color: aquamarine;
}
```

优点：中间栏内容优先渲染，有利于 SEO

缺点：实现相对复杂，需要更多的 CSS 样式调整。如果将浏览器无限放大时，「圣杯」将会「破碎」掉，当 main 部分设置了一个较小的宽度时就会发生布局混乱。因为 margin-left: -100%，是参考的容器宽度，给 main 部分设置了一个较小的宽度，侧边栏再使用 margin-left: -100%，往左移动的距离就太多了，会移出屏幕。

### 双飞翼布局

```html
<body class="container">
  <div class="main-wrap">
    <div class="main"></div>
  </div>
  <div class="left"></div>
  <div class="right"></div>
</body>
```

```
.container {
  height: 100vh;
}

.left {
  float: left;
  margin-left: -100%;
  width: 100px;
  height: 100%;
  background-color: antiquewhite;
}

.main-wrap {
  float: left;
  width: 100%;
  height: 100%;
}

.main {
  box-sizing: border-box;
  height: 100%;
  margin-left: 100px;
  margin-right: 200px;
  background-color: brown;
  border: 4px solid gold;
}

.right {
  float: left;
  margin-left: -200px;
  width: 200px;
  height: 100%;
  background-color: aquamarine;
}
```

优点：简化了 CSS 布局，解决了圣杯布局中容器 padding 带来的一些限制，因为外层 main-wrap 的宽度始终是 100%，margin-left: -100%，就一直是正常的。

缺点：需要额外的标签包裹中间栏，增加了 HTML 结构的复杂度。

## 三行自适应布局（三明治布局）

header（定高） + main（高度自适应，最大宽度 1200px） + footer（定高）

```html
<body class="container">
  <div class="header"></div>
  <main class="main"></main>
  <div class="footer"></div>
</body>
```

### position

```
.container {
  position: relative;
  height: 100vh;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: antiquewhite;
}

/* 设置四个方向，把元素拉开 */
.main {
  box-sizing: border-box;
  overflow: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 100px;
  bottom: 100px;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  background-color: brown;
  border: 4px solid gold;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: aquamarine;
}
```

### flex

```
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 100px;
  background-color: antiquewhite;
}

.main {
  box-sizing: border-box;
  flex: 1;
  max-width: 1200px;
  width: 100%;
  align-self: center;
  background-color: brown;
  border: 4px solid gold;
}

.footer {
  height: 100px;
  background-color: aquamarine;
}
```

### grid

```
.container {
  display: grid;
  grid-template-rows: 100px 1fr 100px;
  height: 100vh;
}

.header {
  background-color: antiquewhite;
}

.main {
  box-sizing: border-box;
  max-width: 1200px;
  width: 100%;
  justify-self: center;
  background-color: brown;
  border: 4px solid gold;
}

.footer {
  background-color: aquamarine;
}
```

## 链接

- [CSS 布局十八般武艺都在这里了](https://segmentfault.com/a/1190000008789039)
- [CSS 五种方式实现 Footer 置底](https://segmentfault.com/a/1190000008516654?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)
- [冷门布局方法 tabel-cell 的可行性研究](https://mp.weixin.qq.com/s/a3HFIv74PH6LWgHnVRsfKg)
- [只要一行代码，实现五种 CSS 经典布局](https://www.ruanyifeng.com/blog/2020/08/five-css-layouts-in-one-line.html)
- [你可能不太熟知的布局技巧](https://mp.weixin.qq.com/s/HYUgb8jEI-aQhbN4sBajNw)
