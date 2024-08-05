# CSS 背景

## background 属性

- background-image: 设置背景图像, 可以是真实的图片路径, 也可以是创建的渐变背景;
- background-position: 设置背景图像的位置;
- background-size: 设置背景图像的大小;
- background-repeat: 指定背景图像的铺排方式;
- background-attachment: 指定背景图像是滚动还是固定;
- background-origin: 设置背景图像显示的原点，基于 background-position 相对定位的原点;
- background-clip: 设置背景图像向外剪裁的区域;
- background-color: 指定背景颜色。

## background 简写

简写的顺序如下: bg-color || bg-image || bg-position [ / bg-size]? || bg-repeat || bg-attachment || ( bg-origin || bg-clip )

### 注意

- 整体的顺序并非固定，但是其中某些属性的搭配使用时，相关的属性顺序是固定的
- background-position 和 background-size 属性, 之间需使用 `/` 分隔, 且 position 值在前, size 值在后。
- 如果同时使用 background-origin 和 background-clip 属性, origin 属性值需在 clip 属性值之前, 如果 origin 与 clip 属性值相同, 则可只设置一个值。
- background 是一个复合属性, 可设置多组属性, 每组属性间使用逗号分隔, 其中背景颜色不能设置多个且只能放在最后一组。
- 如设置的多组属性背景图像之间存在重叠, 则前面的背景图像会覆盖在后面的背景图像上。[示例](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds#%E7%A4%BA%E4%BE%8B)

---

background-position 和 background-size 一起使用时需要注意顺序。

## background-position

background-position 属性用来设置背景图像的位置, 默认值: 0% 0%, 效果等同于 left top。

### 取值说明:

- 如果设置一个值, 则该值作用在横坐标上, 纵坐标默认为 50%(即 center) ;
- 如果设置两个值, 则第一个值作用于横坐标, 第二个值作用于纵坐标, 取值可以是方位关键字[left\top\center\right\bottom], 如 background-position: left center ; 也可以是百分比或长度, 百分比和长度可为设置为负值, 如: background-position: 10% 30px ;
- 另外 css3 支持 3 个值或者 4 个值, 注意如果设置 3 个或 4 个值, 偏移量前必须有关键字, 如: background-position: right 20px bottom 30px;
- 可以使用 background-position-x 或 background-position-y 来分别设置横坐标或纵坐标的偏移量。

## background-size

background-size 属性用来指定背景图像的大小。默认值: auto

### 取值说明:

- 可使用 长度值 或 百分比 指定背景图像的大小, 值不能为负值。如果设置一个值, 则该值用于定义图像的宽度, 剩余的高度为默认值 auto, 根据宽度进行等比例缩放; 如果设置两个值, 则分别作用于图像的宽和高。
- auto 默认值, 即图像真实大小。
- cover 将背景图像等比缩放到完全覆盖容器, 背景图像有可能超出容器。(即当较短的边等于容器的边时, 停止缩放)
- contain 将背景图像等比缩放到宽度或高度与容器的宽度或高度相等,背景图像始终被包含在容器内。(即当较长的边等于容器的边时, 停止缩放)

---

## background-repeat

background-repeat 属性用来设置背景图像铺排填充方式, 默认值: repeat（即 repeat repeat），单值语法是完整的双值语法的简写。

### 取值说明

- repeat-x 表示横向上平铺, 相当于设置两个值 repeat no-reapeat;
- repeat-y 表示纵向上平铺, 相当于设置两个值 no-repeat repeat;
- repeat 是默认值，表示横向纵向上均平铺，相当于设置两个值 repeat repeat;
- no-repeat 表示不平铺, 相当于设置两个值 no-repeat no-repeat;
- round 表示背景图像自动缩放直到适应且填充满整个容器, 相当于设置两个值 round round。
  - 注意: 当设置为 round 时, background-size 的 cover 和 contain 属性失效。
- space 表示背景图像以相同的间距平铺且填充满整个容器或某个方向, 相当于设置两个值 space space。
  - 注意: 当 background-size 设置为 cover 和 contain 时, background-rapeat 的 space 属性失效。

---

background-origin 和 background-clip 一起使用时需要注意顺序。

## background-origin

用于设置 background-position 定位时参考的原点, 默认值 padding-box , 另外还有两个值: border-box 和 content-box。

- border-box 背景图像相对于边框定位。
- padding-box 背景图像相对于内边距定位(默认值)。
- content-box 背景图像相对于内容区域定位。

## background-clip

用于指定背景图像向外裁剪的区域, 默认值 border-box , 另外还有两个值: padding-box 和 content-box。

- border-box 背景延伸至边框外沿（但是在边框下层）。
- padding-box 背景延伸至内边距（padding）外沿。不会绘制到边框处。
- content-box 背景被裁剪至内容区（content box）外沿。
- text 背景被裁剪成文字的前景色。

[background-clip 示例](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip#%E7%A4%BA%E4%BE%8B)

注意: 由于 background-origin 的默认值为 padding-box, 即背景图像 background-image 的默认定位 background-position 参考的原点为 padding 区域[包含 padding], 所以为了更好的了解 background-clip 几个属性值的特性, 可将 background-origin 设置为 border-box 。

---

## background-attachment

规定背景图像是否固定或者随着页面的其余部分滚动。默认值是 scroll。主要有以下属性。

- scroll 默认值。背景图像会随着页面其余部分的滚动而移动。
- fixed 当页面的其余部分滚动时，背景图像不会移动。
- local 背景图像会随着元素内容的滚动而滚动。
