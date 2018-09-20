# 邮件模板采坑

## Outlook客户端：

1. 不支持HTML5

2. Outlook支持传统的table 布局，不支持浮动，定位布局，建议使用table布局。

3. 内部和外联样式表实际操作来看，Outlook2010是支持的，但是慎用，不排除低版本Outlook不支持，建议写内联样式。

4. 表格正常布局，建议格式化样式，合并内边距cellpadding="0" cellspacing="0" style="border-collapse: collapse;"，建议开发时border="1",这样可以看到你当前布局所占的位置，方便调试。

5. table对于margin支持不好，padding实际操作可以。两个部分之间的空格建议新建一行tr空元素加高度实现。

6. 实际操作中line-height会解析错误，直接给高度也可以实现垂直居中。


7. 浮动可以使用align="center/left/right"。

8. 使用colspan，rowspan可以正确解析，合并表格

9. 图片问题尽量使用在线的路径，注意使用线上绝对路径的src值，防止图片找不到。图片设置width属性，写在style中可能会不生效。

10. table支持背景色和text-align:center;文字居中

11. 英文不自动换行，可以使用<td style="word-break:break-all;">


## Outlook的Web客户端

1. 跟以上的不同点是，不支持内部和外联样式表，所以只能用内嵌，内嵌的覆盖样式在预览状态下不支持，会被客户端的一些标签给替换掉，比如说英文换行，双击新页面打开可以正常展示

2. 图片展示需要开始受信任人才可以展示