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

git commit -v # 提交时显示所有diff信息

```
相关补充：  
[提交信息规范](http://yanhaijing.com/git/2016/02/17/my-commit-message/)