# Linux 常用命令

## ps 命令

`ps` 命令是 Process Status 的缩写，用于显示当前运行在系统上的进程信息，包括进程 ID（PID）、状态、运行时间、CPU 和内存占用等。ps 命令列出的是当前那些进程的快照，就是执行 ps 命令的那个时刻的那些进程，如果想要动态的显示进程信息，就可以使用 top 命令。

### 1. 参数介绍

`ps` 命令有许多参数，用于控制输出的格式和内容。常用的参数包括：

- `-e`：显示所有进程，包括没有终端的进程，等同于 `-A`。
- `-f`：显示完整格式的输出，包括进程的父进程 ID（PPID）、用户 ID（UID）、CPU 占用等。通常和其他选项联用。用树形格式来显示进程；如：ps -ef 等
- `-l`：显示长格式输出，包括进程的命令行。
- `u`：使用详细格式显示进程信息，包括进程的所有者、CPU 占用率（%）、内存占用率（%）等
- `a`：显示终端上的所有进程，包括其他用户的进程
- `x`：显示没有控制终端的进程，即后台运行的进程
- `-o`：自定义输出格式，可以指定要显示的列
- `-r`：按 CPU 使用率排序，显示 CPU 使用率最高的进程
- `-N`: 反选，显示不符合指定条件的进程

### 2. 使用方法实例

#### 显示所有进程的详细信息（包括后台运行的进程）

```bash
# a 参数用于显示所有用户的进程，u 参数用于使用详细格式显示进程信息，x 参数用于显示后台运行的进程
ps aux
```

- USER：表示哪个用户启动了这个进程
- PID ：进程 ID
- %CPU：进程 CPU 的占用率
- %MEM：进程物理内存的占用率
- VSZ ：进程占用的虚拟内存量 (Kbytes)
- RSS ：进程当前实际上占用了多少内存
- TTY ：进程是在哪个终端机上面运作，若与终端机无关，则显示 ?，另外， tty1-tty6 是本机上面的登入者程序，若为 pts/0 等等的，则表示为由网络连接进主机的程序。
- STAT：该程序目前的状态，主要的状态有
  - R ：运行；该程序目前正在运作，或者是可被运作
  - D：不可中断：一般是 IO 进程
  - S ：中断；该程序目前正在睡眠当中 (可说是 idle 状态)，但可被某些讯号 (signal) 唤醒。
  - T ：停止：该程序目前正在侦测或者是停止了
  - Z ：僵尸：该程序应该已经终止，但是其父程序却无法正常的终止他，造成 zombie (僵尸) 程序的状态
- START：该进程启动的时间点
- TIME ：进程从启动后到现在，实际占用 CPU 的总时间
- COMMAND：启动该进程的命令

#### 显示当前所有进程详细信息

```bash
ps -ef
```

- UID：表示用户 ID
- PID：表示进程 ID
- PPID：表示父进程号
- C：表示 CPU 的占用率
- STIME：进程的启动时间
- TTY：登入者的终端机位置
- IME：表示进程执行起到现在总的 CPU 占用时间
- CMD：表示启动这个进程的命令

#### 显示指定用户的进程信息

```bash
ps -u username
```

#### 显示指定进程的信息

```bash
ps -p PID
```

### 常用实际应用案例

- **查看系统负载情况**：通过 `ps aux` 命令查看当前系统所有进程的 CPU 和内存占用情况，帮助排查系统负载高的原因。
- **查找特定进程**：通过 `ps -ef | grep process_name` 查找特定进程的信息，用于监控和管理。
- **定时监控进程**：结合 `watch` 命令，定时执行 `ps` 命令，实时监控系统中的进程运行情况。

## top 命令

top 命令是 Linux 下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况，类似于 Windows 的任务管理器

### 查看所有进程的资源占用情况

```bash
top
```

[查看 top 输出的信息含义](https://www.cnblogs.com/poloyy/p/12552041.html)

### 监控每个逻辑 CPU 的状况

```
top  ，按 1
```

### 高亮显示当前运行进程

```
top ，按 b
```

### 显示 完整命令

```
top ，按 c
```

### 切换显示 CPU

```
top，按 t
```

### 按 CPU 使用率从大到小排序

```
top，按 P
```

### 切换显示内存 Memory

```
top，按 m
```

### 按 Memory 占用率从大到小排序

```
top, 按 M
```

### 按累计运行时间 Time 从大到小排序

```
top，按 T
```

### 高亮 CPU 列

```
top, 按 x
```

### 通过”shift + >”或”shift + <”可以向右或左改变排序列

```
top shift + >或shift + <
```

### 改变内存的显示单位，默认为 KB

```
top，按e （针对列表）top，按E （针对头部统计信息）
```

### 忽略闲置和僵死进程，这是一个开关式命令

```
top，按i
```

## sort 命令

sort 的工作原理是将文件的每一行作为一个单位，相互比较，比较原则是从收字符向后，依次按照 ASCII 码值进行比较，最后将它们**按升序输出**。

### 选项

`-u` 去除重复行

`-r` 指定排序方式为降序（从大到小），sort 默认的排序方式是升序

`-o` 将排序结果写入文件（包括原文件），sort 默认是吧结果输出到标准输出，所以需要用重定向才能将结果写入文件，例如 `sort filename > newfile`，但是，重定向不能把排序结果输出到原文件（重定向到原文件会清空原文件）

`-n` 以数值来排序，默认的 ASCII 码值会出现 10 比 2 小的情况

`-t` 设置间隔符，指定间隔符后就可以用 `-k` 来指定列数了

`-k` 指定排序的列数

`-f` 忽略大小写，会将小写字母都转换为大写字母来进行比较

`-b` 忽略每行前面的所有空白部分，从第一个可见字符开始比较

`-c` 检查文件是否已经排好序，如果乱序则输出第一个乱序的行

`-M` 按月份排序

`-V` 按版本号排序

#### `-k` 详解

详细的语法格式：

`[ FStart [ .CStart ] ] [ Modifier ] [ , [ FEnd [ .CEnd ] ][ Modifier ] ]`

这个语法格式可以被其中的逗号（“，”）分为两大部分，Start 部分和 End 部分。

“如果不设定 End 部分，那么就认为 End 被设定为行尾”。这个概念很重要的。

Start 部分也由三部分组成，其中的 Modifier 部分就是我们之前说过的类似 n 和 r 的选项部分。我们重点说说 Start 部分的 FStart 和 C.Start。

C.Start 也是可以省略的，省略的话就表示从本域的开头部分开始。之前例子中的-k 2 和-k 3 就是省略了 C.Start 的例子喽。

FStart.CStart，其中 FStart 就是表示使用的域，而 CStart 则表示在 FStart 域中从第几个字符开始算“排序首字符”。

同理，在 End 部分中，你可以设定 FEnd.CEnd，如果你省略.CEnd，则表示结尾到“域尾”，即本域的最后一个字符。或者，如果你将 CEnd 设定为 0(零)，也是表示结尾到“域尾”

```bash
# -t 使用空格拆分列，-k 按照第三列降序排序（r），如果第三列相同，则按照第二列升序排序
sort -t ' ' -k 3r -k2 test.txt

# -t 使用空格拆分列，按照第二列的第二个字符到第三列的第一个字符排序
sort -t ' ' -n -k 2.2,3.1 test.txt
```

## find 命令

### 预先准备数据

```bash
mkdir -p ~/test/cool
touch ~/test/cool/demo{1..5}.txt
touch ~/test/cool/{1..3}.sh
chmod 777 *.sh
history > demo.txt
ls >> demo1.txt
ls >> demo1.txt
```

### 最基础的打印操作

```bash
# 默认跟添加 -print 一样，一 \n 分隔找到的文件
find ~/test
find ~/test -print

# 如果不想换行打印，可以考虑空格分隔，加上 -print0 即可
find ~/test -print0
```

```
/home/chenfangxu/test
/home/chenfangxu/test/cool
/home/chenfangxu/test/cool/2.sh
/home/chenfangxu/test/cool/demo1.txt
/home/chenfangxu/test/cool/demo5.txt
/home/chenfangxu/test/cool/3.sh
/home/chenfangxu/test/cool/demo.txt
/home/chenfangxu/test/cool/1.sh
/home/chenfangxu/test/cool/demo3.txt
/home/chenfangxu/test/cool/demo4.txt
/home/chenfangxu/test/cool/demo2.txt
```

### 通过文件名搜索

`-name`：仅可以对文件的 file_name 匹配

`-path`：可以对文件的 dir_name、file_name 匹配

查找的文件名最好使用引号包围，可以配合通配符进行查找

#### 查找 ~/test 下的.txt 文件

```
find ~/test -name "*.txt"

/home/chenfangxu/test/cool/demo1.txt
/home/chenfangxu/test/cool/demo5.txt
/home/chenfangxu/test/cool/demo.txt
/home/chenfangxu/test/cool/demo3.txt
/home/chenfangxu/test/cool/demo4.txt
/home/chenfangxu/test/cool/demo2.txt
```

#### 在~/test 下查找 cool 文件夹下的.txt 文件

```
find ~/test -path "*/cool/*.txt"
```

### 通过文件的类型来搜索

-type : d 目录、f 文件、b 块设备、c 字符设备、p 管道、l 符号链接

#### 在~/test 目录下查找所有的目录

```
find ~/test -type d
/home/chenfangxu/test
/home/chenfangxu/test/cool
```

#### 在~/test 目录下查找所有的文件

```
find ~/test -type f
```

### 通过文件的时间来搜索

#### 在~/test 目录下查找修改时间在 5 日以内的文件

```bash
find ~/test -mtime -5
```

#### 在~/test 目录下查找修改时间在 3 日以前的.txt 文件

```bash
find ~/test -type f -name "*.txt" -mtime +3
```

#### 在~/test 目录下查找更改时间在 5 分钟以内的.txt 文件

```bash
find ~/test -type f -name "*.txt" -mmin -5
```

#### 在~/test 目录下查找修改时间在 10 分钟以前的文件

```bash
find ~/test -mmin +10
```

### 通过文件大小来搜索

-size n[cwbkMG]

n 为：

- b：512 字节的块（默认），1b = 512c
- c：bytes，指定字节大小
- w：等价于两个 bytes，1w=2c，一般用户匹配中文
- k：平时常说的 1kb，1k=1024c=2b
- M：1MB，1M=1024k=2048b
- G：1GB，1GB=1024MB=2048\*1024b

#### 在~/test 目录下查找所有 size=0 字节的文件

```bash
find ~/test -size 0
```

#### 在~/test 目录下查找所有 size<100k 的文件

```bash
find ~/test -size -100k
```

#### 在~/test 目录下查找所有 size>1MB 的文件

```bash
find ~/test -size +1M
```

### 通过编程中的“与、或、非”来搜索

- -a：与，即&&（默认都是与）
- -o：或：即||
- -not：非，即条件结果取反

#### 在~/test 目录下查找文件大小在 1kb 和 10kb 内的所有文件

```bash
find ~/test -size +1k -size -10k
find ~/test -size +1k -a -size -10k
```

#### 在~/test 目录下查找大于 1kb 或类型为普通文件的文件

```bash
find ~/test -size +1k -o -type f
```

#### 在~/test 目录下查找非空文件

```bash
find ~/test -not -size 0
```

### 搜索空文件

```bash
find ~/test -empty -type f
```

### 通过文件所属用户搜索

```bash
find ~/test -user root
```

### 通过文件所属组 group 搜索

```bash
find ~/test -group root
```

### 搜索第一层的文件

```bash
find ~/test -maxdepth 1
```

## curl 命令

curl 全称 Command Line URL viewer

- curl 是常用的命令行工具，用来请求 Web 服务器
- 它的名字就是客户端（client）的 URL 工具的意思
- 它的功能非常强大，命令行参数多达几十种
- 如果熟练的话，完全可以取代 Postman 接口测试工具

提供强大的功能

- 代理支持
- 用户身份验证
- FTP 上传
- http post
- SSL 连接
- cookies
- 文件传输恢复
- Metalink
- 等等

支持的协议

- DICT、FILE、FTP、FTPS、GOPHER、HTTP、HTTPS
- IMAP、IMAPS、LDAP、LDAP、POP3、POP3、RTMP、RTSP、SCP、SFTP、SMB
- SMBS、SMTP、SMTPS、TELNET、TFTP

语法格式： `curl [options / URLs]`

### 常见参数

#### -v

查看请求详细过程

- 等价参数： `--verbose`
- 作用：输出通信的整个过程，用于调试

#### -X（常用）

- 等价参数： `--request <command>`
- 作用：指定 HTTP 请求的 Method

```bash
curl -v -X POST http://baidu.com
curl -v --request POST http://baidu.com
```

#### -d（常用）

- 等价参数： `--data <data>`
- 作用：用于发送 POST 请求的数据体

```bash
curl -v  -d 'wd=biying' -d 'ie=UTF-8'  https://www.baidu.com/s
```

#### --data-urlencode（常用）

作用：参数等同于 -d，发送 POST 请求的数据体，但它会自动将发送的数据进行 URL 编码

```bash
# 会将空格进行 URL 编码
curl -v -G --data-urlencode 'wd=b i y i n g' -d 'ie=UTF-8'  https://www.baidu.com/s

# -d 就不会 url 编码
curl -v -G -d 'wd=b i y i n g' -d 'ie=UTF-8'  https://www.baidu.com/s
```

#### --data-raw（常用）

作用：POST 请求体，可以接收一个完整的 json 字符串

```bash
curl --location --request POST 'http://test.com/account.login?ver=1.0&df=json&cver=3.7.8&os=android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id":"123",
    "service":"account.login",
    "client":{
        "ve":"3.7.8",
        "os":"android",
        "si":"123",
        "ex":{
            "brand":"vivo",
            "dpfr":"8.1.0",
        },
        "empty":false
    },
    "data":{
        "ex":{
            "token":"123"
        }
    }
}'
```

#### -H （常用）

- 等价参数： --header <header/@file>
- 作用：添加 HTTP 请求头

```bash
curl -v -H "token:123" -H "Content-type:application/json" http://baidu.com
```

#### -o

- 等价参数： `--output <file>`
- 作用：将服务器的 Responses 保存成文件，等同于 wget 命令

```bash
curl -o baidu.html  http://baidu.com
```

#### -O

- 等价参数： `--remote-name`
- 作用：将服务器 Responses 保存成文件，并将 URL 的最后部分当作文件名

```bash
curl -O http://baidu.com
```

#### -A

- 等价参数： `--user-agent <name> `
- 作用：指定客户端的 User-Agent

```bash
curl -v -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36" http://baidu.com
```

#### -b

- 等价参数： `--cookie <data|file>`
- 作用：向服务器发送 Cookie，可以是 data 也可以是一个文件

```bash
curl -v -b 'name=aaa' http://baidu.com
```

#### -c

- 等价参数： `--cookie-jar <filename>`
- 作用：将服务器返回需要设置的 Cookie 写入一个文件

```bash
curl -k -v -c test.txt https://www.baidu.com/s?wd=123%E8%89%BE%E5%BE%B7&rsv_spt=1&rsv_iqid=0xf0b9806f0000107b&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=6&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&inputT=1138&rsv_sug4=1138
```

#### -e

- 等价参数： --referer <URL>
- 作用：设置 HTTP Headers 里面的 Referer，表示请求的来源

```bash
curl -v -e "test" http://baidu.com
```

#### -F

- 等价参数： `--form <name=content>`
- 作用：向服务器上传二进制文件

```bash
# Content-Type: multipart/form-data
curl -F 'file=@photo.png' https://google.com/profile

# 指定 MIME 类型
curl -F 'file=@photo.png;type=image/png' https://google.com/profile

# 指定文件名
curl -F 'file=@photo.png;filename=me.png' https://google.com/profile
```

#### -G

- 等价参数： --get
- 作用：构造 URL 的查询字符串

```bash
# 本来 -d 会让 HTTP 请求变成 POST，但因为加了 -G，仍然是 GET，因为是查询字符串
curl -v -G -d 'wd=biying' -d 'ie=UTF-8'  https://www.baidu.com/s
```

#### -i

- 等价参数： --include
- 作用：打印 Responses Headers 和响应内容

```bash
curl  -i http://baidu.com
```

#### -I

- 等价参数： --head
- 作用：仅打印 Responses Headers

```bash
curl -I http://baidu.com
```

#### -k

- 等价参数： --insecure
- 作用：跳过 SSL 检测

```bash
curl -k -I https://www.baidu.com
```

#### -L

- 等价参数： --location
- 作用：让 HTTP 请求跟随服务器的重定向，curl 默认不跟随重定向

```bash
curl -L -d 'tweet=hi' https://api.twitter.com/tweet
```

#### --limit-rate

作用：限制 HTTP 请求和回应的带宽，模拟慢网速的环境

```bash
curl -v --limit-rate 2k http://baidu.com
```

#### -s

- 等价参数： --silent
- 作用：静默模式，将不输出错误和进度信息，不发生错误的话，会正常显示运行结果

#### -S

- 等价参数： --show-error
- 作用：只输出错误信息，会让 -s 参数不生效

常用方法，如果正确，则正常输出，如果错误则只输出错误信息，不输出运行结果

```bash
curl -S -s https://google.com/login
```

#### -u

- 等价参数： --user <user:password>
- 作用：设置服务器认证的用户名和密码

```bash
curl -u 'bob:12345' https://google.com/login
```

#### --trace

作用：输出通信的整个过程，比 -v 更详细

记录所有的传输数据，包括二进制数据，输出文件可以是一个指定的文件，也可以是标准输出。这个选项非常适用于需要详细了解传输过程的场景。

```bash
curl --trace github_trace.txt https://api.github.com/repos/curl/curl
```

#### --trace-ascii

--trace-ascii 选项与 --trace 类似，但它只记录 ASCII 格式的数据，不会记录二进制数据。这对于只关心文本内容的传输调试非常有用。

```bash
curl --trace-ascii github_trace_ascii.txt https://api.github.com/repos/curl/curl
```

### -w

- 等价参数： `--write-out <format>`
- 作用：完成请求后指定输出格式

完成请求传输后，使 curl 在 stdout 上显示自定义信息
格式是一个字符串，可以包含纯文本和任意数量的变量

输出格式

- 输出格式中的变量会被 curl 用对应的值替换掉
- 所有变量的格式为： %{variable name}
- 要输出一个普通的 % 只需将它们写为 %%
- 可以使用 \n、带 \r 的回车符和带 \t 的制表符来输出换行符
- 如果想通过文件来传入变量，可以用 @filename 的格式

#### 变量列表

- content_type（有用）

  HTTP 请求的 Content-type

- errormsg（有用）

  错误信息

- http_code（有用）

  响应码

- response_code（有用）

  和 http_code 一样，都是响应码

- local_ip（有用）

  ip 地址，可以是 ipv4，也可以是 ipv6

- remote_ip（有用）

  目标服务器的远程 IP，可以是 ipv4、ipv6

- remote_port（有用）

  目标服务器的远程端口

- size_request（有用）

  HTTP 请求中发送的总字节数

- time_namelookup（有用）

  DNS 域名解析的耗时，就是把 https://zhihu.com 转换成 ip 地址的过程

- time_connect（有用）

  TCP 连接建立的时间，就是三次握手的时间

- time_appconnect（有用）

  SSL/SSH 等上层协议建立连接的时间，比如 connect/handshake 的时间

- time_redirect（有用）

  在最终事务开始之前，所有重定向步骤（包括名称查找、连接、预传输和传输）所用的时间（以秒为单位）

  time_redirect 显示多个重定向的完整执行时间

- time_pretransfer（有用）

  从请求开始到响应开始传输的时间

- time_starttransfer（有用）

  从请求开始到第一个字节将要传输的时间

  包括预传输时间和服务器处理结果所需的时间。

- time_total（有用）

  这次请求花费的全部时间

- url_effective（有用）

  最后获取的 URL

  如果 curl 添加了 -L 且真的重定向之后，这个就很有用了

```bash
curl -w "%{content_type}\n %{local_ip} \n %%" -o /dev/null -S -s -L -k https://baidu.com
```

## “查看”文件指令

### cat

```bash
# 查看test.txt文件所有内容
cat test.txt

# 显示行号，无论是否为空行
cat -n test.txt

# 显示行号，除了空行
cat -b test.txt

# 连续读取两个文件，按顺序输出
cat test1.txt test2.txt

# 倒序输出,就是cat倒过来写即可
tac test.txt
```

### more

功能类似 cat ，cat 命令是将整个文件的内容从上到下显示在屏幕上。 more 命令会一页一页的显示，方便使用者逐页阅读

#### 每次显示 5 行

```bash
more -5 test.txt
```

#### 从第 5 行开始显示

```bash
more +5 test.txt
```

#### 每次翻页时，先清空屏幕内容

```bash
more -5 -p test.txt
```

#### 若遇到连续两行以上的空白行，合并为一行空白行

```bash
more -s test.txt
```

#### 执行 more 命令后，常用的操作

##### 向下滚动一屏

```
z
空格键
ctrl+f
```

##### 向上滚动一屏

```
b
ctrl+b
```

##### 输出文件名和当前行的行号

```bash
:f
```

#### 进入 vim 编辑器

```bash
v
```

#### 退出 more 模式

```bash
q
```

### less

less 命令也是对文件或其它输出进行分页显示的工具，应该说是 linux 正统查看文件内容的工具，功能极其强大

#### 查看文件

```bash
less test.txt
```

#### ps 查看进程并通过 less 分页显示

```bash
ps -ef | less
```

#### 显示当前行数的百分比

```bash
less -m test.txt
```

#### 显示当前行数/总行数和百分比

```bash
less -M test.txt
```

#### 显示连续空行为一行

```bash
less -s test.txt
```

#### 进入 less 模式之后的操作

g：移动到第一行

G：移动到最后一行

u：向前移动半屏

d：向后移动半屏

f：向后移动指定行数或一屏

b：向前移动指定行数或一屏

j：向下移动一行

k：向上移动一行

q：结束 less 模式

### head

主要是用来显示文档的开头至标准输出中，默认 head 命令打印其相应文件的开头 10 行。

#### 显示文件的前 5 行（两种方式）

```bash
head -n 5 test.txt

head -5 test.txt
```

#### 显示文件倒数第 5 行之前的内容

```bash
head -n -5 test.txt
```

#### 显示文件的前 100 个字符

```bash
head -c 100 test.txt
```

#### 显示文件的第 10 - 20 行

```bash
head -20 test.txt | tail -10
```

### tail

tail 命令主要用于显示指定文档末尾内容。常用查看日志文件。

#### 实时刷新 log

```bash
tail -f test.log
```

#### 实时刷新最新 50 条 log

```bash
tail -50f test.log
```

#### 显示最后 5 条 log（两种写法）

```bash
tail -n 5 test.log
tail -5 test.log
```

#### 显示第五条后面的所有 log

```bash
tail -n +5 test.log
```

## 操作文件

### ls 命令

```bash
# 列出当前目录中所有的子目录和文件（不包含隐藏文件 .xxx）
ls

# 列出目录下的所有的子目录和文件（包含隐藏文件 .xxx）
ls -a

# 这样写，可以只列出目录
ls -d */

# 递归地列出子目录中的所有文件
ls -R

# 长信息，列出文件的详细信息（包括权限、所有者、文件大小、修改时间等） 有两种编写方式
ls -l

ll

# 列出当前目录中所有以“test”开头的详细内容
ls -l test*

# 按文件最后修改时间排序，降序
ls -lt

# 按文件大小排序，从大到小
ls -S

# 查看文件大小时增加可读性（2K 2M 2G）
ls -h

ls -lh

ls -lhS
```

### mkdir 命令

```bash
# 新建一个文件夹 test
mkdir test

# 新建三个文件夹 test1 test2 test3
mkdir test1 test2 test3

# 新建一个多层级的文件夹 test4/a/b
mkdir -p test4/a/b

# 新建一个文件夹并设置权限
mkdir -m 777 test5
```

## 文本内容处理

### sed 命令

`sed` 是一个强大的流编辑器（sed 的全称是 “stream editor”），用于在 Unix 和 Linux 系统中处理和转换文本。它可以用于插入、删除、替换和检索文本内容。

#### 基本语法

```bash
sed [options] 'command' file
```

- `[options]`：一些可选的参数，例如 `-i`（直接修改文件），`-e`（多个编辑命令）等。
- `'command'`：`sed` 命令，用单引号包围。
- `file`：要处理的文件。

```
选项与参数：
-n ：使用安静(silent)模式。在一般 sed 的用法中，所有来自 STDIN 的数据一般都会被列出到终端上。但如果加上 -n 参数后，则只有经过sed 特殊处理的那一行(或者动作)才会被列出来。
-e ：直接在命令列模式上进行 sed 的动作编辑；
-f ：直接将 sed 的动作写在一个文件内， -f filename 则可以运行 filename 内的 sed 动作；
-r ：sed 的动作支持的是延伸型正规表示法的语法。(默认是基础正规表示法语法)
-i ：直接修改读取的文件内容，而不是输出到终端。

动作说明： [n1[,n2]]function
n1, n2 ：不见得会存在，一般代表『选择进行动作的行数』，举例来说，如果我的动作是需要在 10 到 20 行之间进行的，则『 10,20[动作行为] 』

function：
a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)～
c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行！
d ：删除，因为是删除啊，所以 d 后面通常不接任何咚咚；
i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)；
p ：列印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行～
s ：取代，可以直接进行取代的工作哩！通常这个 s 的动作可以搭配正规表示法！例如 1,20s/old/new/g 就是啦！
```

#### 常见用法

#### 1. 替换文本

```bash
sed 's/原文本/新文本/' 文件名
```

- `s`：表示替换（substitute）。
- `/原文本/新文本/`：用新文本替换原文本。

##### 示例：

假设有一个文件 `example.txt`，内容如下：

```
Hello World
Hello Linux
```

使用 `sed` 替换 `Hello` 为 `Hi`：

```bash
sed 's/Hello/Hi/' example.txt
```

输出：

```
Hi World
Hello Linux
```

默认情况下，`sed` 只会替换每行中的第一个匹配项。如果想要替换每行中的所有匹配项，可以在命令末尾添加 `g`（全局替换）：

```bash
sed 's/Hello/Hi/g' example.txt
```

输出：

```
Hi World
Hi Linux
```

#### 2. 直接修改文件内容

使用 `-i` 选项可以直接修改文件内容，而不是输出到终端：

```bash
sed -i 's/Hello/Hi/g' example.txt
```

现在 `example.txt` 的内容被直接修改为：

```
Hi World
Hi Linux
```

#### 3. 删除行

删除包含特定模式的行：

```bash
sed '/模式/d' 文件名
```

##### 示例：

删除包含 `Hello` 的行：

```bash
sed '/Hello/d' example.txt
```

输出：

```

```

(所有行都被删除，因为每行都包含 `Hello`)

#### 4. 插入行

在特定行之前插入文本：

```bash
sed '行号i\插入的文本' 文件名
```

##### 示例：

在第一行前插入 `Welcome to`：

```bash
sed '1i\Welcome to' example.txt
```

输出：

```
Welcome to
Hi World
Hi Linux
```

#### 5. 替换特定行的文本

替换特定行的文本：

```bash
sed '行号s/原文本/新文本/' 文件名
```

##### 示例：

替换第二行的 `Hi` 为 `Hello`：

```bash
sed '2s/Hi/Hello/' example.txt
```

输出：

```
Welcome to
Hi World
Hello Linux
```

#### 组合命令

可以组合多个命令来处理文件：

```bash
sed -e '命令1' -e '命令2' 文件名
```

##### 示例：

先删除包含 `Hello` 的行，再将 `Hi` 替换为 `Hello`：

```bash
sed -e '/Hello/d' -e 's/Hi/Hello/g' example.txt
```

输出：

```
Welcome to
Hello World
```

### awk 命令

`awk` 是一种强大的文本处理工具，常用于分析和处理文本文件中的数据。它基于一种编程语言，能够扫描文本文件，并对匹配的行执行指定的操作。

#### 基本语法

```bash
awk 'pattern { action }' file
```

- `pattern`：模式，表示 `awk` 处理哪些行。
- `{ action }`：动作，表示 `awk` 对匹配行进行哪些操作。
- `file`：要处理的文件。

#### 常见用法

##### 1. 打印指定列

假设有一个文件 `example.txt`，内容如下：

```
John Doe 30
Jane Smith 25
Mike Johnson 40
```

要打印文件中的第一列和第三列，可以使用：

```bash
awk '{ print $1, $3 }' example.txt
```

输出：

```
John 30
Jane 25
Mike 40
```

`$1` 表示第一列，`$3` 表示第三列。

##### 2. 基于模式进行匹配和操作

打印包含 `Jane` 的行：

```bash
awk '/Jane/ { print }' example.txt
```

输出：

```
Jane Smith 25
```

##### 3. 计算列的总和

假设有一个文件 `numbers.txt`，内容如下：

```
10
20
30
40
```

计算第一列的总和：

```bash
awk '{ sum += $1 } END { print sum }' numbers.txt
```

输出：

```
100
```

`{ sum += $1 }`：遍历每一行，将第一列的值累加到变量 `sum` 中。
`END { print sum }`：在处理完所有行后，打印 `sum` 的值。

##### 4. 条件判断和操作

假设有一个文件 `students.txt`，内容如下：

```
Alice 85
Bob 90
Charlie 78
David 92
```

打印分数大于 80 的学生：

```bash
awk '$2 > 80 { print $1 }' students.txt
```

输出：

```
Alice
Bob
David
```

`$2 > 80`：条件，表示分数大于 80。

`awk` 是一个强大的文本处理工具，其 `print` 和 `printf` 命令分别用于输出数据。虽然它们都能输出文本，但使用方法和场景有所不同。

#### `print` 命令和 `printf` 命令

- **`print`**：简单灵活，适用于基本的输出需求，使用默认分隔符输出各字段，支持自定义分隔符。
- **`printf`**：精确格式化输出，适用于需要特定格式的场景，类似于 C 语言的 `printf`，支持更复杂的格式控制。

##### `print` 基本用法

```bash
awk '{ print $1, $2 }' file
```

- `$1`、`$2`：表示第一列和第二列。
- `,`：分隔符，`print` 会在各字段之间添加默认的输出分隔符（通常是空格）。

##### `print` 示例

假设有一个文件 `data.txt`，内容如下：

```
Alice 85
Bob 90
Charlie 78
```

1. 打印第一列和第二列：

```bash
awk '{ print $1, $2 }' data.txt
```

输出：

```
Alice 85
Bob 90
Charlie 78
```

2. 在列之间添加自定义分隔符：

```bash
awk '{ print $1 "-" $2 }' data.txt
```

输出：

```
Alice-85
Bob-90
Charlie-78
```

##### `printf` 基本用法

```bash
awk '{ printf format, $1, $2 }' file
```

- `format`：格式字符串，指定输出格式。

##### `printf` 示例

继续使用 `data.txt` 文件。

1. 打印第一列和第二列，以固定宽度格式输出：

```bash
awk '{ printf "%-10s %-4s\n", $1, $2 }' data.txt
```

输出：

```
Alice      85
Bob        90
Charlie    78
```

- `%s`：字符串格式。
- `%-10s`：左对齐，占 10 个字符宽度。
- `%-4s`：左对齐，占 4 个字符宽度。
- `\n`：换行符。

2. 打印第一列和第二列，以指定的小数点位数输出：

假设我们有一个文件 `grades.txt`，内容如下：

```
Alice 85.678
Bob 90.123
Charlie 78.456
```

使用 `printf` 格式化输出：

```bash
awk '{ printf "%-10s %.2f\n", $1, $2 }' grades.txt
```

输出：

```
Alice      85.68
Bob        90.12
Charlie    78.46
```

- `%.2f`：浮点数格式，保留两位小数。

##### `print` 和 `printf` 详细示例

假设有一个文件 `employees.txt`，内容如下：

```
John Doe 35 55000.75
Jane Smith 28 62000.00
Mike Johnson 40 72000.50
```

1. 使用 `print` 命令输出：

```bash
awk '{ print $1, $2, $3, $4 }' employees.txt
```

输出：

```
John Doe 35 55000.75
Jane Smith 28 62000.00
Mike Johnson 40 72000.50
```

2. 使用 `printf` 命令格式化输出：

```bash
awk '{ printf "%-10s %-10s %2d %10.2f\n", $1, $2, $3, $4 }' employees.txt
```

输出：

```
John       Doe        35  55000.75
Jane       Smith      28  62000.00
Mike       Johnson    40  72000.50
```

- `%-10s`：左对齐，占 10 个字符宽度。
- `%2d`：整数，至少占 2 个字符宽度。
- `%10.2f`：浮点数，占 10 个字符宽度，保留两位小数。

通过这些示例，你可以看到 `print` 和 `printf` 各自的特点和适用场景，选择合适的命令来满足你的输出需求。

#### awk 实际例子

##### 1. 处理 CSV 文件

假设有一个 CSV 文件 `employees.csv`，内容如下：

```
Name,Department,Salary
Alice,HR,5000
Bob,Engineering,6000
Charlie,Marketing,5500
```

打印员工姓名和工资：

```bash
awk -F, '{ print $1, $3 }' employees.csv
```

输出：

```
Name Salary
Alice 5000
Bob 6000
Charlie 5500
```

`-F,`：指定逗号作为分隔符。

##### 2. 条件过滤和统计

统计工资大于 5500 的员工数量：

```bash
awk -F, '$3 > 5500 { count++ } END { print "Number of employees with salary > 5500: " count }' employees.csv
```

输出：

```
Number of employees with salary > 5500: 1
```

`$3 > 5500`：条件，表示工资大于 5500。
`{ count++ }`：如果条件满足，则计数器 `count` 增加 1。
`END { print "Number of employees with salary > 5500: " count }`：在处理完所有行后，打印计数器 `count` 的值。

### grep

`grep` 用于在文件或文本输出中搜索特定的模式。它支持正则表达式，可以进行复杂的文本匹配和筛选操作。

#### 基本语法

```bash
grep [options] pattern [file...]
```

- `pattern`：要搜索的模式，可以是普通字符串或正则表达式。
- `file`：要搜索的文件（可以是多个文件）。

#### 常见选项

- `-i`：忽略大小写。
- `-v`：反转匹配，显示不包含匹配模式的行。
- `-r` 或 `-R`：递归搜索目录中的文件。
- `-n`：显示匹配行的行号。
- `-l`：只显示包含匹配模式的文件名。
- `-c`：显示匹配的行数。
- `-o`：只显示匹配到的部分。
- `-e`: 只能传递一个参数。在单条命令中使用多个 -e 选项，得到多个 pattern，以此实现 OR 操作。
- `-E`: 选项可以用来扩展选项为正则表达式。 如果使用了 grep 命令的选项 -E，则应该使用 `|` 来分割多个 pattern，以此实现 OR 操作

#### 实例说明

##### 1. 基本搜索

在文件 `example.txt` 中搜索包含 `Hello` 的行：

```bash
grep 'Hello' example.txt
```

假设 `example.txt` 的内容如下：

```
Hello World
Hi there
Hello Linux
```

输出：

```
Hello World
Hello Linux
```

##### 2. 忽略大小写搜索

在文件 `example.txt` 中搜索包含 `hello`（不区分大小写）的行：

```bash
grep -i 'hello' example.txt
```

输出：

```
Hello World
Hello Linux
```

##### 3. 反转匹配

显示文件 `example.txt` 中不包含 `Hello` 的行：

```bash
grep -v 'Hello' example.txt
```

输出：

```
Hi there
```

##### 4. 显示行号

显示文件 `example.txt` 中包含 `Hello` 的行及其行号：

```bash
grep -n 'Hello' example.txt
```

输出：

```
1:Hello World
3:Hello Linux
```

##### 5. 搜索多个文件

在文件 `file1.txt` 和 `file2.txt` 中搜索包含 `pattern` 的行：

```bash
grep 'pattern' file1.txt file2.txt
```

输出示例（假设两个文件都有匹配项）：

```
file1.txt:This is a pattern
file2.txt:Another pattern here
```

##### 6. 递归搜索

在目录 `mydir` 中递归搜索包含 `pattern` 的文件：

```bash
grep -r 'pattern' mydir
```

输出示例（假设目录中有匹配项）：

```
mydir/file1.txt:This is a pattern
mydir/subdir/file2.txt:Another pattern here
```

##### 7. 只显示文件名

显示包含 `pattern` 的文件名，而不显示匹配的具体内容：

```bash
grep -l 'pattern' *.txt
```

输出示例（假设匹配的文件是 file1.txt 和 file2.txt）：

```
file1.txt
file2.txt
```

##### 8. 显示匹配的行数

统计文件 `example.txt` 中包含 `Hello` 的行数：

```bash
grep -c 'Hello' example.txt
```

输出：

```
2
```

##### 9. 只显示匹配的部分

在文件 `example.txt` 中只显示匹配到的 `Hello`：

```bash
grep -o 'Hello' example.txt
```

输出：

```
Hello
Hello
```

#### 组合使用

你可以将 `grep` 与其他命令组合使用，以实现更复杂的功能。例如，使用管道将 `ls` 的输出传递给 `grep`，以搜索包含特定模式的文件名：

```bash
ls | grep 'pattern'
```

假设当前目录中的文件名如下：

```
file1.txt
pattern_file.txt
another_pattern_file.txt
```

输出：

```
pattern_file.txt
another_pattern_file.txt
```
