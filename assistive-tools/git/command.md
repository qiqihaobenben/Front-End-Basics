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
# 第一个命令移除工作区文件，第二个命令本地已经删除了的文件，通过此命令把暂存区的文件也删除了。

git rm -f * 
# 工作区和暂存区都有文件，运行此命令，会把两个文件都删除

git rm --cached * # 停止追踪指定文件，但该文件会保留在工作区

git mv file_from file_to # 重命名跟踪文件
```

* 查看历史记录
```
git log # 查看最近的提交日志
# 每次提交都有一个唯一id，可以查看所有提交和他们的id，之后恢复会用到

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

* 对比相关
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