# 属性注意点

## font-family

- family 是家族的意思，font-family 设置的是字体族，可以使用一系列字体列表。
- 字体列表最后写上通用字体族，这样能保证在所有字体都没有匹配时，可以使用通用字体族中的某个系统自带字体进行渲染
  - Serif 衬线体：Georgia 宋体
  - Sans-Serif 无衬线体：Arial Helvetica 黑体 微软雅黑
  - Cursive 手写体：Caflisch Script 、楷体
  - Fantasy
  - Monospace 等宽字体：Consolas Courier 中文字体
- 字体的匹配是从前往后的，建议英文字体放在中文字体前面
- 使用 Web Fonts 时可以用一些工具来裁切加载实际用的文字的字体文件

## font-size

- 关键字
  - small、 medium、 large
- 长度
  - px、 em
- 百分数
  - 相对于父元素的字体大小

## font-weight

用 100 - 900 的数字表示，也可以用关键字 normal（400） 、 bold（700）

因为某些字体可能只支持 normal、bold 字重，所以设置 100、200 等不会有明显变化

## line-height

行高可以使用数字表示，例如 1.6，就是字体大小的 1.6 倍。

## font 简写属性

font: style weight size/height family;

```css
h1 {
  font: italic bold 14px/1.7 Helvetica, sans-serif;
}

p {
  font: 14px serif;
}
```

## white-space

页面上的空白符合换行符默认会合合并成一个，可以设置 pre 相关的值来进行保留。

## height

父元素容器有高度时，height 设置百分比的值才会生效。

## padding

padding 不管在上下左右哪个方向设置百分比，对应的都是父元素容器的宽度的百分比值。

## margin

margin 不管在上下左右哪个方向设置百分比，对应的都是父元素容器的宽度的百分比值。
