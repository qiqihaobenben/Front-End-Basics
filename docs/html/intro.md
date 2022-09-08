# HTML5 简介

## 语义化

### 概念

HTML5 的语义化指的是**合理正确的使用语义化的标签来创建页面结构**。

### 语义化标签

- header
- nav：为当前文档或者其它文档提供导航链接，导航部分常见的例子是：菜单、目录和索引。nav 用在 header 和 aside 中是有区别的，header 中的导航多数是到文章自己的目录，而 aside 中的导航多数是到关联页面或者是整站地图。
- main：整个页面只出现一个，表示页面的主要内容，可以理解为特殊的 div
- article：表示文档、页面、应用或者网站中的独立结构，每一个 article 里面都有自己的 header、section、footer，例如一个新闻网站的快报页面可能包含多个独立完整的新闻。
- section：表示一个通用独立章节，一般来说会包含一个标题。不仅仅是一个“有语义的 div”，它会改变 h1-h6 的语义，section 的嵌套会使得其中的 h1-h6 下降一级。
- aside：表示一个和其余页面内容几乎无关的部分，其通常表现为侧边栏或者标注框，不过要注意 aside 不等同于侧边栏，侧边栏是 aside，aside 不一定是侧边栏。
- footer
- abbr：表示缩写
- hr：表示故事走向的转变或者话题的转变
- 引述标签：blockquote 表示段落级引述内容，q 表示行内的引述内容，cite 表示引述的作品名
- pre：表示这部分内容是预先排版过的，不需要浏览器进行排版。经常与其配合的是：samp 标签表示计算机程序的示例输出，code 标签用来呈现一段计算机代码

![](./images/tag.webp)

具体可见[HTML 元素参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

### 语义化的优点

- 对开发者友好，在没有 CSS 样式的情况下，页面整体也会呈现出很好的页面结构
- 代码结构清晰，易于阅读，利于开发和维护
- 语义类标签十分适合机器阅读（解析），方便其他设备解析（如屏幕阅读器），有利于搜索引擎优化（SEO），搜索引擎爬虫会根据不同的标签来赋予不同的权重

### 只靠 div 和 span 进行布局好不好？

抛开之前的固有观念，前端开发存在两种场景

- 第一种是 HTML 用于描述“软件界面”
- 另一种是 HTML 用于描述“富文本”

现代互联网产品里，HTML 用于描述“软件界面”多过于“富文本”，而软件界面里的东西，实际上几乎是没有语义的，所以在任何“软件界面”的场景中，直接使用 div 和 span 也是好的。

对于语义标签，“用对”比“不用”好，“不用”比“用错”好，例如 ul 是无序列表，多出现在行文中间，它的上文多数在提示：要列举某些项。并不是所有并列关系都需要套上 ul，那样会造成大量冗余标签。

错误地使用语义标签，会给机器阅读（解析）造成混淆、增加嵌套，给 CSS 编写加重负担。

你可以尽量只用自己自己熟悉的语义标签，并且只在有把握的场景引入语义标签，这样才能保证语义标签不被滥用，造成更多的问题。

### 使用语义类标签的场景

1. 作为自然语言和纯文本的补充，用来表达一定的结构或者消除歧义。

在 HTML5 中引入 ruby（中文类似于注音或者意思的注解） 这个标签，它由 ruby、rt、rp 三个标签来共同实现。

还有一种情况是，HTML 的有些标签实际上就是必要的，甚至必要的程度可以达到：如果没有这个标签，文字会产生歧义的程度。例如 em 标签，em 表示重音强调，用于改变一个句子的意思：

```
今天我吃了一个<em>苹果</em>。
今天我吃了<em>一个</em>苹果。
```

> strong 是一个句子的某个部分增加重要性，比如 警告，特别注意 等。

2. 作为标题摘要的语义类标签

另一个语义重要使用场景就是文章结构。语义化的 HTML 能够支持自动生成目录结构，HTML 标准中还专门规定了生成目录结构的算法。即使我们并不打算深入实践语义，也应该尽量在大的层面上保证这些元素的语义化使用。

一篇文档会有一个树形的目录结构，它由各个级别的标题组成。这些树形结构可能不会跟 HTML 元素的嵌套关系一致。

从 HTML5 开始，我们有了 section 标签，这个标签可不仅仅是一个“有语义的 div”，它会改变 h1-h6 的语义。section 的嵌套会使得其中的 h1-h6 下降一级，因此，在 HTML5 以后，我们只需要 section 和 h1 就足以形成文档的树形结构。

3. 作为整体结构的语义类标签

随着越来越多的浏览器推出“阅读模式”，以及各种非浏览器终端的出现，语义化的 HTML 适合机器阅读的特性变得越来越重要。

应用了语义化结构的页面，可以明确地提示出页面信息的主次关系，它能让浏览器很好地支持“阅读视图功能”，还可以让搜索引擎的命中率提升，同时，它也对视障用户的读屏软件更友好。

## 元信息

元信息是指描述自身的信息，元信息类标签就是 HTML 用于描述文档自身的一类标签，他们通常出现在 head 标签中，一般不会在页面被显示出来。

### head 标签

head 标签本身并不携带任何信息，它主要是作为盛放其它元信息类和语义类标签的容器使用。

head 标签规定了自身必须是 html 标签中的第一个标签，它的内容必须包含一个 title，并且最多只能包含一个 base。如果文档作为 iframe，或者有其他方式指定了文档标题时，可以允许不包含 title 标签。

> 如果不按照上述规范编写，会造成解析问题，但是浏览器可能不会报错而是会尝试自动修复。例如 head 之前的标签会放入 body 中。

### title 标签

title 标签表示文档的标题。

要区分语义标签中一组表示标题（heading）的标签：h1-h6 和 title 区别：

- title 作为元信息，可能会被用在浏览器收藏夹、微信推送卡片、微博等各种场景，这时候往往是上下文缺失的，所以 title 应该是完整的概括整个网页内容。
- h1 等仅仅用于页面展示，它可以默认具有上下文，并且有链接辅助，所以可以简写，即便无法概括全文，也不会有很大的影响

假设有一个介绍蜜蜂跳舞求偶仪式的科普页面，把以下两个文字分别对应到 title 和 h1：

- 蜜蜂求偶仪式舞蹈
- 舞蹈

正确的答案因该是：“蜜蜂求偶仪式舞蹈”放入 title，“舞蹈”放入 h1。

### base 标签

base 标签实际上是个历史遗留标签，它的作用是给页面上所有的 URL 相对地址提供一个基础。

base 标签最多只有一个，它改变全局的链接地址，它是一个非常危险的标签，容易造成跟 JavaScript 的配合问题，所以在实际开发中，比较建议使用 JavaScript 来代替 base 标签的作用。

> 如果指定了多个 base 标签，只会使用第一个 href 和 target 值，其余都会被忽略

### meta 标签

meta 标签是一组键值对，它是一种通用的元信息表示标签。

在 head 中可以出现任意多个 meta 标签。一般的 meta 标签由 name 和 content 两个属性定义，name 表示元信息的名，content 则用于表示元信息的值。name 是一种比较自由的约定，HTTP 标准规定了一些 name 作为大家使用的共识，也鼓励大家发明自己的 name 来使用，只要写入和读取的双方约定好 name 和 content 的格式就可以了。

除了基本用法，meta 标签还有一些变体，主要用于简化书写方式或者声明自动化行为。

#### 具有 charset 属性的 meta

从 HTML5 开始，为了简化写法，meta 标签新增了 charset 属性。添加了 charset 属性的 meta 标签无需再有 name 和 content。

```html
<meta charset="UTF-8" />
```

charset 型 meta 标签非常关键，它描述了 HTML 文档自身的编码形式，因此，建议把这个标签放在 head 的第一个。这样，浏览器读到这个标签之前，处理的所有字符都是 ASCII 字符，众所周知，ASCII 字符是 UTF-8 和绝大多数字符编码的子集，所以，在读到 meta 之前，浏览器把文档理解多数编码格式都不会出错，读到这个 meta 之后，就按照设置的编码格式解析，这样可以最大限度地保证不出现乱码。

一般情况下，HTTP 服务端会通过 http 头来指定正确的编码方式，但是有些特殊的情况，例如使用 file 协议打开一个 HTML 文件，则没有 http 头，这种时候，charset meta 就非常重要了。

#### 具有 http-equiv 属性的 meta

具有 http-equiv 属性的 meta 标签，表示执行一个命令，这样的 meta 标签可以不需要 name 属性了。

例如下面这段代码相当于添加了 content-type 这个 http 头，并且指定了 http 编码方式。

```html
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
```

除了 content-type，还有以下几种命令：

- content-language：指定内容的语言
- default-style：指定默认样式表
- refresh：刷新
- set-cookie：模拟 http 头 set-cookie，设置 cookie
- x-ua-compatible：模拟 http 头 x-ua-compatible，声明 ua 兼容性
- content-security-policy：模拟 http 头 content-security-policy，声明内容安全策略

#### name 为 viewport 的 meta

这个 meta 类型没有在 HTML 标准中定义，却是移动端开发的事实标准，meta 的 name 属性为 viewport，它的 content 是一个复杂结构，**是用逗号分隔的键值对，键值对的格式是 key=value**。

content 的全部属性如下：

- width：页面宽度，可以是具体的数字，也可以是 device-width，表示跟设备宽度相等
- height：页面高度，可以是具体数字，也可以是 device-width，表示跟设备高度相等
- initial-scale：初始缩放比例
- minimum-scale：最小缩放比例
- maximum-scale：最大缩放比例
- user-scalable：是否允许用户缩放
- viewport-fit：可以设置可视视窗大小，有 auto、contain、cover 三个值。

对于已经做好了移动端适配的网页，应该把用户缩放功能禁止掉，宽度设为设备宽度：

```html
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
```

[点击查看其他的 meta 标签类型](https://docs.chenfangxu.com/html/meta.html)

## 链接

链接这种元素可以说是占据了整个互联网，也正是因为无处不在的超链接，才让我们的万维网如此繁荣，没有了超链接的 HTML，最多可以成为富文本，没法称作超文本（hyper text）。

链接是 HTML 中的一种机制，它是 HTML 文档和其他文档或者资源的连接关系，在 HTML 中链接有两种类型：一种是超链接型标签，一种是外部资源链接。

### link 标签

HTML 标准并没有规定浏览器如何使用元信息，link 标签也是元信息的一种，在很多时候，它是不会对浏览器产生任何效果。

link 标签会生成一个链接，它可能生成超链接，也可能生成外部资源链接。link 标签的链接类型主要通过 rel 属性来区分，具有特定的 [rel 属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types)，会成为特定类型的 link 标签。

#### 超链接类 link 标签

超链接类 link 标签是一种被动型链接，在用户不操作的情况下，它们不会被主动下载。产生超链接的 link 标签包括：具有 rel="canonical" 的 link、具有 rel="alternate" 的 link、具有 rel="prev" rel="next" 的 link 等等。

1. canonical 型 link

这个链接类型提示页面它的主 URL，在网站中常常有多个 URL 指向同一个页面的情况，搜索引擎访问这类页面时会去掉重复的页面，这个 link 会提示搜索引擎保留哪一个 URL。

```html
<link rel="canonical" href="..." />
```

2. alternate 型 link

这个标签提示页面它的变形形式，这个所谓的变形可能是当前页面内容的不同格式、不同语言或者为不同的设备设计的版本，这种 link 通常也是提供给搜索引擎使用的。

alternate 型的 link 的一个典型应用场景是，页面提供 rss 订阅时，可以用这样的 link 来引入：

```html
<link rel="alternate" type="application/rss+xml" title="RSS" href="..." />
```

除了搜索引擎外，很多浏览器插件都能识别这样的 link。

3. prev 型 link 和 next 型 link

在互联网应用中，很多网页都属于一个人序列，例如分页浏览的场景，每个网页是序列中的一个项。这种时候就适合使用 prev 和 next 型的 link 标签，来告诉搜索引擎或者浏览器它的前一项和后一项，这有助于页面的批量展示。

因为 next 型 link 告诉浏览器“这是很可能访问的下一个页面”，HTML 标准还建议对 next 型 link 做预处理。

4. 其他超链接类的 link

其它超链接类 link 标签都表示一个跟当前文档相关联的信息，可以把这样的 link 标签视为一种带链接功能的 meta 标签

- rel="author"：链接到本页面的作者，一般是 mailto: 协议
- rel="help": 链接到本页面的帮助页
- rel="license"：链接到本页面的版权信息页
- rel="search"：链接到本页面的搜索页面（一般是站内提供搜索时使用）

#### 外部资源类 link 标签

外部资源类 link 标签会被主动下载，并且根据 rel 类型做不同的处理。

1. icon 型 link

这类链接表示页面的 icon，多数浏览器会读取 icon 型 link，并且把页面的 icon 展示出来。

**icon 型 link 是唯一一个外部资源类的元信息 link**，其它元信息类 link 都是超链接，这意味着，icon 型 link 中的图标地址默认会被浏览器下载和使用。

**如果没有指定这样的 link，多数浏览器会使用域名根目录下的 favicon.ico，即使它并不存在，所以从性能的角度考虑，建议一定要保证页面中有 icon 型的 link。**

只有 icon 型 link 有有效的 sizes 属性，HTML 标准才允许一个页面出现多个 icon 型 link，并且用 sizes 指定它适合的 icon 尺寸。

2. 预处理类 link

预处理类 link 标签就是允许我们控制浏览器，提前针对一些资源去做 dns 查询、建立连接、传输数据，加载进内存和渲染等一系列的步骤，正确使用可以提高性能。

- dns-prefetch 型 link 提前对一个域名做 dns 查询，这样的 link 里面的 href 实际上只有域名有意义。
- preconnect 型 link 提前对一个服务器建立 tcp 链接
- prefetch 型 link 建议浏览器提前获取 href 指定的 url 的内容，因为它可能会被用户请求
- preload 型 link 告诉浏览器提前下载 href 指定的 url 的内容，稍后将需要该资源
- prerender 型 link 建议浏览器事先获取链接资源，并建议将预取的内容显示在屏幕外，以便在需要时可以将其快速展现给用户

3. modulepreload 型的 link

modulepreload 型 link 的作用是预先加载 JavaScript 模块，这可以保证 JS 模块不必等到执行时才加载，这里所谓的加载，是指完成下载并放入内存，并不会执行对应的 JavaScript。

假设 app.js 中有 import “irc” 和 import “fog-machine”, 而 irc.js 中有 import “helpers”。这段代码使用 moduleload 型 link 来预加载了四个 js 模块：

```
<link rel="modulepreload" href="app.js">
<link rel="modulepreload" href="helpers.js">
<link rel="modulepreload" href="irc.js">
<link rel="modulepreload" href="fog-machine.js">
<script type="module" src="app.js">
```

尽管，单独使用 script 标签引用 app.js 也可以正常工作，但是我们通过加入对四个 JS 文件的 link 标签，使得四个 JS 文件有机会被并行地下载，这样提高了性能。

4. stylesheet 型 link

```html
<link rel="stylesheet" href="xxx.css" type="text/css" />
```

以上是基本用法，从一个 CSS 文件创建一个样式表，这里的 type 属性可以没有，如果有，必须是 “text/css” 才会生效。

另外还可以提供可替换的样式表，用法就是在 rel 中可以加上 alternate， 成为 rel="alternate stylesheet"，此时必须指定 title 属性。在一些支持切换样式表的浏览器中可以在浏览器菜单“查看>页面样式”来选择网页的样式。

```html
<link href="default.css" rel="stylesheet" title="Default Style" />
<link href="fancy.css" rel="alternate stylesheet" title="Fancy" />
<link href="basic.css" rel="alternate stylesheet" title="Basic" />
```

5. manifest 型 link

表示链接到的文件是 [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

```html
<link rel="manifest" href="manifest.json" />
```

6. pingback 型 link

这样的 link 表示本网页被引用时，应该使用的 pingback 地址，这个机制是一份独立的标准，遵守 pingback 协议的网站在引用本页面时，会向这个 pingback url 发送一份消息。

### a 标签

a 标签是 anchor 的缩写，它是锚点的意思，用来标识文档中的特定位置。

a 标签其实同时充当了链接和目标点的角色，当 a 标签有 href 属性时，它是链接，当它有 name 时，它是链接的目标（name 在 HTML5 中是过时的，使用全局属性 id 代替）。

具有 href 的 a 标签跟一些 link 一样，会产生超链接，也就是在用户不操作的情况下，它们不会被主动下载的被动型链接。

**a 标签也可以有 rel 属性（此属性是链接类型，表明链接文档与当前文档的关系）**。

1. 跟 link 相同的一些 rel 包括：

- alternate
- author
- help
- license
- next
- prev
- search

以上这些跟 link 语义完全一致，不同的是，a 标签产生的链接实惠实际显示在网页中的，而 link 标签仅仅是元信息。

2. a 标签独有的 rel 类型

- tag：表示本网页所属的标签
- bookmark：到上级章节的链接

3. a 标签辅助性的 rel 类型，用于提示浏览器或者搜索引擎做一些处理

- nofollow：此链接不会被搜索引擎索引；
- noopener：此链接打开的网页无法使用 opener 来获得当前页面的窗口；
- noreferrer：此链接打开的网页无法使用 referrer 来获得当前页面的 url；
- opener：打开的网页可以使用 window.opener 来访问当前页面的 window 对象，这是 a 标签的默认行为。

### area 标签

a 标签基本解决了在页面中插入文字型和整张图片超链接的需要，但是如果我们想要在图片的某个区域产生超链接，那么就要用到另一种标签了——area 标签。

area 标签与 a 标签非常相似，不同的是，它不是文本型的链接，而是区域性的链接。

area 标签支持的 rel 与 a 标签完全一样。

**area 是整个 html 规则中唯一支持非矩形热区的标签**，它的 shape 属性支持三种类型。

- 圆形：circle 或者 circ，coords 支持三个值，分别表示中心点的 x,y 坐标和圆形半径 r。
- 矩形：rect 或者 rectangle，coords 支持两个值，分别表示两个对角顶点 x1，y1 和 x2，y2。
- 多边形：poly 或者 polygon，coords 至少包括 6 个值，表示多边形的各个顶点。

**area 必须跟 img 和 map 标签配合使用。** 使用实例如下：

```html
<p>
  Please select a shape:
  <img src="shapes.png" usemap="#shapes" alt="Four shapes are available: a red hollow box, a green circle, a blue triangle, and a yellow four-pointed star." />
  <map name="shapes">
    <area shape="rect" coords="50,50,100,100" />
    <!-- the hole in the red box -->
    <area shape="rect" coords="25,25,125,125" href="red.html" alt="Red box." />
    <area shape="circle" coords="200,75,50" href="green.html" alt="Green circle." />
    <area shape="poly" coords="325,25,262,125,388,125" href="blue.html" alt="Blue triangle." />
    <area shape="poly" coords="450,25,435,60,400,75,435,90,450,125,465,90,500,75,465,60" href="yellow.html" alt="Yellow star." />
  </map>
</p>
```

## 替换型元素

替换型元素是把文件的内容引入，替换掉自身位置的一类标签。

### script

script 标签是为数不多的既可以作为替换型标签，又可以不作为替换型标签的元素。

script 标签有两种用法，一种是直接把脚本代码写在 script 标签之内，另一种是把代码放到独立的 js 文件中，用 src 属性引入。这两种写法是等效的，这也能说明替换型元素的“替换”是怎么一回事。

凡是替换型元素，都是使用 src 属性来引用文件的，而链接型元素是使用 href 引入文件的，并且 style 标签并非替换型元素，不能使用 src 属性，这样，只能使用 link 标签引入 CSS 文件，当然就只能用 href 属性了。（可以解答为什么 link 一个 CSS 要用 href，而引入 JS 要用 src？）

### img

img 标签也是替换型标签，它的作用是引入一张图片，src 既可以是路径 uri，也可以是 data uri。

如果从性能的角度考虑，建议同时给出图片的宽高，因为替换型元素加载完文件后，如果尺寸发生变换，会触发重排版。

此处要重点提到 alt 属性，这个属性很难被普通用户感知，对于视障用户非常重要，可以毫不夸张的讲，给 img 加上 alt 属性，已经做完了可访问性的一半。

img 标签还有一组重要的属性，那就是 srcset 和 sizes，它们是 src 属性的升级版，这两个属性的作用是在不同的屏幕大小和特性下，使用不同的图片源。

```html
<img
  srcset="elva-fairy-320w.jpg 320w, elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
  sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
  src="elva-fairy-800w.jpg"
  alt="Elva dressed as a fairy"
/>
```

### picture

img 的 srcset 提供了根据屏幕的条件选取图片的能力，更好的做法是使用 picture 元素。

picture 元素可以根据屏幕的条件为其中的 img 元素提供不同的源，基本用法如下：

```html
<picture>
  <source srcset="image-wide.png" media="(min-width: 600px)" />
  <img src="image-narrow.png" />
</picture>
```

picture 元素的设计跟 audio 和 video 保持一致，它使用 source 元素来指定图片源，并且支持多个。这里的 media 属性是 media query，跟 CSS 的 @media 规则一致。

### video

在 HTML5 早期的设计中，video 标签和 img 标签类似，也是使用 src 属性来引入源文件，后来应该是考虑到了各家浏览器支持的视频格式不同，现在的 video 和 picture 元素一样，也是提倡使用 source 的。

```html
<video controls="controls">
  <source src="movie.webm" type="video/webm" />
  <source src="movie.ogg" type="video/ogg" />
  <source src="movie.mp4" type="video/mp4" />
  You browser does not support video.
</video>
```

video 标签的内容默认会被当做不支持 video 的浏览器显示的内容，因此如果要支持更古老的浏览器，还可以在其中加入 object 或者 embed 标签。

#### video 中还支持一种标签 track

track 是一种播放时序相关的标签，它最常见的用途就是字幕。track 标签中，必须使用 srclang 来指定语言，此外，track 具有 kind 属性，共有五种。

- subtitles：就是字幕了，不一定是翻译，也可能是补充性说明。
- captions：报幕内容，可能包含演职员表等元信息，适合听障人士或者没有打开声音的人了解音频内容。
- descriptions：视频描述信息，适合视障人士或者没有视频播放功能的终端打开视频时了解视频内容。
- chapters：用于浏览器视频内容。
- metadata：给代码提供的元信息，对普通用户不可见。

一个完整的 video 标签可能会包含多种 track 和多个 source，这些共同构成了一个视频播放所需要的全部信息。

### audio

跟 picture 和 video 一样，audio，也可以使用 source 元素来指定源文件。比起 video，audio 元素的历史问题并不严重，所以使用 src 也是没有问题的。

```html
<audio controls>
  <source src="song.mp3" type="audio/mpeg" />
  <source src="song.ogg" type="audio/ogg" />
  <p>You browser does not support audio.</p>
</audio>
```

### iframe

新标准中，为 iframe 加入了 sandbox 模式和 srcdoc 属性，给 iframe 带来了一些新场景：

```html
<iframe sandbox srcdoc="<p>Yeah, you can see it <a href="/gallery?mode=cover&amp;amp;page=1">in my gallery</a>."></iframe>
```

例子中使用 srcdoc 属性创建了一个新的文档，嵌入在 iframe 中展示，并且使用了 sandbox 来隔离，这样，这个 iframe 就不涉及任何跨域问题了。

## DTD

HTML 语法源自 SGML，基本语法有五种节点：标签（元素）、文本、注释、文档类型定义（DTD）和处理信息（ProcessingInStruction）。

DTD 全称是 Document Type Definition，也就是文档类型定义。SGML 用 DTD 定义每一种文档类型，HTML 属于 SGML，在 HTML5 出现之前，HTML 都是使用符合 SGML 规定的 DTD。DTD 在 HTML4.0.1 和之前都非常的复杂，到了 HTML5，抛弃了 SGML 兼容，变成了简单的 `<!DOCTYPE html>`。

HTML4.0.1 有三种 DTD，分别是严格模式、过渡模式和 frameset 模式。

```
严格模式的DTD规定了HTML4.0.1中需要的标签
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

过渡模式的DTD除了HTML4.0.1，还包括了一些被边吃的标签，这些标签已经不再推荐使用了，但是过度模式中仍保留了它们。
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

frameset 结构的网页如今已经很少见到了，它使用 frameset 标签把几个网页组合到一起
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

众所周知，HTML 中允许一些标签不闭合的用法，实际上这些都是符合 SGML 规定的，并且在 DTD 中规定好了的。但是，一些程序员喜欢严格遵守 XML 语法，保证标签闭合性，所以，HTML 4.0.1 又规定了 XHTML 语法，同样有三个版本：

```

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

## ARIA

ARIA 全称为 Accessible Rich Internet application，它表现为一组属性，是用于可访问性的一份标准。

可访问性是一个相当大的课题，它的定义包含了各种设备访问，各种环境，各种人群访问的友好型。不单单是永久性的残障人士需要用到可访问性，健康的人也可能在特定时刻处于需要可访问性的环境。

```html
<span role="checkbox" aria-checked="false" tabindex="0" aria-labelledby="chk1-label"></span> <label id="chk1-label">Remember my preferences</label>
```

ARIA 给 HTML 元素添加的一个核心属性就是 role，同时，ARIA 系统还提供了一系列 ARIA 属性给 checkbox 这个 role，这意味着，我们可以通过 HTML 属性变化来理解这个 JavaScript 组件的状态，读屏软件等第三方客户端，就可以理解我们的 UI 变化，这正是 ARIA 标准的意义。

ARIA 分为三类：

- Widget 角色：主要是各种可交互的控件。
- 结构角色：文档的结构。
- 窗体角色：弹出的窗体。

[如何使用 WAI-ARIA 增强 Web 可访问性](https://www.w3cplus.com/a11y/a11y-aria.html)

## 推荐阅读

- [HTML 标准文档](https://html.spec.whatwg.org/)
