(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{545:function(t,a,r){"use strict";r.r(a);var e=r(45),v=Object(e.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"基础和原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#基础和原理"}},[t._v("#")]),t._v(" 基础和原理")]),t._v(" "),r("h2",{attrs:{id:"基础"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#基础"}},[t._v("#")]),t._v(" 基础")]),t._v(" "),r("h3",{attrs:{id:"保存的是文件的完整快照-而不是差异变化或者文件补丁"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#保存的是文件的完整快照-而不是差异变化或者文件补丁"}},[t._v("#")]),t._v(" 保存的是文件的完整快照，而不是差异变化或者文件补丁")]),t._v(" "),r("p",[t._v("其它大部分系统以文件变更列表的方式存储信息。 这类系统（CVS、Subversion、Perforce、Bazaar 等等）将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异。"),r("br"),t._v("\nGit 更像是把数据看作是对小型文件系统的一组快照。 每次你提交更新，或在 Git 中保存项目状态时，它主要对当时的全部文件制作一个快照并保存这个快照的索引。")]),t._v(" "),r("blockquote",[r("p",[t._v("疑问：如果我的项目大小是10M，那Git占用的空间是不是随着提交次数的增加线性增加呢？我提交（commit）了10次，占用空间是不是100M呢？"),r("br"),t._v("\n很显然不是， 为了高效，如果文件没有修改，Git 不再重新存储该文件，它只会保存一个指向上一个版本的文件的指针，即，对于一个特定版本的文件，Git只会保存一个副本，但可以有多个指向该文件的指针。")])]),t._v(" "),r("h3",{attrs:{id:"近乎所有的操作都是本地执行"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#近乎所有的操作都是本地执行"}},[t._v("#")]),t._v(" 近乎所有的操作都是本地执行")]),t._v(" "),r("p",[t._v("举个例子，要浏览项目的历史，Git 不需外连到服务器去获取历史，然后再显示出来——它只需直接从本地数据库中读取。"),r("br"),t._v("\n这也意味着你离线时，几乎可以进行任何操作。 如你在飞机或火车上想做些工作，你能愉快地提交，直到有网络连接时再上传")]),t._v(" "),r("h3",{attrs:{id:"三种状态"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#三种状态"}},[t._v("#")]),t._v(" 三种状态")]),t._v(" "),r("ol",[r("li",[t._v("已修改（modified）\t表示修改了某个文件，但还没有提交保存；")]),t._v(" "),r("li",[t._v("已暂存（staged）\t表示把已修改的文件放在下次提交时要保存的清单中，即暂存区域；")]),t._v(" "),r("li",[t._v("已提交（committed）\t表示该文件已经被安全地保存在本地版本库中了。")])]),t._v(" "),r("h3",{attrs:{id:"三个工作区域"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#三个工作区域"}},[t._v("#")]),t._v(" 三个工作区域")]),t._v(" "),r("p",[t._v("1.工作区"),r("br"),t._v("\n就是你在电脑上看到的目录，或者以后需要再新建的目录文件等等都属于工作区范畴。")]),t._v(" "),r("p",[t._v("2.暂存区"),r("br"),t._v("\n运行git add命令后文件保存的区域，也是下次提交将要保存的文件")]),t._v(" "),r("p",[r("strong",[t._v("注意： Git 提交实际读取的是暂存区域的内容，而与工作区域的文件无关，这也是当你修改了文件之后，如果没有添加git add到暂存区域，并不会保存到版本库的原因")])]),t._v(" "),r("blockquote",[r("p",[t._v("作用:"),r("br"),t._v("\n作为过渡层"),r("br"),t._v("\n避免误操作"),r("br"),t._v("\n保护工作区和版本区"),r("br"),t._v("\n分支处理")])]),t._v(" "),r("p",[t._v("3、版本区（本地仓库）"),r("br"),t._v("\n工作区有一个隐藏目录.git,这个不属于工作区，这是版本库。其中版本库里面存了很多东西，其中最重要的就是stage(暂存区)，还有Git为我们自动创建了第一个分支master,以及指向master的一个指针HEAD。")]),t._v(" "),r("h2",{attrs:{id:"原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),r("h3",{attrs:{id:"sha-1校验和"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#sha-1校验和"}},[t._v("#")]),t._v(" SHA-1校验和")]),t._v(" "),r("p",[t._v("Git 是一套内容寻址文件系统。意思就是Git 从核心上来看不过是简单地存储键值对（key-value），value是文件的内容，而key是文件内容与文件头信息的 40个字符长度的 SHA-1 校验和。"),r("br"),t._v("\n例如：5453545dccd33565a585ffe5f53fda3e067b84d8。Git使用该校验和不是为了加密，而是为了数据的完整性，它可以保证，在很多年后，你重新checkout某个commit时，一定是它多年前的当时的状态，完全一摸一样。当你对文件进行了哪怕一丁点儿的修改，也会计算出完全不同的 SHA-1 校验和，这种现象叫做“雪崩效应”（Avalanche effect）。")]),t._v(" "),r("h3",{attrs:{id:"文件-blob-对象-树-tree-对象-提交-commit-对象"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#文件-blob-对象-树-tree-对象-提交-commit-对象"}},[t._v("#")]),t._v(" 文件(blob)对象，树(tree)对象，提交(commit)对象")]),t._v(" "),r("p",[t._v("简单来说，blob对象保存文件的内容；tree对象类似文件夹，保存blob对象和其它tree对象；commit对象保存tree对象，提交信息，作者，邮箱以及上一次的提交对象的ID（第一次提交没有）。而Git就是通过组织和管理这些对象的状态以及复杂的关系实现的版本控制以及以及其他功能如分支。"),r("br"),t._v("\n具体可以参考"),r("a",{attrs:{href:"http://blog.codingplayboy.com/2017/03/23/git_internal/",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://blog.codingplayboy.com/2017/03/23/git_internal/"),r("OutboundLink")],1)]),t._v(" "),r("h3",{attrs:{id:"git的引用"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#git的引用"}},[t._v("#")]),t._v(" Git的引用")]),t._v(" "),r("p",[t._v("如果我们想要看某个提交记录之前的完整历史，就必须记住这个提交ID，但提交ID是一个40位的 SHA-1 校验和，难记。所以"),r("strong",[t._v("引用就是SHA-1 校验和的别名，存储在.git/refs文件夹中")]),t._v("。"),r("br"),t._v("\n最常见的引用也许就是master了，因为这是Git默认创建的（可以修改，但一般不修改），它始终指向你项目主分支的最后一次提交记录。存放位置"),r("code",[t._v(".git/refs/heads/master")])]),t._v(" "),r("h3",{attrs:{id:"git的tag"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#git的tag"}},[t._v("#")]),t._v(" Git的tag")]),t._v(" "),r("p",[t._v("标签从某种意义上像是一个引用， 它指向一个 commit 对象而不是一个 tree，包含一个标签，一组数据，一个消息和一个commit 对象的指针。但是区别就是引用随着项目进行，它的值在不断向前推进变化，但是标签不会变化——永远指向同一个 commit，仅仅是提供一个更加友好的名字。")]),t._v(" "),r("h3",{attrs:{id:"git的分支"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#git的分支"}},[t._v("#")]),t._v(" Git的分支")]),t._v(" "),r("p",[t._v("Git保存文件的最基本的对象是blob对象，Git本质上只是一棵巨大的文件树，树的每一个节点就是blob对象，而分支只是树的一个分叉。说白了，分支就是一个有名字的引用，它包含一个提交对象的的40位校验和，所以创建分支就是向一个文件写入 41 个字节（外加一个换行符）那么简单，所以自然就快了，而且与项目的复杂程度无关。")]),t._v(" "),r("p",[t._v("在做一个新功能的时候，最好是在一个独立的区域上开发，通常称之为分支。分支之间相互独立，并且拥有自己的历史记录。"),r("br"),t._v("\n优点：")]),t._v(" "),r("ul",[r("li",[t._v("稳定版本的代码不会被破坏")]),t._v(" "),r("li",[t._v("不同的功能可以由不同开发者同时开发。")]),t._v(" "),r("li",[t._v("开发者可以专注于自己的分支，不用担心被其他人破坏了环境")]),t._v(" "),r("li",[t._v("在不确定之前，同一个特性可以拥有几个版本，便于比较")])]),t._v(" "),r("p",[r("strong",[t._v("创建分支")]),r("br"),t._v("\nGit的默认分支是master，存储在"),r("code",[t._v(".git\\refs\\heads\\master")]),t._v("文件中，假设你在master分支运行"),r("code",[t._v("git branch dev")]),t._v("创建了一个名字为dev的分支，那么git所做的实际操作是：")]),t._v(" "),r("ol",[r("li",[t._v("在.git\\refs\\heads文件夹下新建一个文件名为dev（没有扩展名）的文本文件。")]),t._v(" "),r("li",[t._v("将HEAD指向的当前分支（当前为master）的40位SHA-1 校验和外加一个换行符写入dev文件。")]),t._v(" "),r("li",[t._v("结束。")])]),t._v(" "),r("p",[r("strong",[t._v("切换分支的实际操作")])]),t._v(" "),r("ol",[r("li",[t._v("修改.git文件下的HEAD文件为ref: refs/heads/<分支名称>。")]),t._v(" "),r("li",[t._v("按照分支指向的提交记录将工作区的文件恢复至一模一样。")]),t._v(" "),r("li",[t._v("结束。")])]),t._v(" "),r("h3",{attrs:{id:"推荐资料"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#推荐资料"}},[t._v("#")]),t._v(" 推荐资料")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://lufficc.com/blog/the-core-conception-of-git",target:"_blank",rel:"noopener noreferrer"}},[t._v("Git的核心概念"),r("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=v.exports}}]);