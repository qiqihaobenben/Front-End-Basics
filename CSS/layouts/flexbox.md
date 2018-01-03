## CSS弹性盒子布局

### 简介

CSS弹性盒子布局定义了一种针对用户界面设计而优化的CSS盒子模型。  

在弹性布局模型中，弹性容器的子元素可以在任何方向上排布，也可以“弹性伸缩”其尺寸，既可以增加尺寸以填满未使用的空间，也可以收缩尺寸以避免从父元素溢出。子元素的水平对齐和垂直对齐都能很方便的进行操控。

在 flex 容器中默认存在两条轴，水平主轴(main axis) 和垂直的交叉轴(cross axis)，这是默认的设置，但是可以更改，所以不能一概认为宽度就是主轴，垂直就是侧轴，需要根据 `flex-direction` 来判断。  
在 flex 容器中的每个子元素被称为 flex item 占据的主轴空间为 (main size), 占据的交叉轴的空间为 (cross size)。  
如下图：  

![图示](./images/1.jpg)

### flex容器  

实现flex布局首先指定一个容器。
```
.container {
    display: flex; //块级盒子
}
.container {
    display: inline-flex; //行内盒子
}
```

**注意：** 容器设置flex布局后，子元素的 `float` 、`clear` 、`vertical-align` 属性将会失效。

### 设置在容器上的属性

1. flex-direction
2. flex-wrap
3. flex-flow
4. justify-content
5. align-items
6. align-content

#### 1、flex-direction: 决定主轴的方向（即项目的排列方向）

```
.container {
    flex-direction: row | row-reverse | column | column-reverse;
}
```
| 属性值 | 描述 |  
| :---: | :---: |  
| row(默认) | 指定主轴水平, 子项目从左至右排列➜ |  
| row-reverse | 指定主轴水平，子项目从右向左排列⬅︎ |  
| column | 指定主轴垂直，子项目从上至下排列⬇︎ |  
| column-reverse | 指定主轴垂直，子项目从下往上排列⬆︎ |  

#### 2、flex-wrap：决定容器内子元素是否可换行

```
.container {
    flex-wrap: no-wrap | wrap | wrap-reverse;
}
```
| 属性值 | 描述 |  
| :---: | :--- |  
| no-wrap(默认值) | 默认不换行,即当主轴尺寸固定时，当空间不足时，项目尺寸会随之调整(缩小)而并不会挤到下一行。 |  
| wrap | 正常换行 |  
| wrap-reverse | 换行，第一行在下方 |  

#### 3、flex-flow: flex-direction 和 flex-wrap 的简写形式

```
.container {
    flex-flow: <flex-direction> || <flex-wrap>;
}
默认值为: row nowrap
```

#### 4、justify-content: 定义了子元素在主轴上的对齐方式

```
.container {
    justify-content: flex-start | flex-end | center | space-between | space-around;
}
```
| 属性值 | 描述 |  
| :---: | :--- |  
| flex-start | 子项目起始位置与main start位置对齐 |  
| flex-end | 子项目末尾位置与main end位置对齐 |  
| center | 在主轴方向居中于容器 |  
| space-between | 两端对齐，项目之间的间隔相等，即剩余空间等分成间隙 |  
| space-around | 每个项目两侧的间隔相等，所以项目之间的间隔比项目与边缘的间隔大一倍 |  

#### 5、align-items: 定义了子元素在交叉轴上的对齐方式

```
.container {
    align-items: flex-start | flex-end | center | baseline | stretch;
}
```
| 属性值 | 描述 |  
| :---: | :--- |  
| flex-start | 子项目起始位置与cross start位置对齐 |  
| flex-end | 子项目末尾位置与cross end位置对齐 |  
| center | 在交叉轴方向居中于容器 |  
| baseline | 第一行文字的基线对齐 |  
| stretch(默认) | 高度未定(或auto)时, 将占满容器的高度 |  

#### 6、align-content: 定义了多根轴线的对齐方式，如果项目只有一根轴线，那么该属性将不起作用

```
.container {
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```
当你 `flex-wrap` 设置为 `nowrap` 的时候，容器仅存在一根轴线，因为项目不会换行，就不会产生多条轴线。

当你 `flex-wrap` 设置为 `wrap` 的时候，容器可能会出现多条轴线，这时候你就需要去设置多条轴线之间的对齐方式了。

| 属性值 | 描述 |  
| :---: | :--- |  
| flex-start | 顶部与cross start位置对齐 |  
| flex-end | 底部与cross end位置对齐 |  
| center | 在交叉轴方向居中于容器 |  
| space-between | 与交叉轴两端对齐, 间隔全部相等 |  
| space-around | 每个轴线两侧的间隔相等，所以轴线之间的间隔比轴线与边缘的间隔大一倍。 |  
| stretch | 多根主轴上的子项目充满交叉轴 |  

### 设置在flex item上的属性

1. order
2. flex-basis
3. flex-grow
4. flex-shrink
5. flex
6. align-self

#### 1、order: 定义项目在容器中的排列顺序，数值越小，排列越靠前，默认值为 0

```
.item {
    order: <integer>;
}
```

#### 2、flex-basis: 定义了在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间

```
.item {
    flex-basis: <length> | auto;
}
```
默认值：auto，即项目本来的大小, 这时候 item 的宽高取决于 width 或 height 的值。
当 `flex-basis` 值为 0 % 时，是把该项目视为零尺寸的，故即使声明该尺寸为 140px，也并没有什么用。
当 `flex-basis` 值为 auto 时，则根据尺寸的设定值(假如为 100px)，则这 100px 就为项目的大小。

#### 3、flex-grow: 定义项目的放大比例

```
.item {
    flex-grow: <number>;
}
```
默认值为 0，即如果存在剩余空间，也不放大。
当所有的项目都以 `flex-basis` 的值进行排列后，仍有剩余空间，那么这时候 `flex-grow` 就会发挥作用了。

如果所有项目的 `flex-grow` 属性都为 1，则它们将等分剩余空间。(如果有的话)

如果一个项目的 `flex-grow` 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

当然如果当所有项目以 `flex-basis` 的值排列完后发现空间不够了，且 `flex-wrap：nowrap` 时，此时 `flex-grow` 则不起作用了，这时候就需要`flex-shrink` 这个属性。

grow 在 flex 容器下的子元素的宽度和比容器和小的时候起作用。 grow 定义了子元素的尺寸增长因子，容器中除去子元素之和剩下的尺寸会按照各个子元素的 grow 值进行平分加大各个子元素上。

#### 4、flex-shrink: 定义了项目的缩小比例

```
.item {
    flex-shrink: <number>;
}
```
默认值: 1，即如果空间不足，该项目将缩小，负值对该属性无效。

如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。 

如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

#### 5、flex: flex-grow,flex-shrink和flex-basis的简写

```
.item{
    flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
} 
```
flex 的默认值是以上三个属性值的组合。假设以上三个属性同样取默认值，则 flex 的默认值是 0 1 auto。

有关快捷值：auto (1 1 auto) 和 none (0 0 auto)

**关于 flex 取值，还有许多特殊的情况，可以按以下来进行划分：**

(1) 当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：
```
.item {flex: 1;}
.item {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}
```

(2) 当 flex 取值为 0 时，对应的三个值分别为 0 1 0%
```
.item {
    flex: 0;
}
.item {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: 0%;
}
```
(3) 当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1，有如下等同情况（注意 0% 是一个百分比而不是一个非负数字）
```
.item-1 {flex: 0%;}
.item-1 {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}

.item-2 {flex: 24px;}
.item-2 {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 24px;
}
```
(4) 当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%，如下是等同的：
```
.item {flex: 2 3;}
.item {
    flex-grow: 2;
    flex-shrink: 3;
    flex-basis: 0%;
}
```
(5) 当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1，如下是等同的：
```
.item {flex: 11 32px;}
.item {
    flex-grow: 11;
    flex-shrink: 1;
    flex-basis: 32px;
}
```
> flex-shrink 和 flex-grow 只有一个能起作用，这其中的道理细想起来也很浅显：空间足够时，flex-grow 就有发挥的余地，而空间不足时，flex-shrink 就能起作用。当然，flex-wrap 的值为 wrap / wrap-reverse 时，表明可以换行，既然可以换行，一般情况下空间就总是足够的，flex-shrink 当然就不会起作用

#### 6、align-self:允许单个项目有与其他项目不一样的对齐方式

单个项目覆盖 align-items 定义的属性

默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。
```
.item {
     align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
这个跟 align-items 属性时一样的，只不过 align-self 是对单个项目生效的，而 align-items 则是对容器下的所有项目生效的。

### 推荐链接
* [30 分钟学会 Flex 布局](https://zhuanlan.zhihu.com/p/25303493)
* [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
* [Flex 布局示例](http://static.vgee.cn/static/index.html)