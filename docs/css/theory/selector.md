# CSS 选择器

// TODO

### 基础选择器

#### 通配符选择器

```css
* {
  margin: 0;
  padding: 0;
}
```

#### 类型（标签）选择器

```css
p {
  margin: 0;
  padding: 0;
}
```

#### 类选择器

```css
.title {
  margin: 0;
  padding: 0;
}
```

#### ID 选择器

```css
#app {
  margin: 0;
  padding: 0;
}
```

### 属性选择器

```html
<ul>
  <li><a href="normal">普通链接</a></li>
  <li><a href="#internal">内部链接</a></li>
  <li><a href="http ://example.com">错误链接</a></li>
  <li><a href="http://example.com">示例链接</a></li>
  <li><a href="#InSensitive">非敏感内部链接</a></li>
  <li><a href="http://example.org">示例 org 链接</a></li>
  <li><a href="https://example.org">示例 https org 链接</a></li>
  <li><a name="nolink">无连接</a></li>
  <li><a name="no-link">无连接有分割线</a></li>
</ul>
```

#### [attribute]

选中所有带 attribute 属性的元素

```css
/* 例如：把所有带 href 属性的元素设置字体颜色为紫色 */
[href] {
  color: purple;
}
```

#### [attribute=value]

选择带有 attribute 属性，且属性值为 value 的所有元素

```css
/* 例如：把 内部链接 的字体颜色设置为绿色 */
[href='#internal'] {
  color: green;
}
```

#### [attribute~=value]

选择带有 attribute 属性的元素，并且该属性的值是一个以空格为分隔的值列表，其中至少有一个值为 value

```css
/* 例如：把 错误链接 的字体颜色设置为黄色，因为它的属性值中的 http 后面有个空格 */
[href~='http'] {
  color: yellow;
}
```

#### [attribute^=value]

选择带有 attribute 属性，且属性值是以 value 开头的元素

```css
/* 例如：把 错误链接、示例链接、示例 org 链接、示例 https org 链接 设置背景色为灰色*/
[href^='http'] {
  background-color: grey;
}
```

#### [attribute$=value]

选择带有 attribute 属性，且属性值是以 value 结尾的元素

```css
/* 例如：把 示例 org 链接、示例 https org 链接 的字体颜色设置为白色 */
[href$='.org'] {
  color: white;
}
```

#### [attribute*=value]

选择带有 attribute 属性，且属性值包含至少一个 value 子串的元素

```css
/* 例如：把 内部链接 的背景色设置为粉色，因为它的 href 属性值为 #internal */
[href*='#in'] {
  background-color: pink;
}
```

#### [attribute|=value]

选择带有 attribute 属性的元素，属性值为 value （类似 [attribut=value]）或是以“value-”为前缀开头。典型应用场景是用来匹配语言简写代码（如 zh-CN、zh-TW 可以用 zh 作为 value）

```css
/* 例如：把 无连接有分隔线 的字体颜色设置为红色 */
[name|='no'] {
  color: red;
}
```

#### [attribute*=value i]

在任何一种属性选择器的右方括号前(可以使用空格分隔)添加一个字母 `i` (或 `I`)，可以在匹配属性值时忽略大小写

```css
[href*='#in'i] {
  text-decoration: initial;
}
```

#### 示例结果图示

![](./images/attribute-selector.png)

### 组合选择器

#### 后代选择器 aSelector bSelector

选择 aSelector 匹配的元素内部的所有 bSelector 匹配的元素

#### 子选择器 aSelector > bSelector

选择 aSelector 匹配的元素下直接子元素为 bSelector 匹配的元素

#### 相邻兄弟选择器 aSelector + bSelector

选择 aSelector 匹配的元素之后的紧跟的兄弟元素为 bSelector 匹配的元素

#### 一般兄弟选择器 aSelector ~ bSelector

选择 aSelector 匹配的元素之后的兄弟元素为 bSelector 匹配的元素

#### 复合选择器

多个基础选择器可以连起来使用，例如：

- h1.page-header
- div[data-title="abc"]

### 伪类选择器

#### :root

#### :nth-child()

```html
<content>
  <div>11111</div>
  <div>22222</div>
  <p class="special">33333</p>
  <p>44444</p>
  <div>55555</div>
  <div>66666</div>
  <div>77777</div>
  <div>88888</div>
  <div>99999</div>
  <div>10 10 10</div>
  <div>11 11 11</div>
  <div>12 12 12</div>
  <div>13 13 13</div>
  <div>14 14 14</div>
  <div>15 15 15</div>
  <div>16 16 16</div>
  <div>17 17 17</div>
  <div>18 18 18</div>
</content>
```

根据父元素的子元素列中的索引来选择元素，换言之，:nth-child() 选择器根据父元素下的**所有兄弟元素的位置**来选择子元素

**注意：元素的索引从 1 开始，但是 :nth-child(n) 中的 n 是从 0 开始的所有非负整数**

```css
/* 最普通的语法：把 content 元素下第 4 个子元素设置字体颜色为红色 */
content :nth-child(7) {
  color: red;
}
```

括号中的关键字除了能设置 n 之外，还可以设置：

- odd：表示元素在兄弟列表中的位置是奇数：1、3、5……
- even：表示元素在兄弟元素中的位置是偶数：2、4、6……
- An+B：表示元素在兄弟元素中的位置是 An+B，其中 n 为正整数或 0，A 和 B 为整数，且 A 不为 0。
  - A 是整数步长，注意这里说的是整数（正整数和负整数）
  - B 是整数偏移量

```css
/* 把 content 元素下的奇数位置的子元素设置字体颜色为绿色 */
content :nth-child(odd) {
  color: green;
}
/* 或者用 2n+1 选择，n是从0开始的*/
content :nth-child(2n + 1) {
  color: green;
}

/* 把 content 元素下的偶数位置的子元素设置字体颜色为红色 */
content :nth-child(even) {
  color: red;
}
/* 或者用 2n 选择，可能有疑问，2n 第一项应该是 0，但是子元素的索引是从1开始的，所以 0 被忽略了 */
content :nth-child(2n) {
  color: red;
}

/* 把 content 元素下的第七个及之后的子元素设置字体下划线*/
content :nth-child(n + 7) {
  text-decoration: underline;
}

/* 把 content 元素下的前 3 子元素设置红色边框*/
/* 这个额外解释一下： [=-0+3、-1+3、-2+3]，再往后就是0和负数了，就不会选中任何元素了*/
content :nth-child(-n + 3) {
  border: 1px solid red;
}
```

**注意：在 element:nth-child() 语法中，子元素的计数包括任何元素类型的兄弟子元素，并且只有当该索引位置上的元素与选择器的 element 部分匹配时，才被视为匹配**

```css
/* 第三个元素是 <p class="special">33333</p>，前面两个兄弟元素是 div */

/* 选择 content 元素下的第三个元素（也就是 p class="special"）设置背景色为粉色*/
content :nth-child(3) {
  background-color: pink;
}

/* 如果觉得要选中第一个 p 元素而设置 n 是 1 就是错误的，因为子元素的计数包括任何元素类型的兄弟子元素，所以第一个 p 的索引应该还是3 */
/* 错误 */
content p:nth-child(3) {
  background-color: pink;
}
/* 正确 */
content p:nth-child(3) {
  background-color: pink;
}
```

**注意：通过传递一个选择器参数 `of <selector>语法`，我们可以选择与该选择器匹配的第 n 个元素（这样计数就不包含其他元素类型的兄弟子元素了），跟 nth-of-type 一样的作用**

```css
/* 跟 content p:nth-child(3) 作用一样 */
content :nth-child(1 of p.special) {
  background-color: pink;
}
/* 选中子元素列表中的第 2 个 p 元素，它在所有类型的兄弟子元素中索引是 4 */
content :nth-child(2 of p) {
  background-color: grey;
}
```

可以查看另外一些明显示例：[MDN :nth-child()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)

#### :nth-of-type()

跟 :nth-child 的区别是，:nth-of-type 伪类是基于相同类型（标签名称）的兄弟元素中的位置来匹配元素

#### element:first-child

#### element:first-of-type

#### element:last-child

#### element:last-of-type

#### :nth-last-child(n)

#### element:nth-last-of-type(n)

#### :only-child

#### element:only-of-type

#### element:empty()

#### a:link

#### a:active

#### a:hover

#### a:visited

#### :focus

#### :enabled/:disabled

#### :checked

### 伪元素选择器

#### element::before

#### element::after

#### element::first-letter

#### element::first-line

#### ::section

### 逻辑选择器

其实是一些函数式伪类，这些伪类接受可容错选择器列表作为参数

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Selector_list#%E5%8F%AF%E5%AE%B9%E9%94%99%E9%80%89%E6%8B%A9%E5%99%A8%E5%88%97%E8%A1%A8

#### :is()

#### :not(selector)

#### :has()

#### :where()

## CSS 的命名空间？

## 什么是 CSS 选择器权重以及它如何工作？

## 为什么浏览器从右到左匹配 CSS 选择器？

首先我们要看一下选择器的`解析`是在何时进行的。

浏览器渲染的过程大概如下：

HTML 经过解析生成 DOM Tree；而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。Render Tree 中的元素（Webkit 中称为 `renderers`，Firefox 中称为 `frames`）与 DOM 元素相对应，但非一一对应：一个 DOM 元素可能会对应多个 renderer，如文本折行后，不同的**行**会成为 Render Tree 中不同的 renderer。也有的 DOM 元素被 Render Tree 完全无视，比如 display:none;元素。

在建立 Render Tree 时（Webkit 中的 `Attachment` 过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 renderer。对于每个 DOM 元素，必须在所有 Style Rules 中找到符合的 selector 并将对应的规则进行合并。选择器`解析`实际是在这里执行的，在遍历 DOM Tree 时，从 Style Rules 中去寻找对应的 selector。

因为所有样式规则可能数量很大，而且绝大多数不会匹配到当前的 DOM 元素（因为数量很大所以一般会建立规则索引树），所以有一个快速的方法来判断**这个 selector 不匹配当前元素**就是及其重要的。

如果正向解析，例如 `div div p em`，我们首先就要检查当前元素到 html 的整条路径，找到最上层的 div，再往下找，如果遇到不匹配就必须回到最上层的那个 div，往下再去匹配选择器中的第一个 div，回溯若干次才能确定匹配与否，效率很低。

逆向匹配则不同，如果当前的 DOM 元素是 div，而不是 selector 最后的 em，那只要一步就能排除。只有在匹配时，才会不断向上找父节点进行验证。

但因为匹配的情况远远低于不匹配的情况，所以逆向匹配带来的优势是巨大的。同时我们也能够看出，在选择器结尾加上 `*` 就大大降低了这种优势，这也就是很多优化原则提到的尽量避免在选择器末尾添加通配符的原因。

## 什么是 切片（sectioning） 算法？
