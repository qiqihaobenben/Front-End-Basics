(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{387:function(t,e,a){t.exports=a.p+"assets/img/1.6f0f2069.jpg"},543:function(t,e,a){"use strict";a.r(e);var l=a(45),s=Object(l.a)({},(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[l("h1",{attrs:{id:"flex-弹性布局"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#flex-弹性布局"}},[t._v("#")]),t._v(" Flex 弹性布局")]),t._v(" "),l("h2",{attrs:{id:"简介"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#简介"}},[t._v("#")]),t._v(" 简介")]),t._v(" "),l("p",[t._v("CSS 弹性盒子布局（Flexible Box Layout）定义了一种优化的 CSS 盒子模型，提供了更加高效灵活的布局方式，在即便是宽高未知的情况下，也能排列和分割盒子内部的空间，而且在不同布局方向（横向/纵向）的调整更加灵活。")]),t._v(" "),l("p",[t._v("在弹性布局模型中，弹性容器的子元素可以在任何方向上排布，也可以“弹性伸缩”其尺寸，既可以增加尺寸以填满未使用的空间，也可以收缩尺寸以避免从父元素溢出。子元素的水平对齐和垂直对齐都能很方便的进行操控。")]),t._v(" "),l("p",[t._v("在 flex 容器中默认存在两条轴，水平主轴(main axis) 和垂直的交叉轴(cross axis)，这是默认的设置，但是可以更改，所以不能一概认为宽度就是主轴，垂直就是侧轴，需要根据 "),l("code",[t._v("flex-direction")]),t._v(" 来判断。")]),t._v(" "),l("p",[t._v("在 flex 容器中的每个子元素被称为 flex item 占据的主轴空间为 (main size), 占据的交叉轴的空间为 (cross size)。\n如下图：")]),t._v(" "),l("p",[l("img",{attrs:{src:a(387),alt:"图示"}})]),t._v(" "),l("h2",{attrs:{id:"flex-容器"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#flex-容器"}},[t._v("#")]),t._v(" flex 容器")]),t._v(" "),l("p",[t._v("实现 flex 布局首先指定一个容器。")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    display: flex; //块级盒子\n}\n.container {\n    display: inline-flex; //行内盒子\n}\n")])])]),l("p",[l("strong",[t._v("注意：")]),t._v(" 容器设置 flex 布局后，子元素的 "),l("code",[t._v("float")]),t._v(" 、"),l("code",[t._v("clear")]),t._v(" 、"),l("code",[t._v("vertical-align")]),t._v(" 属性将会失效。")]),t._v(" "),l("h2",{attrs:{id:"设置在容器上的属性"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#设置在容器上的属性"}},[t._v("#")]),t._v(" 设置在容器上的属性")]),t._v(" "),l("ol",[l("li",[t._v("flex-direction")]),t._v(" "),l("li",[t._v("flex-wrap")]),t._v(" "),l("li",[t._v("flex-flow")]),t._v(" "),l("li",[t._v("justify-content")]),t._v(" "),l("li",[t._v("align-items")]),t._v(" "),l("li",[t._v("align-content")])]),t._v(" "),l("h3",{attrs:{id:"_1、flex-direction-决定主轴的方向-即项目的排列方向"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_1、flex-direction-决定主轴的方向-即项目的排列方向"}},[t._v("#")]),t._v(" 1、flex-direction: 决定主轴的方向（即项目的排列方向）")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    flex-direction: row | row-reverse | column | column-reverse;\n}\n")])])]),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"center"}},[t._v("属性值")]),t._v(" "),l("th",{staticStyle:{"text-align":"center"}},[t._v("描述")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("row(默认)")]),t._v(" "),l("td",{staticStyle:{"text-align":"center"}},[t._v("指定主轴水平, 子项目从左至右排列 ➜")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("row-reverse")]),t._v(" "),l("td",{staticStyle:{"text-align":"center"}},[t._v("指定主轴水平，子项目从右向左排列 ⬅︎")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("column")]),t._v(" "),l("td",{staticStyle:{"text-align":"center"}},[t._v("指定主轴垂直，子项目从上至下排列 ⬇︎")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("column-reverse")]),t._v(" "),l("td",{staticStyle:{"text-align":"center"}},[t._v("指定主轴垂直，子项目从下往上排列 ⬆︎")])])])]),t._v(" "),l("h3",{attrs:{id:"_2、flex-wrap-决定容器内子元素是否可换行"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_2、flex-wrap-决定容器内子元素是否可换行"}},[t._v("#")]),t._v(" 2、flex-wrap：决定容器内子元素是否可换行")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    flex-wrap: no-wrap | wrap | wrap-reverse;\n}\n")])])]),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"center"}},[t._v("属性值")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("no-wrap(默认值)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("默认不换行,即当主轴尺寸固定时，当空间不足时，项目尺寸会随之调整(缩小)而并不会挤到下一行。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("wrap")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("正常换行")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("wrap-reverse")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("换行，第一行在下方")])])])]),t._v(" "),l("h3",{attrs:{id:"_3、flex-flow-flex-direction-和-flex-wrap-的简写形式"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_3、flex-flow-flex-direction-和-flex-wrap-的简写形式"}},[t._v("#")]),t._v(" 3、flex-flow: flex-direction 和 flex-wrap 的简写形式")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    flex-flow: <flex-direction> || <flex-wrap>;\n}\n默认值为: row nowrap\n")])])]),l("h3",{attrs:{id:"_4、justify-content-定义了子元素在主轴上的排列方式"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_4、justify-content-定义了子元素在主轴上的排列方式"}},[t._v("#")]),t._v(" 4、justify-content: 定义了子元素在主轴上的排列方式")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    justify-content: flex-start | flex-end | center | space-between | space-around;\n}\n")])])]),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"center"}},[t._v("属性值")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-start")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("子项目起始位置与 main start 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-end")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("子项目末尾位置与 main end 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("center")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("在主轴方向居中于容器")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("space-between")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("两端对齐，项目之间的间隔相等，即剩余空间等分成间隙")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("space-around")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("每个项目两侧的间隔相等，所以项目之间的间隔比项目与边缘的间隔大一倍")])])])]),t._v(" "),l("h3",{attrs:{id:"_5、align-items-定义了子元素在交叉轴上的对齐方式"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_5、align-items-定义了子元素在交叉轴上的对齐方式"}},[t._v("#")]),t._v(" 5、align-items: 定义了子元素在交叉轴上的对齐方式")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    align-items: flex-start | flex-end | center | baseline | stretch;\n}\n")])])]),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"center"}},[t._v("属性值")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-start")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("子项目起始位置与 cross start 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-end")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("子项目末尾位置与 cross end 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("center")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("在交叉轴方向居中于容器")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("baseline")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("第一行文字的基线对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("stretch(默认)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("高度未定(或 auto)时, 将占满容器的高度")])])])]),t._v(" "),l("h3",{attrs:{id:"_6、align-content-定义了交叉轴方向多根轴线的布局方式-多行子元素-如果项目只有一根轴线-那么该属性将不起作用"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_6、align-content-定义了交叉轴方向多根轴线的布局方式-多行子元素-如果项目只有一根轴线-那么该属性将不起作用"}},[t._v("#")]),t._v(" 6、align-content: 定义了交叉轴方向多根轴线的布局方式（多行子元素），如果项目只有一根轴线，那么该属性将不起作用")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".container {\n    align-content: flex-start | flex-end | center | space-between | space-around | stretch;\n}\n")])])]),l("p",[t._v("当你 "),l("code",[t._v("flex-wrap")]),t._v(" 设置为 "),l("code",[t._v("nowrap")]),t._v(" 的时候，容器仅存在一根轴线，因为项目不会换行，就不会产生多条轴线。")]),t._v(" "),l("p",[t._v("当你 "),l("code",[t._v("flex-wrap")]),t._v(" 设置为 "),l("code",[t._v("wrap")]),t._v(" 的时候，容器可能会出现多条轴线，这时候你就需要去设置多条轴线之间的对齐方式了。")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"center"}},[t._v("属性值")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-start")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("顶部与 cross start 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("flex-end")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("底部与 cross end 位置对齐")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("center")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("在交叉轴方向居中于容器")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("space-between")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("与交叉轴两端对齐, 间隔全部相等")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("space-around")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("每个轴线两侧的间隔相等，所以轴线之间的间隔比轴线与边缘的间隔大一倍。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"center"}},[t._v("stretch")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("多根主轴上的子项目充满交叉轴")])])])]),t._v(" "),l("h3",{attrs:{id:"_7、gap-以明确的值设定子元素间的间隔"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_7、gap-以明确的值设定子元素间的间隔"}},[t._v("#")]),t._v(" 7、gap：以明确的值设定子元素间的间隔")]),t._v(" "),l("p",[l("code",[t._v("gap: <row-gap> <column-gap>;")])]),t._v(" "),l("h2",{attrs:{id:"设置在-flex-item-上的属性"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#设置在-flex-item-上的属性"}},[t._v("#")]),t._v(" 设置在 flex item 上的属性")]),t._v(" "),l("ol",[l("li",[t._v("order")]),t._v(" "),l("li",[t._v("flex-basis")]),t._v(" "),l("li",[t._v("flex-grow")]),t._v(" "),l("li",[t._v("flex-shrink")]),t._v(" "),l("li",[t._v("flex")]),t._v(" "),l("li",[t._v("align-self")])]),t._v(" "),l("h3",{attrs:{id:"_1、order-定义子元素在容器中的排列顺序-数值越小-排列越靠前-默认值为-0"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_1、order-定义子元素在容器中的排列顺序-数值越小-排列越靠前-默认值为-0"}},[t._v("#")]),t._v(" 1、order: 定义子元素在容器中的排列顺序，数值越小，排列越靠前，默认值为 0")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n    order: <integer>;\n}\n")])])]),l("h3",{attrs:{id:"_2、flex-basis-定义了在分配多余空间之前-子元素占据的主轴空间-简单说就是子元素未缩放前的大小。浏览器根据这个属性-计算主轴是否有多余空间"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_2、flex-basis-定义了在分配多余空间之前-子元素占据的主轴空间-简单说就是子元素未缩放前的大小。浏览器根据这个属性-计算主轴是否有多余空间"}},[t._v("#")]),t._v(" 2、flex-basis: 定义了在分配多余空间之前，子元素占据的主轴空间，简单说就是子元素未缩放前的大小。浏览器根据这个属性，计算主轴是否有多余空间")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n    flex-basis: <length> | auto;\n}\n")])])]),l("p",[t._v("默认值：auto，即子元素本来的大小, 这时候 item 的宽高取决于 width 或 height 的值。")]),t._v(" "),l("p",[t._v("当 "),l("code",[t._v("flex-basis")]),t._v(" 值为 0 时，是把该项目视为零尺寸的，故即使声明该尺寸为 140px，也并没有什么用。")]),t._v(" "),l("p",[t._v("当 "),l("code",[t._v("flex-basis")]),t._v(" 值为 auto 时，则根据尺寸的设定值(假如为 100px)，则这 100px 就为项目的大小。")]),t._v(" "),l("h3",{attrs:{id:"_3、flex-grow-定义有剩余空间时-子元素的放大比例"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_3、flex-grow-定义有剩余空间时-子元素的放大比例"}},[t._v("#")]),t._v(" 3、flex-grow: 定义有剩余空间时，子元素的放大比例")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n    flex-grow: <number>;\n}\n")])])]),l("p",[t._v("默认值为 0，即如果存在剩余空间，也不放大。")]),t._v(" "),l("p",[t._v("当所有的项目都以 "),l("code",[t._v("flex-basis")]),t._v(" 的值进行排列后，仍有剩余空间，那么这时候 "),l("code",[t._v("flex-grow")]),t._v(" 就会发挥作用了。")]),t._v(" "),l("p",[t._v("如果所有项目的 "),l("code",[t._v("flex-grow")]),t._v(" 属性都为 1，则它们将等分剩余空间。(如果有的话)")]),t._v(" "),l("p",[t._v("如果一个项目的 "),l("code",[t._v("flex-grow")]),t._v(" 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。")]),t._v(" "),l("p",[t._v("当然如果当所有项目以 "),l("code",[t._v("flex-basis")]),t._v(" 的值排列完后发现空间不够了，且 "),l("code",[t._v("flex-wrap：nowrap")]),t._v(" 时，此时 "),l("code",[t._v("flex-grow")]),t._v(" 则不起作用了，这时候就需要"),l("code",[t._v("flex-shrink")]),t._v(" 这个属性。")]),t._v(" "),l("p",[t._v("grow 在 flex 容器下的子元素的 宽度和 比容器小的时候起作用。 grow 定义了子元素的尺寸增长因子，容器中除去子元素之和剩下的尺寸会按照各个子元素的 grow 值进行平分加到各个子元素上。")]),t._v(" "),l("h3",{attrs:{id:"_4、flex-shrink-定义了空间不够时-子元素的缩小比例"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_4、flex-shrink-定义了空间不够时-子元素的缩小比例"}},[t._v("#")]),t._v(" 4、flex-shrink: 定义了空间不够时，子元素的缩小比例")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n    flex-shrink: <number>;\n}\n")])])]),l("p",[t._v("默认值: 1，即如果空间不足，该项目将缩小，负值对该属性无效。")]),t._v(" "),l("p",[t._v("如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。")]),t._v(" "),l("p",[t._v("如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。")]),t._v(" "),l("h3",{attrs:{id:"_5、flex-flex-grow-flex-shrink-和-flex-basis-的简写"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_5、flex-flex-grow-flex-shrink-和-flex-basis-的简写"}},[t._v("#")]),t._v(" 5、flex: flex-grow,flex-shrink 和 flex-basis 的简写")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item{\n    flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]\n}\n")])])]),l("p",[t._v("<'flex-grow'>\n定义 flex 项目的 flex-grow 。负值无效。省略时默认值为 1。 (初始值为 0)")]),t._v(" "),l("p",[t._v("<'flex-shrink'>\n定义 flex 元素的 flex-shrink 。负值无效。省略时默认值为 1。 (初始值为 1)")]),t._v(" "),l("p",[t._v("<'flex-basis'>\n定义 flex 元素的 flex-basis 属性。若值为 0，则必须加上单位，以免被视作伸缩性。省略时默认值为 0。(初始值为 auto)")]),t._v(" "),l("p",[t._v("flex 的默认值是以上三个属性值的组合。假设以上三个属性同样取默认值，则 flex 的默认值是 0 1 auto。")]),t._v(" "),l("p",[t._v("有关快捷值：initial (0 1 auto) 、 auto (1 1 auto) 、 none (0 0 auto)")]),t._v(" "),l("p",[l("strong",[t._v("关于 flex 取值，还有许多特殊的情况，可以按以下来进行划分：")])]),t._v(" "),l("p",[t._v("(1) 当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {flex: 1;}\n.item {\n    flex-grow: 1;\n    flex-shrink: 1;\n    flex-basis: 0%;\n}\n")])])]),l("p",[t._v("(2) 当 flex 取值为 0 时，对应的三个值分别为 0 1 0%")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n    flex: 0;\n}\n.item {\n    flex-grow: 0;\n    flex-shrink: 1;\n    flex-basis: 0%;\n}\n")])])]),l("p",[t._v("(3) 当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1，有如下等同情况（注意 0% 是一个百分比而不是一个非负数字）")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item-1 {flex: 0%;}\n.item-1 {\n    flex-grow: 1;\n    flex-shrink: 1;\n    flex-basis: 0%;\n}\n\n.item-2 {flex: 24px;}\n.item-2 {\n    flex-grow: 1;\n    flex-shrink: 1;\n    flex-basis: 24px;\n}\n")])])]),l("p",[t._v("(4) 当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%，如下是等同的：")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {flex: 2 3;}\n.item {\n    flex-grow: 2;\n    flex-shrink: 3;\n    flex-basis: 0%;\n}\n")])])]),l("p",[t._v("(5) 当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1，如下是等同的：")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {flex: 11 32px;}\n.item {\n    flex-grow: 11;\n    flex-shrink: 1;\n    flex-basis: 32px;\n}\n")])])]),l("blockquote",[l("p",[t._v("flex-shrink 和 flex-grow 只有一个能起作用，这其中的道理细想起来也很浅显：空间足够时，flex-grow 就有发挥的余地，而空间不足时，flex-shrink 就能起作用。当然，flex-wrap 的值为 wrap / wrap-reverse 时，表明可以换行，既然可以换行，一般情况下空间就总是足够的，flex-shrink 当然就不会起作用")])]),t._v(" "),l("h3",{attrs:{id:"_6、align-self-允许交叉轴上单个在元素有与其他子元素不一样的对齐方式"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_6、align-self-允许交叉轴上单个在元素有与其他子元素不一样的对齐方式"}},[t._v("#")]),t._v(" 6、align-self:允许交叉轴上单个在元素有与其他子元素不一样的对齐方式")]),t._v(" "),l("p",[t._v("单个项目覆盖 align-items 定义的属性")]),t._v(" "),l("p",[t._v("默认值为 auto，表示继承父元素的 align-items 属性，如果父元素没有设置 align-items 属性，则等同于 stretch。")]),t._v(" "),l("div",{staticClass:"language- extra-class"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[t._v(".item {\n     align-self: auto | flex-start | flex-end | center | baseline | stretch;\n}\n")])])]),l("p",[t._v("这个跟 align-items 属性是一样的，只不过 align-self 是对单个子元素生效的，而 align-items 则是对容器下的所有子元素生效的。")]),t._v(" "),l("h2",{attrs:{id:"推荐链接"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#推荐链接"}},[t._v("#")]),t._v(" 推荐链接")]),t._v(" "),l("ul",[l("li",[l("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/25303493",target:"_blank",rel:"noopener noreferrer"}},[t._v("30 分钟学会 Flex 布局"),l("OutboundLink")],1)]),t._v(" "),l("li",[l("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Flex 布局教程：语法篇"),l("OutboundLink")],1)]),t._v(" "),l("li",[l("a",{attrs:{href:"http://static.vgee.cn/static/index.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Flex 布局示例"),l("OutboundLink")],1)]),t._v(" "),l("li",[l("a",{attrs:{href:"https://ppt.baomitu.com/d/9ab67fdb",target:"_blank",rel:"noopener noreferrer"}},[t._v("Flexbox 彻底研究——PPT"),l("OutboundLink")],1)]),t._v(" "),l("li",[l("a",{attrs:{href:"http://flexboxfroggy.com/#zh-cn",target:"_blank",rel:"noopener noreferrer"}},[t._v("FLEXBOX FROGGY——一款边学边玩的小游戏"),l("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=s.exports}}]);