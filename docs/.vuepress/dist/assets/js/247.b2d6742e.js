(window.webpackJsonp=window.webpackJsonp||[]).push([[247],{714:function(t,s,a){"use strict";a.r(s);var e=a(25),n=Object(e.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"一键安装-docker-的-shell-脚本"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一键安装-docker-的-shell-脚本"}},[t._v("#")]),t._v(" 一键安装 docker 的 shell 脚本")]),t._v(" "),s("h2",{attrs:{id:"创建-shell-脚本"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#创建-shell-脚本"}},[t._v("#")]),t._v(" 创建 shell 脚本")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("touch")]),t._v(" install_docker.sh\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("chmod")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("777")]),t._v(" install_docker.sh\n")])])]),s("h2",{attrs:{id:"一键安装-docker-的-shell-脚本-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一键安装-docker-的-shell-脚本-2"}},[t._v("#")]),t._v(" 一键安装 docker 的 shell 脚本")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("yum remove "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-client "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-client-latest "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-common "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-latest "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-latest-logrotate "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-logrotate "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n                  docker-engine\n\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('" =========== 1.delete exist docker ================'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"step 1: 安装必要的一些系统工具"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-y")]),t._v(" yum-utils device-mapper-persistent-data lvm2\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('Step 2: 添加软件源信息，国内 Repository 更加稳定"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo\n\n"),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("version")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("sudo "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cat")]),t._v(" /etc/redhat-release"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sed")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-r")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'s/.* ([0-9]+)\\..*/\\1/'")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$version")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("7")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("then")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v("Step 3: 更新 Centos version is : "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$version")]),t._v('; run yum makecache fast"')]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum makecache fast\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("elif")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$version")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("then")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v("Step 3: 更新Centos version is : "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$version")]),t._v('; run yum makecache fast"')]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" dnf makecache\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("fi")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"=========== 2.完成配置 docker Repository ================'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 安装最新版本的 Docker Engine 和 Container")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" docker-ce docker-ce-cli containerd.io\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-y")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" docker-ce\n\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"=========== 3.成功安装完 docker ================'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" systemctl "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("enable")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" systemctl start "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"=========== 4.自启动 docker ================'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 1.创建一个目录")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("mkdir")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-p")]),t._v(" /etc/docker\n\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 2.编写配置文件")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("tee")]),t._v(" /etc/docker/daemon.json "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<<-")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('\'EOF\'\n{\n  "registry-mirrors": ["http://hub-mirror.c.163.com",\n    "https://docker.mirrors.ustc.edu.cn",\n    "https://reg-mirror.qiniu.com",\n    "http://f1361db2.m.daocloud.io"\n  ]\n}\nEOF')]),t._v("\n\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" systemctl daemon-reload\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" systemctl restart "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-e")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"=========== 5.配置国内镜像加速 ================'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("ps")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-a")]),t._v("\n")])])]),s("h2",{attrs:{id:"文章"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#文章"}},[t._v("#")]),t._v(" 文章")]),t._v(" "),s("ul",[s("li",[s("a",{attrs:{href:"https://kunyuan.tech/archives/1287",target:"_blank",rel:"noopener noreferrer"}},[t._v("CentOS 7 离线安装 Docker"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://developer.aliyun.com/article/1446267",target:"_blank",rel:"noopener noreferrer"}},[t._v("内网环境下 - 安装 linux 命令、搭建 docker 以及安装镜像"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=n.exports}}]);