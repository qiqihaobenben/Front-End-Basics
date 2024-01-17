# Grid 网格布局

## flex 和 grid 的区别

flex 布局是轴导向的，要么是横轴要么竖轴，最多就是可以换行相当于又多了一条轴，因为它的布局只针对于轴线位置，所以把它看做是一维布局。flex 的兼容性更高哦。

grid 布局是将 "容器" 划分成表格一样的 "行" 和 "列" ，生成单元格，然后指定 "项目" 所在的单元格，这样就可以把它看作是二维布局。grid 在 2017 年之后的的浏览器版本普遍支持。

### 如何决定一个布局应该用 flex 还是 grid？

如果容器内所有子项都是内联展示的（小面积或组件中，或者 Grid item 内部，例如导航栏），使用 flex 布局可能比较好。

如果容器内有明显的行和列的区分（大面积或整体布局），使用 grid 布局可能比较好。

## Grid 基本概念

- 网格容器：最外层父元素，就是设置 display: grid; 或者 display: inline-grid; 的元素；
- 网格项：网格容器的直接子元素；
- 行：容器内部的水平区域被称为"行"；
- 列：容器内部的垂直区域被称为"列"；
- 单元格：两条相邻的列网格线和两条相邻的行网格线组成是的网格单元，n 行和 m 列会产生 n \* m 个单元格。它是网格的单个单元，也是最小单元；
- 网格线：划分单元格的线被称为网格线，垂直的被称为垂直网格线，水平的被称为水平网格线，n 行就有 n + 1 根水平网格线，m 列 就有 m + 1 根垂直网格线；

## 容器属性

### grid-template-columns

指定网格容器中所需的列数以及每列的宽度

- px：grid-template-columns: 100px 100px 100px; 3 列列宽都是 100px；
- 百分比：grid-template-columns: 33.3% 33.3% 33.3%; 3 列列宽都是 33.3%；
- repeat()函数：repeat(3, 33.33%); 3 列列宽都是 33.3%。repeat 接受两个参数，第一个参数是重复次数，第二个参数是要重复的值也可以是某种模式。repeat(2, 100px 200px 300px) 就是 6 列，1、4 列 100px，2、5 列 200px，3、6 列 300px；
- auto-fill 关键字：repeat(auto-fill, 100px) 函数一起使用，尽可能多的容纳项目自动填充；
- fr 关键字：grid-template-columns: 1fr 2fr; 后者列宽是前者列宽两倍；
- minmax()函数：grid-template-columns: 1fr minmax(100px 2fr);接受两个参数，最小值和最大值；
- auto 关键字：由浏览器自己决定长度；

### grid-template-rows

指定网格容器中每一行的高度，属性值的设置跟 grid-template-columns 类似。

### grid-template-areas

定义网格区域，一个区域由单个或多个单元格组成。

每一个给定的字符串会生成一行，一个字符串中用空格分隔的每一个单元 (cell) 会生成一列。多个同名的，跨越相邻行或列的单元格称为网格区域 (grid area)。非矩形的网格区域是无效的。

```css
grid-template-areas:
  'head head'
  'nav  main'
  'nav  foot'; /* 区域划分 当前为 三行 两列 */
```

grid-template-areas 属性的使用规则如下：

- 需要填满网格的每个格子
- 对于某个横跨多个格子的元素，重复写上那个元素 grid-area 属性定义的区域名字
- 所有名字只能出现在一个连续的区域，不能在不同的位置出现
- 一个连续的区域必须是一个矩形
- 使用`.`符号，让一个格子留空

### grid-template

grid-template 属性是 grid-template-columns、grid-template-rows、grid-template-areas 这三个属性的合并简写形式

例如：grid-template-rows/grid-template-columns：将 grid-template-rows 和 grid-template-columns 设为指定值，而 grid-template-areas 设置为 none。

### row-gap

设置元素行之间的间隔（gutter）大小

### column-gap

设置元素列之间的间隔（gutter）大小

### gap

设置网格中的元素行与列的间隔，该属性是 row-gap 和 column-gap 的简写形式

`gap: <row-gap> <column-gap>` 其中 `<column-gap>` 是一个可选值，如果省略，则设置为与 `<row-gap>` 相同的值。

### justify-items

设置单元格内容水平位置（左中右）

- start：对齐单元格的起始边缘；
- end：对齐单元格的结束边缘；
- center：单元格内部居中；
- stretch：拉伸，占满单元格的整个宽度（默认值）；

### align-items

设置单元格内容的垂直位置（上中下），属性值跟 justify-items 相同

### place-items

`place-items: <align-items> <justify-items>;` 是合并简写形式（省略第二个值就代表两个属性设置相同）

### justify-content

设置网格项在网格容器里面的沿水平方向的排列方式

- start：对齐容器的起始边框；
- end：对齐容器的结束边框；
- center：容器内部居中；
- stretch：项目大小没有指定时，拉伸占据整个网格容器；
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍；
- space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔；
- space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔；

### align-content

设置网格项在网格容器里面的沿垂直方向的排列防水

### place-content

`place-content: <align-content> <justify-content>;` 是合并简写形式（省略第二个值就代表两个属性设置相同）。

### grid-auto-rows 和 grid-auto-columns

有时候会出现网格项超出了网格容器设置的行或列，例如一个网格只有 3 行，然后有些网格项要放在第 5 行，这是就需要属性来让浏览器生成多余的行或列以便防止网格项超出，也就是所谓的隐式网格。

隐式网格是当「网格项被放到已定义的网格外」或「网格项的数量多于网格的数量」时才会自动生成

grid-auto-columns、grid-auto-rows 属性是用来设置创建多余行和列的列宽和行高的。使用方法与 grid-template-columns、grid-template-rows 相同。

### grid-auto-flow

控制子项目在网格容器中如何自动排列

- row：项目的放置顺序先行后列；（默认）
- column：项目的放置顺序先列后行；
- dense：所谓的密集堆积算法，如果后面出现了稍小的元素，则会试图去填充网格中前面留下的空白。这样做会填上稍大元素留下的空白，但同时也可能导致原来出现的次序被打乱。
- row dense：项目的放置顺序先行后列并尽可能紧密填满，尽量不出现空格；
- column dense：项目的放置顺序先列后行并尽可能紧密填满，尽量不出现空格；

### grid

grid 属性是 grid-template-rows、grid-template-columns、grid-template-areas、grid-auto-rows、grid-auto-columns、grid-auto-flow 这六个属性的合并简写形式。

**不建议使用 grid-template 和 grid 因为易读性太差了。**

## 网格项属性

### grid-column-start、grid-column-end 和 grid-row-start、grid-row-end

指定网格项所在容器的位置，从哪根网格线开始到哪根网格线结束。

- grid-column-start：左边框所在的垂直网格线；grid-column-start: 1；
- grid-column-end：右边框所在的垂直网格线；grid-column-end: 3；
- grid-row-start：上边框所在的水平网格线；grid-row-start: 2；
- grid-row-end：下边框所在的水平网格线；grid-row-end: 4；
- **span 关键字：grid-column-end: span 2; 跨越两个网格，span 是指跨越了多少个网格；**

### 注意：

- 如果因为指定所在位置后项目产生重叠就使用 z-index 来指定项目的层级关系。

- 还可以使用负数来指定分隔线，-n 就代表倒数第 n 条网格线。有时候我们不好确定列数，但又想定位到最后一列，这就可以考虑使用负数网格线了。例如：

```css
.header {
  grid-column-start: 1;
  grid-column-end: -1;
}
```

如果 grid-column-start 为负值，记得计数是从单元格的左侧网格线开始。

- grid-column-start 和 grid-column-end 成对出现时，结束值不是必须要大于开始值。

```css
.header {
  grid-column-start: 2;
  grid-column-end: 5;
}
/* 上下两者等价 */
.header {
  grid-column-start: 5;
  grid-column-end: 2;
}
```

### grid-column、grid-row

grid-column 是 grid-column-start、grid-column-end 的合并简写形式

grid-row 是 grid-row-start、grid-row-end 的合并简写形式。

`grid-column: <start-line> / <end-line>;`
`grid-row: <start-line> / <end-line>;`

### grid-area

指定网格项在哪一个区域，区域怎么划分是由 grid-template-areas 指定的。

还可以使用 grid-area 来一次性指定所有的行/列序号：`<grid-row-start> / <grid-column-start> / <grid-row-end> / <grid-column-end>`，也就是先指定开始坐标的行/列序号，再指定结束坐标的行/列序号。

### justify-self

设置单元格内容的水平位置（左中右）

- start：对齐单元格的起始边缘；
- end：对齐单元格的结束边缘；
- center：单元格内部居中；
- stretch：拉伸，占满单元格的整个宽度（默认值）；

### align-self

设置单元格内容的垂直位置（上中下）

### place-self

`place-self: <align-self> <justify-self>;` 是合并简写形式（省略第二个值就代表两个属性设置相同）。

## 新单位

除了非负 CSS 长度值（例如 px、rem、vw 和百分比 ( %) ）之外，我们还可以使用特殊的单位和关键字来控制网格中网格项的大小。

### fr

fr 单位是“fractional”（分数）的缩写，是 CSS 网格布局中引入的长度单位。它代表网格容器中可用空间的一部分。这使它成为定义响应列和行的理想单位，这些列和行将随着浏览器的视口缩小和增大而缩放。

### min-content

min-content 是一个用于调整大小的关键字，对于网格列来说，它将网格列的宽度设置为最小内容宽度，通常是网格项中最小内容或文本的大小。对于网格行来说就是行的高度设置为最小内容高度。

### max-content

max-content 关键字的效果与 min-content 相反

## CSS 函数

### repeat()

repeat() 函数表示轨道列表的重复片段，允许以更紧凑的形式写入大量显示重复模式的列或行。

该函数有两个参数：

- 第一个参数用来指定行或列的重复模式重复的次数，有三种取值方式：

  - `<number>`：整数，确切的重复次数。
  - `<auto-fill>`：以网格项为准自动填充。
  - `<auto-fit>`：以网格容器为准自动填充。

- 第二个参数用来指定行或列的重复模式重复的内容，有以下取值方式：

- `<length>`：非负长度。
- `<percentage>`：相对于列轨道中网格容器的内联大小的非负百分比，以及行轨道中网格容器的块长宽。
- `<flex>`：单位为 fr 的非负长度，指定轨道弹性布局的系数值。
- max-content：表示网格的轨道长度自适应内容最大的那个单元格。
- min-content：表示网格的轨道长度自适应内容最小的那个单元格。
- auto：作为最大值时，等价于 max-content。作为最小值时，它表示轨道中单元格最小长宽(min-width/min-height)的最大值。

### minmax()

minmax() 函数允许我们指定网格轨道的最小和最大尺寸，它是一个长宽范围的闭区间。当网格在视口中调整大小时，网格轨道将在该范围内增长和缩小。在较小的屏幕上，它会缩小直到达到最小尺寸。在更大的屏幕上，它会拉伸直到达到最大尺寸。

minmax() 函数接受 CSS Grid 大小单位、关键字、长度和百分比值。其有两个参数：

- min：轨道的最小尺寸。
- max：轨道的最大尺寸。

### fit-content()

fit-content() 函数的操作类似于 minmax() 函数。 不同之处在于，使用 fit-content() 时，最小值是网格项中内容的大小，最大值是我们传递给它的值。这样就可以将内容设置为最小值，并根据需要将其放大到某个值。

当应用于网格轨道时，设置的最小宽度是其网格项目中最小的内容或文本的大小。需要注意的是，最小的内容或文本大小不大于函数中指定的值。

但是，如果最小宽度的值超过了提供给函数的值，则网格轨道的大小将设置为传递给 fit-content() 函数的值，并且网格项的内容将换行。

## 注意事项

### 当元素设置了网格布局，column、float、clear、vertical-align 属性都会失效。

### 默认对齐方式为拉伸

当一个元素变成网格单元时，默认的行为是拉伸铺满其网格区域；

## 网格布局生成工具

- [CSS Layout Generator](https://layout.bradwoods.io/)
- [Griddy](https://griddy.io/)
- [Grid LayoutIt](https://grid.layoutit.com/)

## 推荐文章

- [Grid Garden——一款边学边玩的小游戏](https://codepip.com/games/grid-garden/#zh-cn)
- [简明 CSS Grid 布局教程](https://mp.weixin.qq.com/s/AUIGC7C_TYhDNg_ADlZ7Pg)
- [见微知著-css 布局天花板 Grid](https://mp.weixin.qq.com/s/F8xUZZSal07HCc1yH3CDhg)
- [图解 CSS Grid 布局](https://juejin.cn/post/7160485893810667534)
- [CSS Grid 布局的秘密](https://mp.weixin.qq.com/s/jykFJjxIjw8WTUTvFz__jg)
- [欢迎你 Grid Layout](https://zhuanlan.zhihu.com/p/26259608)
- [Keep the Footer at the Bottom: Flexbox vs. Grid](https://moderncss.dev/keep-the-footer-at-the-bottom-flexbox-vs-grid/)
- [Grid for layout, Flexbox for components](https://ishadeed.com/article/grid-layout-flexbox-components/)
