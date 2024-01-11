(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{398:function(t,a,n){t.exports=n.p+"assets/img/11.01a66929.png"},399:function(t,a,n){t.exports=n.p+"assets/img/12.faecd733.png"},400:function(t,a,n){t.exports=n.p+"assets/img/13.6d2b372d.png"},401:function(t,a,n){t.exports=n.p+"assets/img/14.75ad98ed.png"},402:function(t,a,n){t.exports=n.p+"assets/img/15.2f4f9ff0.png"},403:function(t,a,n){t.exports=n.p+"assets/img/16.b93a5267.png"},404:function(t,a,n){t.exports=n.p+"assets/img/17.a3908e04.png"},558:function(t,a,n){"use strict";n.r(a);var e=n(45),i=Object(e.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"居中布局"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#居中布局"}},[t._v("#")]),t._v(" 居中布局")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://qiqihaobenben.github.io/layout/pages/middle",target:"_blank",rel:"noopener noreferrer"}},[t._v("demo:水平垂直居中的展示页面"),e("OutboundLink")],1)]),t._v(" "),e("h2",{attrs:{id:"子元素定宽高"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#子元素定宽高"}},[t._v("#")]),t._v(" 子元素定宽高")]),t._v(" "),e("h3",{attrs:{id:"_1、absolute-margin-负值"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、absolute-margin-负值"}},[t._v("#")]),t._v(" 1、absolute + margin 负值")]),t._v(" "),e("p",[e("img",{attrs:{src:n(398),alt:"absolute+margin负值"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    position: relative;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.item {\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    margin-left: -100px;\n    margin-top: -100px;\n    width: 200px;\n    height: 200px;\n    background-color: #8c7676;\n}\n")])])]),e("h3",{attrs:{id:"_2、absolute-left-right-top-bottom-margin-width-height"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、absolute-left-right-top-bottom-margin-width-height"}},[t._v("#")]),t._v(" 2、absolute(left,right,top,bottom) + margin + width + height")]),t._v(" "),e("p",[e("img",{attrs:{src:n(399),alt:"absolute(left,right,top,bottom) + margin + width + height"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    position: relative;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.item {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n    width: 200px;\n    height: 200px;\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：主流浏览器均支持。\n"),e("strong",[t._v("注意：子元素必须为固定宽高")])]),t._v(" "),e("br"),t._v(" "),e("h2",{attrs:{id:"子元素不定宽高"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#子元素不定宽高"}},[t._v("#")]),t._v(" 子元素不定宽高")]),t._v(" "),e("h3",{attrs:{id:"_1、display-table-cell"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、display-table-cell"}},[t._v("#")]),t._v(" 1、display:table-cell;")]),t._v(" "),e("p",[e("img",{attrs:{src:n(400),alt:"display:table-cell;"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    display: table-cell;\n    text-align: center;\n    vertical-align: middle;\n    margin: 0 auto;/*margin在table-cell下已经不起用了*/\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.item {\n    display: inline-block;\n    padding: 100px; /*用padding来撑开元素，没有设置宽高*/\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：由于 display:table-cell 的原因，IE6\\7 不兼容。")]),t._v(" "),e("p",[e("strong",[t._v("注意：无论父元素还是子元素都不能浮动，如果父元素浮动，元素就只能水平居中，如果子元素浮动，则子元素按照浮动的方向走。")])]),t._v(" "),e("h3",{attrs:{id:"_2、absolute-transform"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、absolute-transform"}},[t._v("#")]),t._v(" 2、absolute + transform")]),t._v(" "),e("p",[e("img",{attrs:{src:n(401),alt:"absolute + transform"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    position: relative;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.item {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%,-50%);\n    padding: 100px;/*用padding来撑开元素，没有设置宽高*/\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：浏览器必须支持 transform。")]),t._v(" "),e("h3",{attrs:{id:"_3、display-flex"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、display-flex"}},[t._v("#")]),t._v(" 3、display: flex;")]),t._v(" "),e("p",[e("img",{attrs:{src:n(402),alt:"display: flex;"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.item {\n    display: inline-block;\n    padding: 100px;/*用padding来撑开元素，没有设置宽高*/\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：浏览器必须支持 flex。")]),t._v(" "),e("h3",{attrs:{id:"_4、text-align-center-vertical-align-middle"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4、text-align-center-vertical-align-middle"}},[t._v("#")]),t._v(" 4、text-align:center;vertical-align:middle;")]),t._v(" "),e("p",[e("img",{attrs:{src:n(403),alt:"text-align:center;vertical-align:middle;"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    text-align: center;\n    font-size: 0;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n.container::before {\n    display: inline-block;\n    content: '';\n    width: 0;\n    height: 100%;\n    vertical-align: middle;\n}\n.item {\n    display: inline-block;\n    vertical-align: middle;\n    padding: 100px;/*用padding撑开元素，没有设置宽高*/\n    font-size: 12px;/*重新设置子元素内的字体大小*/\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：主流浏览器均支持。\n"),e("strong",[t._v("注意：子元素必须要是 inline-block 或者 inline 的元素，并且子元素不能绝对定位和浮动。")])]),t._v(" "),e("h3",{attrs:{id:"_5、calc"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5、calc"}},[t._v("#")]),t._v(" 5、calc")]),t._v(" "),e("p",[e("img",{attrs:{src:n(404),alt:"calc"}})]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v(".container {\n    position: relative;\n    margin: 0 auto;\n    width: 600px;\n    height: 400px;\n    border: 2px solid #666;\n}\n\n.item {\n    position: absolute;\n    left: calc(50% - 200px / 2);\n    top: calc(50% - 200px / 2);\n    width: 200px;\n    height: 200px;\n    background-color: #8c7676;\n}\n")])])]),e("p",[t._v("兼容性：浏览器必须支持 calc。")]),t._v(" "),e("h3",{attrs:{id:"_6、grid"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_6、grid"}},[t._v("#")]),t._v(" 6、grid")]),t._v(" "),e("p",[t._v("TODO 待补充……")]),t._v(" "),e("br"),t._v(" "),e("h3",{attrs:{id:"推荐资源"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#推荐资源"}},[t._v("#")]),t._v(" 推荐资源")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"http://www.cnblogs.com/Dudy/p/4085292.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("CSS 元素水平垂直居中方法总结"),e("OutboundLink")],1),t._v("\n里面还有关于背景图的居中和兼容低版本浏览器的写法")])])])}),[],!1,null,null,null);a.default=i.exports}}]);