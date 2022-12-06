# CSS 的颜色

CSS 中的文字、背景、阴影、表格、边框、链接等都有颜色属性，最常用的是 Hex 和 RGB。

## 关键字

### 140 种命名颜色

CSS 中提供了 140 个命名颜色，具体可以查看 [https://www.w3schools.com/colors/colors_names.asp](https://www.w3schools.com/colors/colors_names.asp)。

所有浏览器都支持这些名称，这些名称都是被预定义过颜色值的。例如 Red,Blue,Cyan,Cornsilk 等，**注意所有命名颜色都不区分大小写**。

### transparent

transparent 关键字表示完全透明，相当于 `rgba(0, 0, 0, 0)`。该关键字目前在所有浏览器都是支持的，**并且是 background-color 属性的默认值**。

### currentColor

currentColor 关键字表示的是当前元素的文本颜色，如果没有指定，就会展示从父容器继承的文本颜色。

### inherit

inherit 这个通用的关键字，表示继承，即该属性采用与元素父级的属性相同的值。

### 系统颜色

系统颜色是一些特殊的颜色关键字，用来匹配一些系统元素，旨在保持浏览器上应用程序的一致性，不同的浏览器默认设置的颜色不同。

系统颜色成对出现：背景颜色-前景颜色。例如按钮的 buttonFace/buttonText。

## RGB 颜色

RGB（红绿蓝）是常用的颜色表示方式。每种颜色使用 0 到 255 之间的数字指定，最常见的黑色： rgb(0,0,0)，白色：rgb(255,255,255)。

rgba 是在额外定义 [alpha 值](https://en.wikipedia.org/wiki/Alpha_compositing)，alpha 值是透明度的值，范围可以是 0 到 1 之间的任何值，0 是完全透明，1 是完全不透明。

## Hex 颜色

使用十六进制值表示 CSS 中的颜色，也是用的最多的颜色表示方式。在 CSS 中，使用 6 个十六进制数字来表示颜色，分别使用两个数字来表示红色（R）、绿色（G）和蓝色（B）。例如，#000000 表示黑色，它是最小的十六进制值；#FFFFFF 表示白色，它是最大的十六进制值。

也可以给十六进制颜色定义 alpha 值，在十六进制中，将另外两位数字添加到六位数字序列中，形成一个八位数序列，例如 #00000080 。

## HSL 颜色

HSL（Hue-Saturation-Lightness）分别表示色调、饱和度和亮度。每种颜色都有一个角度以及饱和度和亮度值的百分比值，HSL 颜色函数的表示形式：hsl(Hue Saturation Lightness)。

- 色调：色调描述了色轮上的值，从 0 到 360 度，从红色开始（0 和 360）；
- 饱和度：饱和度是所选色调的鲜艳程度，100% 表示完全饱和的亮色，0% 表示完全不饱和的灰色；
- 亮度：颜色的亮度级别，0% - 100%，较低的值会更暗，更接近黑色，较高的值会更亮，更接近白色。

HSL 颜色值可以添加 alpha 值，表示透明度 hsla(Hue Saturation Lightness / alpha)

```css
div {
  background-color: hsl(30deg 50% 50% / 0.5);
}
```

## 几种有兼容性问题的颜色（只在 Safari 15 上支持）

> 函数都

### HWB 颜色

HWB（Hue-Whiteness-Blackness）表示色调、白度和黑度，也可以添加 alpha。

- 色调：色轮中的一个角度；
- 白度：表示要混合的白色量的百分比。值越高，颜色越白。
- 黑度：表示要混合的黑色量的百分比。值越高，颜色越黑。

```css
div {
  background-color: hwb(194 50% 0% / 0.5);
}
```

### LAB 颜色

LAB 是一个可以在 Photoshop 等软件中访问的颜色空间，它代表了人类可以看到的整个颜色范围。它使用三个轴表示：亮度、a 轴和 b 轴。

- 亮度：从黑色到白色。值越低，颜色越接近黑色。亮度的值可以是任意百分比，不限于 0% 和 100%。超亮白色可以使用高达 400% 的百分比。
- a 轴：从绿色到红色。较低的值接近绿色，较高的值更接近红色。
- b 轴：从蓝色到黄色。较低的值接近蓝色，较高的值更接近黄色。

a 轴和 b 轴的值可以是正值或者负值，两个负值将导致颜色朝向光谱的绿色/蓝色端，而两个正值可以产生更橙色/红色的色调。

lab() 也可以添加 alpha 值来设置透明度，使用斜杠来分隔。

```css
div {
  background-color: lab(80% 100 50 / 0.5);
}
```

### LCH 颜色

LCH（Lightness Chroma Hue） 代表亮度、色度和色调。色调可以是 0 到 360 之间的值。色度代表颜色的量，它类似于 HSL 中的饱和度，但是色度值可以超过 100，理论上它是无上限的，不过目前的浏览器和显示器可以显示颜色量有限的，只有 0-230 之间的值是有用的，超过之后就和 230 的差异就不大了。

```css
div {
  background-color: lch(80% 200 50 / 0.5);
}
```

### 为什么有了 HSL 还需要 LAB 和 LCH 呢？

因为使用 LAB 或 LCH 可以获得更大范围的颜色。LCH 和 LAB 旨在让我们能够接触到人类视觉的整个范围。除此之外，HSL 和 RGB 在感知上并不均匀，并且在 HSL 中，增加或减少亮度会根据色调产生完全不同的效果。

## 置灰网站的方式

- 如果需要全站置灰，使用 CSS 的 `filter: grayscale()`
- 对于一些低版本的浏览器，使用 SVG 滤镜通过 `filter` 引入
- 对于仅仅需要首屏置灰的，可以使用 `backdrop-filter: grayscale()` 配合 `pointer-events: none`
- 对于需要更好兼容性的，使用混合模式的 `mix-blend-mode: hue` 、 `mix-blend-mode: saturation` 、 `mix-blend-mode: color` 也都是非常好的方式

详解 [https://mp.weixin.qq.com/s/pwXyZ-MAemaBhlPC6KM0hA](https://mp.weixin.qq.com/s/pwXyZ-MAemaBhlPC6KM0hA)

## 参考文档

- [https://juejin.cn/post/7056593845860958215](https://juejin.cn/post/7056593845860958215)
- [https://developer.mozilla.org/zh-CN/docs/Web/HTML/Applying_color](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Applying_color)
- [https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)
- [https://www.w3schools.com/colors/default.asp](https://www.w3schools.com/colors/default.asp)
