# ITerm2 快捷键

## Tab

- 新建标签：`command + t`
- 关闭标签：`command + w`
- 切换标签：`command + 数字` `command + 左右方向键`
- 切换全屏：`command + enter`
- 查找：`command + f`

## 分屏

- 垂直分屏：`command + d`
- 水平分屏：`command + shift + d`
- 切换屏幕：`command + option + 方向键` `command + [` 或 `command + ]`

## 操作光标

- 到行首：`ctrl + a`
- 到行尾：`ctrl + e`
- 前进后退：`ctrl + f/b` (相当于左右方向键)
- 按单词前移/后移：`option + 左右方向键`（可能需要设置）
- 展示光标位置：`command + /`

## 删除

- 删除当前光标的字符：`ctrl + d`
- 删除光标之前的字符：`ctrl + h`
- 删除光标之前的单词：`ctrl + w`
- 删除到文本末尾：`ctrl + k`
- 交换光标处文本：`ctrl + t`
- 清除当前行：`ctrl + u`
- 清屏 1：`command + r` 或 `ctrl + l` 或 `clear` （滚动到新的一屏）
- 清屏 2：`command + k`（真正的清屏，创建一个空屏）

## 历史操作

- 上一条命令：`ctrl + p`
- 下一条命令：`ctrl + n`
- 搜索命令历史：`ctrl + r`，输入关键字搜索，再次 `ctrl + r` 向上搜索，`ctrl + g` 退出搜索
- 查看历史命令：`command + ;`
- 查看剪贴板历史：`command + shift + h`
- 撤销操作：`ctrl + -`

## 其他

- 在当前目录打开 Finder：`open .`
- 不用鼠标也可以选择文本：`command + f` 然后 `tab`
  iTerm 提供了一种脱离鼠标也可以选择文本的机制，叫做 `搜索 + Tab`
- 快照返回：`command + option + b`
  这个功能称得上是 iTerm 又一杀器，比如你在下午三点的时候执行了一些命令，然后过了几个小时，你又执行了其他的命令。如果这时候你想再回去看看下午三点那会儿你做了什么怎么办呢，答案就是用 iTerm 的快照返回功能。按下 Cmd + Option + B 就会在界面上显示一个时间轴，这时候，我们按下键盘的左右箭头，时间轴就会自由的穿梭，这时 iTerm 上的命令行界面也随着变化成你选中的时间点的内容了。
