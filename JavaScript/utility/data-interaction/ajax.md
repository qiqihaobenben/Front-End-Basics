## Ajax

**Asynchronous JavaScript and XML : 异步的js和XML，前后端数据交互的一种技术。**  

> Ajax优点  

传输获取数据 , 不用跳转页面，在本页面请求服务器，做到实时验证。  
减少用户返工率并且优化用户体验。  

## 方式

### GET方式

把数据放在url中发送，以获取数据为主  

#### 步骤

**1、创建一个ajax对象**  
```
var ajax = new XMLHttpRequest();
```

**2、传入请求参数**  
```
//method,url,true	参数
ajax.open('get','php/get.php?user='+encodeURI(text.value),true);
```

**3、发送数据**
```
ajax.send();
```

#### 注意点

1、用get方式请求，是有长度限制的。因为是通过地址栏的查询信息来请求的。（即get通过url地址传输，post通过浏览器内部传输）  

2、请求信息在地址栏中显示，直接暴露了用户填写的信息，并且访问的数据会被浏览器缓存到历史记录中，所以说不安全。

3、在get拼接数据的时候要用encodeURI来包一下，不然在IE低版本浏览器中使用中文会乱码的。  
```
encodeURI('刘')  转成url
decodeURI('%E5%88%98')  转成中文
```

4、有缓存问题	解决方法：在url？后面连接一个随机数，时间戳


### POST方式

数据放在 `send()` 中发送  

#### 步骤

**1、创建一个ajax对象**  
```
var ajax = new XMLHttpRequest();
```

**2、传入请求参数**  
```
ajax.open('post','php/post.php',true);
//method,url,true三个参数的含义
1、提交方式 Form-method 
2、提交地址 Form-action 
3、异步（同步）
异步:非阻塞 前面的代码不会影响后面代码的执行
同步:阻塞 前面的代码会影响后面代码的执行
```

**3、设置请求头**
```
ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
```

**4、发送数据**  
```
ajax.send('user=cfangxu')
```

#### 注意点

1. 用post方式请求，理论上来说是没有长度或体积限制的，看具体浏览器和后端的设置。  

2. 数据是通过http正文（请求体-请求正文）进行发送的，不会直接的暴露用户的信息，并且发送的数据不会被浏览器缓存，相对来说是比较安全的。  

3. 在send()的前面需要设置一个请求头（不设置要出错）。  

```
post提交的数据格式有多种

    text/plain
    application/x-www-form-urlencoded - 默认
    multipart/form-data
```
在post提交数据的时候，需要设置请求头`content-type:`值为上面三中类型之一  
```
ajax.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded');
```

4. open的时候，不用像get那样去拼数据，拼接数据是在send中填写。


## 接收数据

### onload 事件

属于html5的，有兼容性问题  
```
ajax.onload = function () {
    //打印传输过来的数据
    console.log(ajax.responseText)
}
```

### onreadystatechange 事件

支持IE6，兼容性好。  
```
其中的readyState属性：请求状态 
0  （初始化）还没有调用open()方法0是监听不到的
1  open() 方法已经被调用
2  send() 方法已经被调用，响应头也已经被接收。 
3  下载中； responseText 属性已经包含部分数据。 
4  下载操作已完成
```
readyState : ajax工作状态  
onreadystatechange : 当readyState改变的时候触发  
status : 服务器状态，http状态码  
responseText : 返回以文本形式存放的内容  ajax请求返回的内容就被存放到这个属性下面  

### 注意  
* 事件监听最好写在事件发生之前(即.onload（.onreadystatechange）要放在.send之前)，避免没有监听到。


## 扩展

### `XMLHttpRequest` 兼容性问题

`new XMLHttpRequest()` ie6 以下不支持，所以需要用到插件  
 `new ActiveXObject('Microsoft.XMLHTTP')`

 ```
兼容写法如下：
var xhr = null;
if (window.XMLHttpRequest) {	
    //直接用XMLHttpRequest是不能做判断的，因为IE6下没有，window.XMLHttpRequest会返回undefined
	xhr = new XMLHttpRequest();
} else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

也可以用try catch来解决。
try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
```  


### 表单提交

**form 标签的一些属性**  
```
action : 数据提交的地址，默认是当前页面

method : 数据提交的方式，默认是get方式
    1.get
    把数据名称和数据值用=连接，如果有多个的话，那么他会把多个数据组合用&进行连接，然后把数据放到url?后面传到指定页面
    2.post
	通过请求头进行请求

enctype : 提交的数据格式，默认application/x-www-form-urlencoded
```

### 上传文件

不管是form还是ajax,上传必须要用post请求方式来传输。如果后端返回的内容有中文编码格式，那么直接输入到页面中就能变成中文了。  

#### form 

```
<form action="post_file.php" method="post" enctype="multipart/form-data">
	   	<input type="file" name="file" id="f" value="" />
	   	<input type="submit" value="上传"/>
</form>
action会跳转页面
```

#### ajax

```
var ajax = new XMLHttpRequest();

ajax.open('post','post_file.php',true);

//传输类型设置为二进制的格式
ajax.setRequestHeader('Content-Type','multipart/form-data');

//二进制传输在写入send前要用FormData转换
var fromD = new FormData();	

//FormData构造函数中有一个append方法
//在file中，有一个对象：files（详细信息的列表）files[0]里面是files的具体参数；
fromD.append('file',f.files[0]);	

ajax.send(fromD)


ajax的上传方式需要注意以下几点：
1.new FormData()

2.给这个对象append(key,value)
key：跟后端的要求走
value:file元素的files[0];

3.send(这个对象)
```








