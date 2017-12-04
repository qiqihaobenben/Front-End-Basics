### Git 配置  

```
git config -e [--global] # 编辑Git配置文件
```

* 配置用户名和邮箱
用户名邮箱作用 : 我们需要设置一个用户名 和 邮箱, 这是用来上传本地仓库到GitHub中, 在GitHub中显示代码上传者;  

**使用命令：**  

```
git config --global user.name "yourname" //设置用户名  
git config --global user.email "your email"  //设置邮箱  
```

* 配置自动换行  

```
git config --global core.autocrlf input #提交到git是自动将换行符转换为lf
```

* 彩色的git输出  

```
git config --global color.ui true
```

* 配置别名  

```
git config --global alias.st status #git st
git config --global alias.co checkout #git co
git config --global alias.br branch #git br
git config --global alias.ci commit #git ci
```

* 设置显示中文文件名  

```
git config –global core.quotepath false 
```

* 获取配置列表和帮助  

```
git config --list #查看配置的信息

git help config #获取帮助信息
```


### .gitignore文件

* 屏蔽文件 : .gitignore文件是告诉Git哪些目录或者文件需要忽略, 这些文件将不被提交; 

* .gitignore位置 : 项目根目录下;

* 过滤模式 : Git中的 .gitignore 中有两种模式,开放模式 和保守模式,保守模式的优先级要高于开放模式;

* 开放模式 : 设置哪些文件和目录被过滤, 凡是在文件中列出的文件或者目录都要被过滤掉;  

```
-- 过滤目录 : /bin/ 就是将bin目录过滤, 该文件下的所有目录和文件都不被提交;  
-- 过滤某个类型文件 : *.zip *.class 就是过滤zip 和 class 后缀的文件, 这些文件不被提交;  
-- 过滤指定文件 : /gen/R.java, 过滤该文件, 该文件不被提交;
```

* 保守模式 : 设置哪些文件不被过滤, 凡是列在其中的文件都要完整的提交上去;  

```
-- 跟踪目录 : !/src , 该目录下的所有文件都要被提交;
-- 跟踪某类文件 : !*.java , 凡是java文件都要保留;
-- 跟踪指定文件 : !/AndroidManifest.xml , 该文件需要保留, 提交上去;
```

* 配置原则 : 一般情况下采用开放模式鱼保守模式共同使用;  

**eg : 一个目录下有很多目录和文件, 当我们只需要保留其中的一个文件的时候, 先用开放模式不保留这些文件, 然后用保守模式将这个文件留下来, 保守模式的优先级要高于开放模式;**
