# 项目中总结的小 tips

## js 中的有些事件是会冒泡的，有些是不冒的。

js 中的有些事件是会冒泡的，有些是不冒的。有时候会记不清，再次复习一下~ 其实查看 event 上的 bubbles 属性就可以了。（来自前端早读课-吕大豹）

```
abort ✗
beforeinput ✔
blur ✗
click ✔
compositionstart ✔
compositionupdate ✔
compositionend ✔
dblclick ✔
error ✗
focus ✗
focusin ✔
focusout ✔
input ✔
keydown ✔
keyup ✔
load ✗
mousedown ✔
mouseenter ✗
mouseleave ✗
mousemove ✔
mouseout ✔
mouseover ✔
mouseup ✔
resize ✗
scroll ✔
select ✔
unload ✗
wheel ✔
```
