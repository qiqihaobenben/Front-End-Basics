# CSS 基础概念

## 基本发展史

- CSS1：解决网页排版布局和装饰问题，是第一个有“层叠（cascading）”概念的语言
- CSS2：表现和内容分离
- CSS2.1：对 CSS2 的修正、扩展，代替 CSS2
- CSS3：规范模块化发展，样式丰富、酷炫，提高网站的可维护性以及性能速度

CSS3 的模块化发展是一种组织方式，旨在使 CSS 更加灵活、可扩展、并易于维护。在 CSS3 之前，CSS 规范是作为一个大的单一文档发布的。随着 Web 技术的发展和需求的增加，CSS3 采用了模块化方法，将不同的功能划分为独立的模块。这样，每个模块可以单独开发和更新，而不影响其他模块。这也使得浏览器开发商可以选择性地实现某些模块，而不是整个 CSS 规范。

## 层叠样式表

CSS - Cascading Style Sheets

style sheets 样式表，是规则声明的集合，集合中重复使用相同的规则声明就会产生冲突，cascading 层叠就是解决冲突的策略。

决定规则声明生效（或者说样式生效）的层叠三大规则：1、样式表来源 > 2、选择器优先级 > 3、源码位置

如果通过样式表来源就能确定哪个规则生效，就不需要再看选择器和源码位置了。

### 1、样式表来源

用户代理样式表（浏览器内置默认样式）< 用户样式表（很少有这个设置）< 作者样式表（开发者写的样式）< 作者样式表中 !important < 用户样式表中的 !important < 用户代理样式表中的 !important

### 2、选择器优先级

内联 > id > class = attribute = pseudo-class > type = pseudo-element

需要注意一些新的选择器，:is() :not() :has() 本身不计入优先级，以参数中最高的优先级为准，:where() 优先级是 0

### 3、源码位置

谁最后声明的谁生效

- 对于 @import 的样式，按照 @import 的顺序
- 对于 link 引入和 style 标签内的样式，根据在 document 中的顺序决定

### 基于层叠概念引申的 CSS 代码好的实践

基于灵活性、可扩展性和可维护性考虑：

1. 选择器尽量少用 id
2. 尽量不要用 !important
3. 自己的样式加载放到引用库样式的后面

## 全局关键字

`inherit`、`initial`、`unset` 和 `revert` 都是 CSS 全局关键字，指的是所有的 CSS 属性都可以使用这几个关键字作为属性值。

### inherit

inherit 关键字可以让元素的属性继承父元素。从 IE8 开始支持。

### initial 关键字

initial 关键字可以让元素的属性改为初始值，例如 `display:initial;` 就会初始为 `inline`，`font-size:initial;` 就会初始为 `medium`。

实际用途：需要重置某些 CSS 样式，但是不知道默认初始值是什么的时候，可以设置 `initial`

CSS `initial` 关键字将属性的初始值（默认值）应用于元素。它可以应用于任何 CSS 属性，包括 `all`，`initial` 可用于将所有 CSS 属性恢复到其初始状态。

**需要注意有一个误区：`initial` 关键字代表的是 CSS 属性的初始值，而不是浏览器设置的元素的初始值。如果想要重置为浏览器设置的元素的初始值，，应该使用全局关键字 `revert`**

#### CSS 属性的初始值

CSS 属性的初始值就是默认值，初始值的使用取决于属性是否被继承。

在 CSS 中，每个 CSS 属性定义的概述都指出了这个属性是默认继承的还是默认不继承的。这决定了当你没有为元素的属性指定值时该如何计算值。

### unset

unset 关键字表示不固定值，如果是具有继承属性的 CSS 属性，如 `color`，则使用继承值 `inherit`，如果是不能继承的 CSS 属性，如 `background-color`，则使用初始值 `initial`。

它可以应用于任何 CSS 属性，包括 CSS 简写属性 `all`，个人认为 `all: unset;` 可以方便快捷的重置某个选择器设置的不清楚来源的样式（例如第三方库的样式）。

### revert

revert 关键字可以让元素的样式还原成浏览器的内置的样式，就是还原。

## 继承属性和非继承属性

##### 继承属性

对于继承属性，初始值只能被用于没有指定值的**根元素**上。

没有指定值时，则取父元素的同属性计算值。

**注意：在继承属性上避免使用 `initial`关键字，如果想重置继承属性的默认值，可以使用 `inherit`,`unset`,`revert` 关键字代替。**

继承属性主要与文本格式和列表格式有关。以下是一些常见的继承属性：

1. **文本相关属性**：

   - `color`
   - `font-family`
   - `font-size`
   - `font-style`
   - `font-variant`（用于设置文本的小型大写字母样式。）
   - `font-weight`
   - `line-height`
   - `text-align`
   - `text-indent`
   - `text-transform`（控制文本的大小写转换）
   - `letter-spacing`
   - `white-space`（控制元素中的空白（如空格和换行符）的处理方式。）
   - `word-spacing`

2. **列表相关属性**：

   - `list-style`
   - `list-style-type`
   - `list-style-position`
   - `list-style-image`

3. **其他**：
   - `visibility`（不同于 `display`，`visibility` 是继承的）
   - `cursor`
   - `quotes`

##### 非继承属性

非继承属性，初始值可以被用于**任意**没有指定值的元素上。

当元素的一个非继承属性没有指定值时，则取属性的初始值。

非继承属性通常涉及布局和盒模型等。以下是一些常见的非继承属性：

1. **盒模型相关属性**：

   - `width`
   - `height`
   - `margin`
   - `padding`
   - `border`
   - `box-sizing`

2. **背景和颜色**：

   - `background`
   - `background-color`
   - `background-image`
   - `background-repeat`
   - `background-position`
   - `background-size`
   - `background-attachment`

3. **布局相关属性**：

   - `display`
   - `position`
   - `top`
   - `right`
   - `bottom`
   - `left`
   - `float`
   - `clear`
   - `overflow`
   - `z-index`

4. **其他**：
   - `border-collapse`
   - `border-spacing`
   - `table-layout`
   - `vertical-align`
   - `text-decoration`

**虽然是非继承属性，但是允许使用 `inherit` 关键字显式的声明继承性，它对继承和非继承属性都生效。可以使用 all 简写属性，一次控制所有属性的继承。**

### all

CSS 的 all 简写属性可以将除却 `unicode-bidi` 与 `direction` 之外的所有属性重设至其初始值或继承值。

#### all:unset

设置为 unset ，会有两种情况：

1. 如果元素的属性的值是可继承的，则改变该元素所有属性的值为父元素的属性值
2. 如果元素的属性的值是不可继承的，则改变为初始值，例如 display 属性是不可继承的，就会改变为初始值 inline。

#### all:initial

设置为 initial，表示该元素的所有属性改变为初始值

#### all:inherit

设置为 inherit，表示该元素的所有属性的值改变为父元素的属性值。

#### all:revert

谁知为 revert，表示该元素的用户设置的样式还原为浏览器的内置样式。**注意：前面三个是所有样式，这个实际表现就只是把用户设置的样式还原。**

## CSS 的值和单位

### 值

- 文字类：例如 initial 关键字、颜色、位置等
- 数值类：例如 z-index:1 这种数值，或者带有单位的数值、百分比等
- 函数生成：例如 calc()、min()、max()等

### 单位

- 长度：
  - 绝对长度：px pt cm in
  - 相对响度：em rem ex rex.. vw vh wmin vmax...
- 角度：deg grad turn rad
- 时间：s ms
- 分辨率：dpi dpcm dppx

## 简写属性

简写属性是可以同时设置好几个 CSS 属性值的 CSS 属性。目的在于将那些关于同一主题的常见属性的定义集中在一起，编写更简洁、更具可读性的样式表，节省时间和精力。

简写的属性包括：

- `background`
- `font`
- `border`
- `margin`
- `padding`
- `all`

### 注意

1. 简写属性中没有指定的值会被设置为它的默认值，所以这就意味着它将会覆盖之前设置的值，例如下面的代码：

```css
/* background 的 color 虽然设置为 red，但是因为 background 简写属性没有指定 background-color 的值，所以就是默认的 transparent，red 就会被覆盖*/
background-color: red;
background: url(images/bg.gif) no-repeat top right;
```

2. 关键字 inherit 只可以应用于单独属性，如果应用于一个简写属性，则必须整体应用，这意味着让一个属性的值显式使用继承值的唯一方法就是使用值是 inherit 的普通属性。

3. 简写属性不试图强制它们替代属性的值的特定顺序。不过这只适用于这些属性使用不同类型的值时，因为这个时候顺序并不重要。但当几个属性可以设置相同的值的时候，就需要按照特定规则，例如 `margin: 10px;` 和 `margin: 10px 20px;`

## 推荐文章

- [图解 CSS：揭开 CSS 的面纱](https://mp.weixin.qq.com/s/ZY3qyPeiljd6lbRzanqleQ)
