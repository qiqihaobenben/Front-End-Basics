# Linux 版本详述

## Linux 的由来

1970 年，出现了简单且可用的操作系统 Unix ，1970 年是 Unix 元年，Unix 时间戳从 1970 年 1 月 1 日开始计算和 Unix 诞生的时间有莫大的关系。

之后，Unix 的源代码被分享流传到了各个实验室，学校，公司，Unix 的发展有两条主线，一条在贝尔实验室内部，另一条在伯克利分校，他们搞的这套 Unix 成为 BSD。

1983 年，贝尔实验室的母公司 AT&T 拆分后，AT&T 发布了 Unix 最新版本 System V，宣布从此 Unix 只能商业使用，不再开放源代码。

伯克利分校决心把 BSD 中受到影响的源码重新写过，最后，他们宣布 BSD 当中再也没有最初来自贝尔实验室的源码，在漫长起诉，打官司后，BSD 终究推出了完全属于自己的 Unix，因为版权的问题，不能再叫 Unix，只能叫 **类 Unix 系统**，BSD 的类 Unix 系统是 FreeBSD、MacOS 的前身。

[Android，开源还是封闭？](http://www.ruanyifeng.com/blog/2010/02/open_android_or_not.html)

[安卓既然是开源的，为什么还需要谷歌授权？](http://share.wukongwenda.cn/answer/6432850185985982722/)

[Android ，在争议中逃离 Linux 内核的 GPL 约束](https://linux.cn/article-8691-1.html)

> tips: Linux 是一个操作系统，操作系统是一个程序，控制着对计算机系统和资源的操作。

## 不同的发行版本

Linux 通常被封装成不同的封包形式发布，不同的封包往往封装有不同的工具套件和应用程序，在软件组织方式也存在差异，这些不同的封装的系统，一般称为发行版（distributions）。不过，这些不同的发行版只是基于 OS 封装有各自的工具套件而已，不应该被认为是不同类型的操作系统。

### Redhat 系列

Redhat 系列在国内使用人群数量大，资料非常多，Redhat 系列采用的是基于 RPM 包的 YUM 包管理方式，包分发方式是编译好的二进制文件，包文件以 RPM 为扩展名。RHEL 和 CentOS 的稳定性好，适合用于服务器，Fedora 稳定性较差，最好只用于桌面应用。

#### RHEL(Redhat Enterprise Linux) 【收费版本】

所谓的 RedhatAdvance Server，收费的企业版

#### Fedora 【免费版本】

由原来的 Redhat 桌面版本发展而来，稳定性较差（因为对于赞助者 Red Hat 公司而言，Fedora 是许多新技术的测试平台，被认为可用的技术最终会加入到 RHEL 中）

#### CentOS 【免费版本】

RHEL 的社区克隆版本，是可自由使用源代码的企业级 Linux 发行版本。特点是相当的稳定，非常适合作为服务器操作系统使用。每个版本的 Centos 都会获得十年的支持（通过安全更新的方式）。新版本的 Centos 大约每两年发行一次，而每个版本的 Centos 会定期（大概 6 个月）更新一次，以支持新的硬件。2014 年 Red Hat 收编了 CentOS 团队。

### Debian 系列

Debian 系列采用的是 apt-get/dpkg/deb 包管理方式，deb 会自动的分析依赖关系，力争获取所有的依赖包，包文件以 deb 为扩展名。其实 Redhat 的 YUM 也是在模仿 Debian 的 APT 方式，但是二进制文件发行方式中，APT 应该是最好的了。Debian 系列的资料也很丰富，有很多支持的社区。

#### Debian

Debian 是社区类 Linux 的典范，是迄今为止最遵循 GNU 规范的 Linux 系统。1993 年创建，有三个版本分支：

- stable：一般只用于服务器，上面的软件包大部分都比较过时，但是稳定性和安全性都是非常高的。
- testing：经过 unstable 中的测试，相对较为稳定，同时支持了不少新技术（比如 SMP 等）。
- unstable：最新的测试版本，其中包括最新的软件包，但是也有相对较多的 bug，适合桌面用户

#### Ubuntu

是基于 Debian 的 unstable 版本分支加强而来，apt-get/dpkg/dep 包管理，适合桌面系统。衍生版本 Kubuntu（桌面采用 KDE，比较华丽），Xubuntu（要求配置较低），eubuntu（面向儿童和教育）。

#### Linux Mint

基于 Ubuntu 的 Linux 发行版，操作界面更接近 WindowsOS，致力于桌面系统对个人用户每天的工作更易用，更高效，且目标是提供一种更完整的即刻可用体验

### slackware 系列

#### SUSE

基于 slackware 二次开发的一款 Linux，主要用于商业桌面、服务器。

#### SLES(SUSE Linux Enterprise Server)

企业服务器操作系统，是唯一与微软系统兼容的 Linux 操作系统。

#### OpenSUSE

基于 SUSE 的 open 版本，来自德国的发行版，华丽的 KDE 桌面，业界称为“最华丽的 Linux 发行版”，包管理（YaST）倾向于图形化管理，图形界面用户友好程度要高一些，安装镜像提供多个桌面环境，和 ubuntu 一样，支持 kde 和 gnome，xface 等桌面。

### 其他发行版

#### Gentoo

基于 Linux 的自由操作系统，最年轻的发行版本，正因为年轻，所以能吸取在她之前的所有发行版本的优点，这也是 Gentoo 被称为最完美的 Linux 发行版本的原因之一。Gentoo 最初由 Daniel Robbins（FreeBSD 的开发者之一）创建，首个稳定版本发布于 2002 年。由于开发者对 FreeBSD 的熟识，所以 Gentoo 拥有媲美 FreeBSD 的广受美誉的 ports 系统——Portage 包管理系统。不同于 APT 和 YUM 等二进制文件分发的包管理系统，Portage 是基于源代码分发的，必须编译后才能运行。对于大型软件而言比较慢，不过正因为所有软件都是在本地机器编译的，在经过各种定制的编译参数优化后，能将机器的硬件性能发挥到极致。Gentoo 是所有 Linux 发行版本里安装最复杂的，但是又是安装完成后最便于管理的版本，也是在相同硬件环境下运行最快的版本。Gentoo 能成为理想的安全服务器、开发工作站、专业桌面、游戏系统、嵌入式解决方案或者别的东西--你想让它成为什么，它就可以成为什么。由于它近乎无限的适应性，可把 Gentoo 称作元发行版。

#### Aech Linux(或称 Arch Linux)

以轻量简洁为设计理念的的 Linux 发行版。其开发团队秉承简洁、优雅和代码最小化的设计宗旨。

### 总结

- 如果你只是需要一个桌面系统，而且既不想使用盗版，又不想花钱购买商业软件，那么你就需要一款适合桌面使用的 Linux 发行版本了；
- 如果你不想自己定制任何东西，不想在系统上浪费太多时间，那么很简单，你就根据自己的爱好在 ubuntu、kubuntu 以及 xubuntu 中选一款吧，三者的区别仅仅是桌面程序的不一样；
- 如果你需要一个桌面系统，而且还想非常灵活的定制自己的 Linux 系统，想让自己的机器跑得更欢，不介意在 Linux 系统安装方面浪费一点时间，那么你的唯一选择就是 Gentoo，尽情享受 Gentoo 带来的自由快感吧；
- 如果你需要的是一个服务器系统，而且你已经非常厌烦各种 Linux 的配置，只是想要一个比较稳定的服务器系统而已，那么你最好的选择就是 CentOS 了，安装完成后，经过简单的配置就能提供非常稳定的服务了；
- 如果你需要的是一个坚如磐石的非常稳定的服务器系统，那么你的唯一选择就是 FreeBSD（FreeBSD 并不是一个 Linux 系统）。 如果你需要一个稳定的服务器系统，而且想深入摸索一下 Linux 的各个方面的知识，想自己定制许多内容，那么推荐使用 Gentoo。

### Linux 软件包

Linux 软件包是一种软件的分发方式，软件包是一个压缩文件，里面包含了软件的二进制文件、配置文件、依赖文件、安装脚本等。软件包就是一个应用程序，可以是一个 GUI 应用程序、命令行工具等。

软件包管理工具分为两种：

- 底层工具：主要用来处理安装和删除软件包文件等任务：DPKG、RPM
  - DPKG：Debian Package，Debian 系列的软件包管理工具，例如：Debian、Ubuntu、Linux Mint 等
  - RPM：Redhat Package Manager，Redhat 系列的软件包管理工具，例如：Redhat、Fedora、CentOS 等
- 上层工具：主要用来处理数据的搜索任务和软件包的依赖解析：APT、YUM

![](./images/package-manager.png)

## 试用各种 Linux 发行版

[在线试用各种 Linux 发行版，它会分配一个虚拟机，浏览器里连接桌面](https://distrosea.com/)

### 推荐阅读

- [Linux 各大发行版有什么特色？](https://www.zhihu.com/question/24261540)
- [Linux 各个版本介绍](https://blog.csdn.net/lixingshi/article/details/60890593)
- [常见 Linux 的发行版及不同发行版之间的联系与区别](https://zhuanlan.zhihu.com/p/59867621)
- [简单认识计算机系统](https://zhuanlan.zhihu.com/p/403919173)
