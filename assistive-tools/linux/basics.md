<!--
 * @Author: chenfangxu
 * @Date: 2020-10-06 09:27:57
 * @LastEditTime: 2021-02-05 09:19:28
 * @LastEditors: chenfangxu
 * @Description: Linux 基础
 * @FilePath: /front/assistive-tools/linux/basics.md
-->

# Linux 基础

## Linux 的由来

1970 年，出现了简单且可用的操作系统 Unix ，1970 年是 Unix 元年，Unix 时间戳从 1970 年 1 月 1 日开始计算和 Unix 诞生的时间又莫大的关系。

之后，Unix 的源代码被分享流传到了各个实验室，学校，公司，Unix 的发展有两条主线，一条在贝尔实验室内部，另一条在伯克利分校，他们搞的这套 Unix 成为 BSD。

1983 年，贝尔实验室的母公司 AT&T 拆分后，AT&T 发布了 Unix 最新版本 System V，宣布从此 Unix 只能商业使用，不再开放源代码。

伯克利分校决心把 BSD 中收到影响的源码重新写过，最后，他们宣布 BSD 当中再也没有最初来自贝尔实验室的源码，在漫长起诉，打官司后，BSD 终究推出了完全属于自己的 Unix，因为版权的问题，不能再叫 Unix，只能叫 **类 Unix 系统**，BSD 的类 Unix 系统是 FreeBSD、MacOS 的前身。

[Android，开源还是封闭？](http://www.ruanyifeng.com/blog/2010/02/open_android_or_not.html)

[安卓既然是开源的，为什么还需要谷歌授权？](http://share.wukongwenda.cn/answer/6432850185985982722/)

[Android ，在争议中逃离 Linux 内核的 GPL 约束](https://linux.cn/article-8691-1.html)

## 目录名称

一般来说，特定种类的文件存储有一定的规范，文件系统，层次结构标准（Filesystem, Hierarchy Standard）可以查到我们讨论内容的详细列表。

- /bin - 基本命令二进制文件
- /sbin - 基本的系统二进制文件，通常是 root 运行的
- /dev - 设备文件，通常是硬件设备接口文件
- /etc - 主机特定的系统配置文件
- /home - 系统用户的家目录
- /lib - 系统软件通用库
- /opt - 可选的应用软件
- /sys - 包含系统的信息和配置
- /tmp - 临时文件( /var/tmp ) 通常在重启之间删除
- /user/ - 只读的用户数据
- /usr/bin - 非必须的命令二进制文件
- /usr/sbin - 非必须的系统二进制文件，通常是由 root 运行的
- /usr/local/bin - 用户编译程序的二进制文件
- /var -变量文件 像日志或缓存
