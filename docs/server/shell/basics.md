# Shell 概览

Shell 指的是一个用 C 语言编写的程序（命令行解释器），它处理来自终端模拟器的输入，解释执行后输出结果给终端，是用户使用 Unix/Linux 的桥梁。

shell（小写的 s）是一种脚本语言，它定义了各种变量和参数，并提供了许多在高级语言中才具有的控制结构，包括循环和分支。

## Shell 的种类

shell 是一种脚本语言，必须由解释器来执行这些脚本。Unix/Linux 上常见的 shell 脚本解释器有：bash、sh、csh、ksh 等，我们常说的有多少种 Shell 或使用哪种 Shell，其实就是说的是 shell 脚本解释器。

shell 脚本解释器是 Shell 的具体实现，例如可以理解为 Shell 是一个类，bash 是实现了这个类的实例。

- bash：Linux 标准默认的 shell,是 BourneAgain Shell 的缩写，内部命令一共 40 个。
- sh：Unix 标准默认的 shell，是 Bourne Shell 的缩写，由 Steve Bourne 开发。
- ash：Linux 中占用系统资源最少的一个 shell，只包含 24 个内部命令，因此使用起来很不方便。
- csh：Linux 比较大的 shell，由 47 位作者编成，共有 52 个内部命令。该 shell 其实是指向 /bin/tcsh，也就是说，csh 其实就是 tcsh。
- ksh：是 Korn Shell 的缩写，共有 42 条内部命令。
- zsh: 设计用于交互的强大 shell 与脚本语言
- fish: 智能且友好的命令行 shell

**注意：bash 基于 sh，并吸收了 csh 和 ksh 的一些特性。bash 完全兼容 sh，也就是说，用 sh 写的脚本可以直接在 bash 中执行，不需要任何修改。**

### shell 脚本解释器的发展史

![shell 脚本解释器的发展史](./images/shell1.png)

### 查看 Shell 程序信息

一般发行版的 Linux 系统中，标准默认的 Shell 就是 bash。不过应该有很多同学会设置 zsh 为默认的 Shell，因为在开源框架 [Oh My Zsh](https://ohmyz.sh/) 的加持下，如有神助。

安装完 zsh 后，永久修改当前的默认 Shell 为 zsh ：`chsh -s /bin/zsh`

查看当前系统安装的 shell 脚本解释器： `cat /etc/shells`（以下所有代码中，`$` 开头的命令，其他的是输出）

```
$ cat /etc/shells

/bin/sh
/bin/bash
/sbin/nologin
/usr/bin/sh
/usr/bin/bash
/usr/sbin/nologin
/bin/tcsh
/bin/csh
/bin/zsh
```

查看 Shell 程序的安装全路径

```
$ type -a bash
bash is /bin/bash
```

查看当前的 Shell 程序： `echo $SHELL` 或 `echo $0` 或 `ps $$`

```
$ echo $SHELL

/bin/zsh
```

切换当前的 Shell 程序为 bash ： `bash` 退出用 `exit`

```
$ bash

$ echo $SHELL

/bin/bash

$ exit

$ echo $SHELL

/bin/zsh
```

## 扩展

### 概念

#### 终端

获取用户输入，展示运算结果的硬件设备

#### tty

teletypeWriter 的简称，和终端等价，早期指电传打印机，延伸到 Linux 中，指的是 输入/输出 环境（可以简单理解为一个命令行对话窗口）

#### 终端模拟器

关联虚拟 tty 的输入输出软件，例如 Mac 的 Terminal、iTerms2 等。

## 参考文档

[Shell 中傻傻分不清楚的 TOP3](https://mp.weixin.qq.com/s/UofKYTb9hp2FXYIKM5Q3Qw)
