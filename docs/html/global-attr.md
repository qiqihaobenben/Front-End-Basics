# HTML5 全局属性汇总

> 局部属性和全局属性

**局部属性：** 有些元素能规定自己的属性，这种属性称为局部属性。
比如 [link 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)，它具有的局部属性有 href、 rel、 hreflang、 media、 type、 sizes 这六个。
**全局属性：** 可以用来配置所有元素共有的行为，这种属性称为全局属性，可以用在任何一个元素身上。

---

## 1、accesskey 属性

使用 accesskey 属性可以设定一个或几个用来选择页面上的元素的快捷键。

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>HTML全局属性测试</title>
</head>
<body>
   <form action="">
       <p>
           Name: <input type="text" name="name" id="" accesskey="n">
       </p>
       <p>
           Password: <input type="password" name="password" id="" accesskey="p">
       </p>
       <p>
           Name: <input type="submit" name="" id="" value="Log In" accesskey="s">
       </p>
   </form>
</body>
</html>
```

在上面的例子中，三个 input 元素添加了 accesskey 属性，这样在 Mac 下就可以用`Control + Alt(Option) + n`快捷键访问到 Name 的输入框了。用来触发 accesskey 机制的按键组合因平台而异，具体如下：

|    浏览器/平台    |      Window       |       Linux       |         Mac         |
| :---------------: | :---------------: | :---------------: | :-----------------: |
|      Firefox      | Alt + Shift + key | Alt + Shift + key | Control + Alt + key |
| Internet Explorer |     Alt + key     |        N/A        |         N/A         |
|   Google Chrome   |     Alt + key     |     Alt + key     | Control + Alt + key |
|      Safari       |     Alt + key     |        N/A        | Control + Alt + key |
|       Opera       | 同 Google Chrome  | 同 Google Chrome  |  同 Google Chrome   |

> 关于 accesskey 这个全局属性的详解，可以看一下[HTML accesskey 属性与 web 自定义键盘快捷访问](http://www.zhangxinxu.com/wordpress/2017/05/html-accesskey/)

## 2、class 属性

class 属性用来将元素归类，这个就无需多言了。

## 3、contenteditable 属性

contenteditable 是 HTML5 中新增加的属性，，其用途是让用户能够修改页面上的内容。

```
<body>
    <!-- contenteditable属性应用 -->
    <p contenteditable="true">设置为 true 是可编辑的</p>
</body>
```

如上例，p 元素的 contenteditable 属性值设置为 true 时，用户可以单击文字编辑内容。设置为 false 时禁止编辑。

## 4、dir 属性

dir 属性用来规定元素中文字的方向。有效值有两个：ltr(从左到右)、rtl(从右到左)。

```
    <!-- dir属性应用 -->
    <p dir="ltr">从左到右</p>
    <p dir="rtl">从右到左</p>
```

![上面代码视图](https://cdn.jsdelivr.net/gh/qiqihaobenben/picture/2021-3-28/1616913146206-image.png)

## 5、draggable 属性

draggable 属性是 HTML5 支持拖放操作的方式之一，用来表示元素是否可被拖放。

## 6、dropzone 属性

dropzone 属性是 HTML5 支持拖放操作的方式之一，与 draggable 属性搭配使用。

## 7、id 属性

id 属性用来给元素分配一个唯一的标识符。这个也无需多言。需要说明的一点是，id 属性还可以用来导航到文档中的特定位置。

## 8、hidden 属性

hidden 是个布尔属性，表示相关元素当前不需要关注，浏览器对它的处理方式是隐藏相关元素（隐隐想起来控制一个元素的展示隐藏的时候，会自定义一个 hidden 类，然后在里面写隐藏样式），具体也可以看一下这篇介绍 [HTML5 的 hidden 属性](https://www.qianduan.net/html5-hidden-attributes/)

```
    <!-- hidden属性应用 -->
    <div hidden>这个元素将会被隐藏</div>
```

## 9、lang 属性

lang 属性用于说明元素内容使用的语言。lang 属性必须使用有效的 ISO 语音代码，使用这个属性的目的在于，让浏览器调整其表达元素内容的方式，比如在使用了文字朗读器的情况下正确发音。

```
    <!-- lang属性应用 -->
    <p lang="en">Hello - how are you?</p>
```

## 10、spellcheck 属性

spellcheck 属性用来表明浏览器是否应该对元素的内容进行拼写检查，这个属性只有用在用户可以编辑的元素上时才有意义。
spellcheck 属性可以接受的值有两个：true 和 false。至于拼写检查的实现方式则因浏览器而异。

```
<!-- spellcheck属性应用 -->
    <textarea name="" id="" cols="30" rows="10" spellcheck="true">This is some lalalala text</textarea>
```

![看到红点了没有？不是我自己点上去的哈](https://cdn.jsdelivr.net/gh/qiqihaobenben/picture/2021-3-28/1616913255746-image.png)

## 11、style 属性

style 属性用来直接在元素身上定义 CSS 样式，这个也不做过多描述了。

## 12、tabindex 属性

HTML 页面的键盘焦点可以通过按 Tab 键在各元素之间切换。用 tabindex 属性可以改变默认的转移顺序。

```
    <!-- tabindex属性应用 -->
    <form action="">
        <label>Name: <input type="text" name="" id="" tabindex="2"></label>
        <label>City: <input type="text" name="" id="" tabindex="-1"></label>
        <label>Country: <input type="text" name="" id="" tabindex="1"></label>
        <input type="submit" value="" tabindex="3">
    </form>
```

上面的代码实现效果是：在按 Tab 键的过程中，tabindex 为 1 的 Country 输入框第一个被选中，接着焦点会跳到 Name 输入框，最后是 submit 提交。tabindex 设置为-1 的元素不会在用户按下 Tab 键后被选中。

## 13、title 属性

title 属性提供了元素的额外信息，浏览器通常用这些东西显示工具条提示，这个在一些展示不全的文本标题也经常使用。

```
    <!-- title属性应用 -->
    <a href="https://qiqihaobenben.github.io/" title="我的个人网站">qiqihaobenben.github.io</a>
```
