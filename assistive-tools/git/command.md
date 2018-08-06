>在使用的任何的 git 命令前，都要切换到 git 项目目录下


## 常用命令

* git init  
初始化一个 git 仓库

* git status  
查看当前 git 仓库的状态

* git log  
查看提交记录

### 添加和提交

```
git add [files] #把当前文件放入暂存区域

git add * # 把所有修改文件放入暂存区域

git add -u [path] # 添加[指定路径下]已跟踪文件


git commit # 给暂存区域生成快照并提交到本地版本库	

git commit [file1] [file2] ... 
# 提交指定文件，对于跟踪过的文件，也可以不用git add，直接git commit file提交到本地版本库

git commit -m 'message' #添加注释

git commit -a 
# 跳过使用暂存区域，把所有已经跟踪过的文件暂存起来一并提交,注意是已经跟踪过的，对Untracked files无效

git commit --amend # 修改最后一次提交,git会使用与当前提交相同的父节点进行一次新提交，旧的提交会被取消。

git commit -v # 提交时显示所有diff信息

```
相关补充：  
[提交信息规范](http://yanhaijing.com/git/2016/02/17/my-commit-message/)

### 恢复相关的操作
* 文件删除相关  

```
rm *&git rm * 
# 第一个命令移除工作区文件，第二个命令本地已经删除了的文件，通过此命令把暂存区的文件也删除了。

git rm -f * 
# 工作区和暂存区都有文件，运行此命令，会把两个文件都删除

git rm --cached * # 停止追踪指定文件，但该文件会保留在工作区

git mv file_from file_to # 重命名跟踪文件
```

* 查看历史记录  

```
git log # 查看最近的提交日志
# 每次提交都有一个唯一id，可以查看所有提交和他们的id，之后恢复会用到

git log --pretty=oneline #单行显示提交日志 --pretty: 指定默认不同格式展示信息

git log --graph # 显示 ASCII 图形表示的分支合并历史。

git log --graph --oneline   #oneline只是让输出看起来比较舒服,只显示最开始7个字符长度的 SHA-1 校验和。

git log --author=cfangxu #只看某个人的提交记录

git log --abbrev-commit # 显示log id的缩写

git log -num #显示几条log（倒数）

git log --stat # 简略的显示每次提交的内容更改, 如哪些文件变更,多少删除,多少添加等

git log --follow [file] # 显示某个文件的版本历史，包括文件改名

git log -p [file] # 显示指定文件相关的每一次diff

git log -p -x # 仅显示最近x次的提交,包含每一次的diff

```

* 搜索调试  

```
git reflog 	# 查看已经修改的版本号，即使是已经删除的某个分支

git blame file.name # 快速显示文件的每一行最后一次修改是谁

git log -S<searchword> --oneline # 在Git的整个历史中进行搜索

```

* 对比相关  

```
git show commitId # 查看某一次提交更新了什么

git diff file #查看指定文件的差异(工作区和暂存区)

git diff --stat #查看简单的diff结果(工作区和暂存区)

git diff #比较工作区和暂存区之间的差异

git diff --cached(--staged) #比较暂存区和版本库之间的差异

git diff HEAD #比较工作区和版本库之间的差异

git diff branch #比较工作区和分支之间的差异

git diff branch1 branch2 #比较两次分支之间的差异

git diff commit commit #比较两次提交之间的差异
```

* 撤销相关  

```
git reset HEAD <file.name> # 取消已经暂存的文件

git reset -- <file.name> # 同上,可以用git reset 撤销所有暂存区域文件。

git reset --hard HEAD <file.name> # 恢复到当前版本库的状态，会覆盖工作区和缓存区的文件

git reset --hard commit(id) # 通过提交id来恢复之前的某个版本

git reset --hard  HEAD^ # 跳到之前的一个版本，可以连续使用	

git reset --hard  HEAD~<num> # 跳过num个版本，到想要的版本。

checkout命令用于从历史提交（或者暂存区域）中拷贝文件到工作目录，也可用于切换分支。当给定某个文件名（或者打开-p选项，或者文件名和-p选项同时打开）时，git会从指定的提交中拷贝文件到暂存区域和工作目录。如果命令中没有指定提交节点，则会从暂存区域中拷贝内容。注意当前分支不会发生变化。

git checkout -- file # 取消在工作区对文件的修改（从暂存区——覆盖工作区）

git checkout -- . # 从暂存区取出文件覆盖工作区

git checkout branch|tag|commit -- file_name # 从仓库取出file覆盖当前分支

```

### 分支

* 创建分支  

```
git branch # 列出本地分支

git branch -r # 列出远端分支

git branch -a # 列出所有分支

git branch -v # 查看各个分支最后一个提交对象的信息

git branch --merged # 查看已经合并到当前分支的分支

git branch --no-merged # 查看未合并到当前分支的分支

git branch test # 新建test分支

git branch branch [branch|commit|tag] # 从指定位置出新建分支

git branch --track branch remote-branch # 新建一个分支，与指定的远程分支建立追踪关系

git branch -m old new # 重命名分支

git branch -d test # 删除test分支

git branch -D test # 强制删除test分支

git branch --set-upstream-to origin/dev dev # 在dev执行，将本地dev分支与远程dev分支之间建立链接


git checkout test # 切换到test分支

git checkout -b test # 新建+切换到test分支

git checkout -b test dev # 基于dev新建test分支，并切换

```

* 合并分支  

```
git merge test # 将test分支合并到当前分支,

git merge –-no-ff test # 强制指定为非快速合并（no-fast-forward）

git merge --squash test ## 合并压缩，将test上的commit压缩为一条,svn的在合并分支时采用的就是这种方式，squash会在当前分支新建一个提交节点
squash和no-ff非常类似，区别只有一点不会保留对合入分支的引用


git cherry-pick commitId # "复制"一个提交节点并在当前分支做一次完全一样的新提交。

git cherry-pick -n commit # 拣选多个提交，合并完后可以继续拣选下一个提交


git rebase master # 将master分支上超前的提交，变基到当前分支，本质上，这是线性化的自动的 cherry-pick

git rebase --onto master 169a6 # 限制回滚范围，rebase当前分支从169a6以后的提交

git rebase --interactive # 交互模式	

git rebase --continue # 处理完冲突继续合并	

git rebase --skip # 跳过	

git rebase --abort # 取消合并
```

* 合并推荐链接：  

[图解4种git合并分支方法](http://yanhaijing.com/git/2017/07/14/four-method-for-git-merge/)

### 远程仓库

* 连接远程仓库  

```
git remote add origin1 git@github.com:yanhaijing/data.js.git # 添加远程仓库

git remote # 显示全部源
git remote -v # 显示全部源+详细信息

git remote rename origin1 origin2 # 重命名

git remote rm origin # 删除

git remote show origin # 查看指定源的全部信息
```

* 操作远程仓库  

```
git fetch origin remotebranch[:localbranch] # 从远端拉取分支[到本地指定分支]

git merge origin/branch # 合并远端上指定分支

git pull origin remotebranch:localbranch # 拉取远端分支到本地分支

git pull origin master --allow-unrelated-histories # 允许拉取远端无关历史的master分支到本地当前分支

git push origin branch # 将当前分支，推送到远端上指定分支

git push origin localbranch:remotebranch # 推送本地指定分支，到远端上指定分支

git push origin :remotebranch # 删除远端指定分支

git push origin remotebranch --delete # 删除远程分支

git branch -dr branch # 删除本地和远程分支

git checkout -b [--track] test origin/dev#基于远端dev分支，新建本地test分支[同时设置跟踪]

```

* 推荐资源：  
[Git远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html)

### 工作现场

```
git stash # 将工作区现场（已跟踪文件）储藏起来，等以后恢复后继续工作。

git stash list # 查看保存的工作现场

git stash apply # 恢复工作现场

git stash drop # 删除stash内容

git stash pop # 恢复的同时直接删除stash内容

git stash apply stash@{0} # 恢复指定的工作现场，当你保存了不只一份工作现场时。
```
  
  * 链接：[里面有介绍工作现场](http://blog.csdn.net/man_help/article/details/51840722)

### 标签

标签作用: 在开发的一些关键时期,使用标签来记录这些关键时刻, 例如发布版本, 有重大修改, 升级的时候, 会使用标签记录这些时刻, 来永久标记项目中的关键历史时刻;  

```
git tag # 列出现有标签	

git tag v0.1 [branch|commit] # [从指定位置]新建标签
git tag -a v0.1 -m 'my version 1.4'#新建带注释标签

git checkout tagname # 切换到标签

git push origin v1.5 # 推送分支到源上

git push origin --tags # 一次性推送所有分支

git tag -d v0.1 # 删除标签

git push origin :refs/tags/v0.1 # 删除远程标签
```
  

链接：[里面有关于标签的操作](http://blog.csdn.net/vipzjyno1/article/details/22098621)

### 推荐资源

* [图解Git](https://marklodato.github.io/visual-git-guide/index-zh-cn.html)
