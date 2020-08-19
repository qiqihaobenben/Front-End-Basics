# 实用的 git rebase 和 git 工作流

一个人鼓捣自己的工具，或者在一个小团队中开发时，大家可能并没有特别在意项目中 commit 是什么鬼样子，但是如果身处一个比较大的团队，大家都是独特而有趣的个体，如果放飞自我的话，你会看到有些同学可能在用意念写 commit messages，并且富有诗意，有些同学一个功能就加两行代码，还要提交四五个 commit，并且大家乐此不疲的在各种分支上合来合去，Merge branch 的方向总是飘忽不定，而且还会出现大量无意义的合并信息。

下面列举几个实际工作中会出现的问题，先简单说一下解决方案，然后再详细展开聊一下

#### 问题 1：commit messages 不规范

想要写出条理清晰且重点突出的 commit messages 是可以用工具辅助的，在之前一篇[《让你的 commit 更有价值》](https://chenfangxu.lap.360.cn/assistive-tools/git/commit.html)中介绍了 commit 的规范和实践。

#### 问题 2、一个小功能分多次提交

git 的最佳实践有一种原子性提交（atomic commits），在意在一定程度上解决这个问题。但是如果你用 pull request 提交功能修改的话，很可能在一个较大功能让你把 commit 合并成一个然后提交，这个时候 git rebase 就可以解决这个问题。

#### 3、commit messages 中包含了大量的错综复杂的合并

在只有你一个人开发的分支上，需要同步远程分支的最新更改，可以使用 git rebase 来进行变基，这样就能避免因为同步分支导致的意义不大的合并，保持 git 提交记录的清爽。

### 原子性提交

https://hearrain.com/git-zui-jia-shi-jian-:-yuan-zi-xing-ti-jiao-atomic-commits

原子性本意指的是在一个大型系统中，形成一个不可分割的最简单单元或组件。原子性提交的意思就很明确了，提交的代码变动应该是尽可能的小而完整，包含一个不可分割的 feature 、 fix 等。

#### 原子性提交的好处

- 对 code review 更友好
- 更容易回滚

#### 原子性提交的实践经验

- 提交变动文件时只提交跟当前任务相关的

我们在开发时，很可能存在某些代码跟当前要提交的这个功能不相关，所以在提交代码时， 可以用 `git add` 将功能相关的文件添加到 stage 暂存，然后再执行提交。

- 如果跟当前任务不相干的变动在同一个文件的时候，你可以使用 `git add --patch` 或者 `git add -p` 来实现文件局部区块的提交

### git rebase 实践

http://jartto.wang/2018/12/11/git-rebase/

https://segmentfault.com/a/1190000005937408

http://gitbook.liuhui998.com/4_2.html

https://blog.csdn.net/gtlbtnq9mr3/article/details/80222523

https://cloud.tencent.com/developer/news/231201

https://www.cnblogs.com/kidsitcn/p/5339382.html

https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA

https://juejin.im/post/6844903638070984718

#### 变基

- 简单的变基
- 复杂的变基

#### 修改之前的提交

### git rebase 注意事项

## git 工作流

http://www.qtcn.org/bbs/simple/?t53628.html

https://juejin.im/post/6844903895160881166

https://github.com/selfteaching/the-craft-of-selfteaching/issues/67

https://233px.com/15272402756177.html

https://segmentfault.com/a/1190000002918123

https://github.com/xirong/my-git/blob/master/git-workflow-tutorial.md

https://www.jianshu.com/p/efcc848798ee

https://juejin.im/post/6844904131115614221

## 参考文档

- [Git 最佳实践：原子性提交（atomic commits）](https://hearrain.com/git-zui-jia-shi-jian-:-yuan-zi-xing-ti-jiao-atomic-commits)
