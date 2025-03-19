(window.webpackJsonp=window.webpackJsonp||[]).push([[160],{598:function(t,e,r){"use strict";r.r(e);var a=r(25),s=Object(a.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"目录讲解"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#目录讲解"}},[t._v("#")]),t._v(" 目录讲解")]),t._v(" "),e("h2",{attrs:{id:"git目录"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#git目录"}},[t._v("#")]),t._v(" .git目录")]),t._v(" "),e("p",[t._v("在初始化项目仓库时（git clone 或git init），Git会在根目录下创建一个.git目录，.git目录一般包括下面的内容：")]),t._v(" "),e("ul",[e("li",[t._v("config ：文件包含项目的配置信息")]),t._v(" "),e("li",[t._v("index ： 文件存储着暂存区的内容信息")]),t._v(" "),e("li",[t._v("HEAD ：文件指向当前分支")]),t._v(" "),e("li",[t._v("ORIG_HEAD : 文件记录的是在进行极端（drastic）操作（如合并merge，回退reset等）时，此操作之前HEAD所指向的位置")]),t._v(" "),e("li",[t._v("hooks/ ： 目录存放项目的客户端或服务端钩子脚本")]),t._v(" "),e("li",[t._v("info/ ： 目录下的exclude文件包含项目全局忽略匹配模式，与.gitignore文件互补")]),t._v(" "),e("li",[t._v("refs/ ：目录存储着所有分支指向各自提交对象的指针")]),t._v(" "),e("li",[t._v("objects/ ：目录存储着Git数据库的所有内容")])]),t._v(" "),e("h3",{attrs:{id:"config"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#config"}},[t._v("#")]),t._v(" config")]),t._v(" "),e("p",[t._v("config是仓库的配置文件，一个典型的配置文件如下，我们创建的远端，分支都在配置文件里有表现； fetch操作的行为也是在这里配置的")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n\tignorecase = true\n\tprecomposeunicode = true\n[remote "origin"]\n\turl = git@github.com:qiqihaobenben/Front-End-Basics.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n[branch "master"]\n\tremote = origin\n\tmerge = refs/heads/master\n')])])]),e("h3",{attrs:{id:"objects"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#objects"}},[t._v("#")]),t._v(" objects")]),t._v(" "),e("p",[t._v("通过SHA-1校验和存取的数据都位于objects目录"),e("br"),t._v("\nobjects目录下有3种类型的数据：")]),t._v(" "),e("ul",[e("li",[t._v("Blob： 文件都被存储为blob类型的文件")]),t._v(" "),e("li",[t._v("Tree： 文件夹被存储为tree类型的文件")]),t._v(" "),e("li",[t._v("Commit： 创建的提交节点被存储为commit类型数据")])]),t._v(" "),e("h3",{attrs:{id:"refs"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#refs"}},[t._v("#")]),t._v(" refs")]),t._v(" "),e("p",[t._v("refs目录存储都是引用文件，如本地分支，远端分支，标签等")]),t._v(" "),e("ul",[e("li",[t._v("refs/heads/xxx 本地分支")]),t._v(" "),e("li",[t._v("refs/remotes/origin/xxx 远端分支")]),t._v(" "),e("li",[t._v("refs/tags/xxx 本地tag")])]),t._v(" "),e("p",[e("strong",[t._v("引用文件的内容都是40位commit")]),t._v(" "),e("code",[t._v("42223b40d4cd156276905c5a868b39ee50b10ecb")])]),t._v(" "),e("h3",{attrs:{id:"head"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#head"}},[t._v("#")]),t._v(" HEAD")]),t._v(" "),e("p",[t._v("HEAD文件存储的是当前所在的位置，其内容是引用的分支的名字："),e("code",[t._v("ref: refs/heads/master")])]),t._v(" "),e("h3",{attrs:{id:"orig-head"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#orig-head"}},[t._v("#")]),t._v(" ORIG_HEAD")]),t._v(" "),e("p",[t._v("ORIG_HEAD记录的是在进行极端（drastic）操作（如合并merge，回退reset等）时，此操作之前HEAD所指向的位置，便于我们在发生毁灭性失误时进行回退，"),e("br"),t._v("\n如使用"),e("code",[t._v("git reset --hard ORIG_HEAD")]),t._v("指令可以回退到危险操作之前的状态，但是对于正常的提交操作，该指针是不会变化的。"),e("br"),t._v("\n在1.8.5版本以后，Git使用了链表记录HEAD的所有移动轨迹，可以使用"),e("code",[t._v("git reflog")]),t._v("查看，使用"),e("code",[t._v("git reset HEAD@")]),t._v("方式可以回退到指定版本，这也是之后介绍Git数据恢复将要介绍的一个指令，推荐使用这种方式替代ORIG_HEAD方式。")]),t._v(" "),e("h4",{attrs:{id:"更为详细的介绍-英文版"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#更为详细的介绍-英文版"}},[t._v("#")]),t._v(" "),e("a",{attrs:{href:"http://gitready.com/advanced/2009/03/23/whats-inside-your-git-directory.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("更为详细的介绍-英文版"),e("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=s.exports}}]);