# CPU 型号解读

对于电脑来说，CPU 是其最重要的硬件，没有之一！可是看着琳琅满目的 CPU 型号我们却经常很迷惑该如何选择，

比如：**CPU 型号后缀的这些数字和字母代表什么？这些数字分别代表的性能如何，是不是数字越大就越厉害？CPU 属于什么级别，是第几代产品，是否支持超频，是否内置核心显卡？**

本文就来详细讲解下 CPU 型号的命名规则，科普下这个 CPU 的基础知识，让大家看到 CPU 的名字就能对其有一定的了解！

![](https://pic1.zhimg.com/v2-745d3a26bb11ac5515ffe21c9339c1e6_1440w.jpg)

## 英特尔（Intel）CPU 的命名规则

我们先以目前比较热门的一款英特尔 CPU 举例：**Intel [酷睿](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=%E9%85%B7%E7%9D%BF&zhida_source=entity) i5 12600KF**

![](https://pic4.zhimg.com/v2-35693fa88e5465236b01af487d1ee131_1440w.jpg)

- **“Intel”** 是英特尔的英文名称，也是目前热门的 CPU 品牌；
- **“酷睿”** 代表英特尔品牌下面向普通消费者的一个 CPU 系列，一般划分为 Core（酷睿）、Pentium（[奔腾](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=%E5%A5%94%E8%85%BE&zhida_source=entity)）、Celeron（[赛扬](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=%E8%B5%9B%E6%89%AC&zhida_source=entity)）、Xeon（[至强](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=%E8%87%B3%E5%BC%BA&zhida_source=entity)）、Atom（[凌动](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=%E5%87%8C%E5%8A%A8&zhida_source=entity)）等；
- **“i5”** 代表这款 CPU 定位中端，在其下面还有 i3，在其上面还有 i7 和 i9，同一代中，数字越大，性能越强；但是不同代数之间，性能不能直接相比，比如 12 代的 i5 在理论性能上是强于 10 代 i7 的。
- **“12”** 代表这款 CPU 的代数，说明其已经发展到第十二代了，数字越大越新；
- **“600”** 这三位数字代表**Intel SKU 型号划分**，一般来说 Core i7 有固定几个 SKU，比方说 700；Core i5 有 600/500/400；Core i3 有 300/100 等等，一般来说数字越大说明隶属的 Core 系列越高级，同级别下比较，数字越大频率越高，换句话说性能就越强，比方说 Core i5-8600 默认 3.1GHz，睿频 4.3GHz，比 Core i5-8500 默认 3.0GHz，睿频 4.1GHz 要强。
- **“K”** 带 K 的表示不锁频，可以配合 Z 系列主板进行超频操作，适合会超频玩家使用，比方说 i7-12700K，i5-12600K 等
- **“F”** 带 F 的表示不带集成显卡，你必须配合独立显卡使用。

了解以上命名规则，大部分消费者级的英特尔 CPU 你也能一眼看出了。当然，除了例子中的这种情况，我们还会遇到其它 CPU 型号的**后缀**，汇总如下：

- **K：** 表示支持超频且内置核显的 CPU 型号，例如型号：i5-12600K、i7-12700K；
- **F：** 表示无内置核显，例如型号：i5-12400F、i7-12700F；
- **KF：** 表示支持超频且无内置核显的 CPU 型号，例如型号：i5-12600KF，i7-12700KF。
- **T：** 表示低功耗版，相同型号下功耗更低，性能也差一些，例如型号：i7-10700T；
- **X/XE：** 表示至尊旗舰级，例如型号：i9-10980XE。
- **KS：** 可以理解为官方超频版，提升了主频的版本，例如 i9-9900K 和 i9-9900KS，i9-9900KS 出厂的主频要高于 K，例如型号：i9-9900KS。

还有一些特殊情况，比如用在**笔记本电脑上的 CPU 型号**后缀也会不同：

![](https://picx.zhimg.com/v2-e1b87891a95b8ab10102d3d045dd91f3_1440w.jpg)

笔记本 CPU 型号会有不同

- **U：** 低电压，性能弱些但功耗低，通常出现在**轻薄本**中，举例型号：i7 10510U；
- **H：** 标压，性能强，通常出现在**游戏本**中，举例型号：i5-11300H
- **Y：** 超低电压，性能很弱功耗非常低，通常出现在轻薄本中，举例型号：i3-10110Y；
- **HK：** 一般使用在 intel 高端发烧级 CPU 上，可超频，举例型号：i9-11980HK；
- **G：** G1、G4 以及 G7 等，G 后面的数字表示核显性能强弱，数字越大代表核显性能越强，通常数字小于 4 的是集成的普通超高清(UHD)核显，大于等于 4 的是集成的高性能锐炬(Iris)核显。intel 移动版 CPU 后缀，举例型号：i5-1155G7、i3-1115G4、i3-1005G1；
- **HQ：** 标准电压，Q 板载四核，早期的老后缀，举例型号：i7-7700HQ；
- **MQ：** 标准电压，Q 插拔四核，早期的老后缀，举例型号：i7-4810MQ；
- **M：** 早期后缀 M 就是移动端 CPU，只是为了与台式机区别开，举例型号：i7-2620M。

### Core 新命名

“Core Ultra”：新的命名方式（主要是笔记本），强调能效 + AI + 新核显。

Ultra 是 新的酷睿命名，不是说它一定比“酷睿”强，而是新一代 CPU 的品牌名。

#### Intel Ultra（新命名，从 2023 年开始）

- 从 Meteor Lake（酷睿 Ultra 100 系列） 开始，Intel 改了命名规则：

  - 去掉 i3/i5/i7/i9 这种叫法
  - 新的名字是：Core Ultra 5 / Core Ultra 7 / Core Ultra 9

- “Ultra” 主要用于 笔记本 CPU，强调：
  - 高能效架构（采用小芯片/Tile 架构，NPU、GPU、CPU 分工更明显）
  - AI 加速（内置 NPU，面向 AI PC）
  - 核显更强（集成 Intel Arc GPU，比旧 Xe 核显提升很大）

#### 性能上：

- 新一代 Core Ultra（Meteor Lake 架构） → 更先进，带 NPU，核显升级大，适合 AI、轻薄本、长续航。
- 旧一代 Core i 系列（13/14 代 Raptor Lake） → 核心/频率更高，桌面端和高性能笔记本依然很猛，尤其是 i7/i9。

## AMD CPU 的命名规则

我们同样以目前比较热门的一款 AMD CPU 举例：**AMD 锐龙 R5 5600X**

![](https://pic4.zhimg.com/v2-8353f2c538af6e53c26c63be22180a03_1440w.jpg)

- **“AMD”** 是超威半导体公司的英文名称，在台式机领域和 Intel 不分伯仲；
- **“锐龙”** 代表 AMD 品牌下面向普通消费者的一个 CPU 系列，按照系列划分，有 Ryzen（锐龙）、Ryzen Pro（锐龙 Pro）、Ryzen Threadripper（锐龙线程撕裂者）、EPYC（霄龙），除了 EPYC 霄龙隶属于服务器 CPU 外，Ryzen 锐龙系列都是有消费级桌面、移动产品。
- **“R5”** 代表这款 CPU 定位中端，在其下面还有 R3，在其上面还有 R7 和 R9，同一代中，数字越大，性能越强；但是不同代数之间，性能不能直接相比，比如 5 代的 R5 在理论性能上是强于 3 代 R7 的。
- **“5”** 代表这款 CPU 的代数，说明其已经发展到第 5 代了，数字越大越新；
- **“600”** 这三位数字代表**AMD SKU 型号划分**，Ryzen 7 有 800/700，Ryzen 5 有 600/500/400，Ryzen 3 有 300/200。同样地，数字越大，频率越高，在 Ryzen 5 里面甚至会有更多核心和线程；
- **“X”** 带 X 的表示支持[XFR 技术](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=XFR%E6%8A%80%E6%9C%AF&zhida_source=entity)，自适应动态扩频，除了睿频以外，还能够让 CPU 做工在高于睿频频率的工作状态，而频率的最大值受到散热器散热效果而变化，简单来说就是，散热器越强，频率越高。

了解以上命名规则，大部分消费者级的 AMD CPU 你也能一眼看出了。当然，除了例子中的这种情况，我们还会遇到其它 CPU 型号的**后缀**，汇总如下：

![](https://pic2.zhimg.com/v2-4f5773a67807a942bd3249cb8b61f06f_1440w.jpg)

- **G：** 表示属于[APU](https://zhida.zhihu.com/search?content_id=198823205&content_type=Article&match_order=1&q=APU&zhida_source=entity)，内置强大的核显，举例型号：R5 5600G、R7 5700G。
- **X：** 不同于 intel CPU 的 X 后缀，带 X 结尾是指支持**XFR 技术**的处理器，XFR 是一种**超频技术**，是在 Boost 加速频率的基础上允许再次超频运行的一种技术，这个技术能让频率随不同散热解决方案(风冷/水冷/液氮)而升降，散热越牛逼超频越强悍。
- **XT：** 相当于 X 的加强版，也可以说是特挑体质版，相同型号下 XT 比 X 性能略有提升，举例型号 R9 3900XT、R7 3800XT、R5 3600XT；

**当然 AMD 笔记本电脑上的 CPU 型号**后缀也会不同：

- **U：** 低电压，性能弱些但功耗低，通常出现在轻薄本中，举例型号：R7-5700U；
- **H：** 标压，性能强，通常出现在游戏本中，举例型号：R5-5600H；
- **HX：** 一般使用在 AMD 高端发烧级 CPU 上，至尊版，举例型号：R9-5980HX；
- **HS：** 相当于 H 功耗略低，通常出现在轻薄全能本，性能较强，举例型号：R7 5800HS、R5 5600HS
