# 目录讲解

## .git目录

在初始化项目仓库时（git clone 或git init），Git会在根目录下创建一个.git目录，.git目录一般包括下面的内容：

* config ：文件包含项目的配置信息
* index ： 文件存储着暂存区的内容信息
* HEAD ：文件指向当前分支
* ORIG_HEAD : 文件记录的是在进行极端（drastic）操作（如合并merge，回退reset等）时，此操作之前HEAD所指向的位置
* hooks/ ： 目录存放项目的客户端或服务端钩子脚本
* info/ ： 目录下的exclude文件包含项目全局忽略匹配模式，与.gitignore文件互补
* refs/ ：目录存储着所有分支指向各自提交对象的指针
* objects/ ：目录存储着Git数据库的所有内容

### config

config是仓库的配置文件，一个典型的配置文件如下，我们创建的远端，分支都在配置文件里有表现； fetch操作的行为也是在这里配置的

```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = git@github.com:qiqihaobenben/Front-End-Basics.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
```

### objects

通过SHA-1校验和存取的数据都位于objects目录  
objects目录下有3种类型的数据：
* Blob： 文件都被存储为blob类型的文件
* Tree： 文件夹被存储为tree类型的文件
* Commit： 创建的提交节点被存储为commit类型数据

### refs

refs目录存储都是引用文件，如本地分支，远端分支，标签等  
* refs/heads/xxx 本地分支
* refs/remotes/origin/xxx 远端分支
* refs/tags/xxx 本地tag

**引用文件的内容都是40位commit**
`42223b40d4cd156276905c5a868b39ee50b10ecb`

### HEAD

HEAD文件存储的是当前所在的位置，其内容是引用的分支的名字：`ref: refs/heads/master`

### ORIG_HEAD
ORIG_HEAD记录的是在进行极端（drastic）操作（如合并merge，回退reset等）时，此操作之前HEAD所指向的位置，便于我们在发生毁灭性失误时进行回退，  
如使用`git reset --hard ORIG_HEAD`指令可以回退到危险操作之前的状态，但是对于正常的提交操作，该指针是不会变化的。  
在1.8.5版本以后，Git使用了链表记录HEAD的所有移动轨迹，可以使用`git reflog`查看，使用`git reset HEAD@`方式可以回退到指定版本，这也是之后介绍Git数据恢复将要介绍的一个指令，推荐使用这种方式替代ORIG_HEAD方式。

#### [更为详细的介绍-英文版](http://gitready.com/advanced/2009/03/23/whats-inside-your-git-directory.html)