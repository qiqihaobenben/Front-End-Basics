# Ajax

**Asynchronous JavaScript and XML : 异步的js和XML，前后端数据交互的一种技术。**  

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
ajax.open('get','php/get.php?user='+encodeURIComponent(value),true);
```

**3、发送数据**
```
ajax.send(null);
```
send()方法传入一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。

#### 注意点

1、用get方式请求，是有长度限制的。因为是通过地址栏的查询信息来请求的。（即get通过url地址传输，post通过浏览器内部传输）  

2、请求信息在地址栏中显示，直接暴露了用户填写的信息，并且访问的数据会被浏览器缓存到历史记录中，所以说不安全。

3、在get拼接数据的时候要用encodeURIComponent来包一下，不然在IE低版本浏览器中使用中文会乱码的。  
```
encodeURIComponent('刘')  转成url
decodeURIComponent('%E5%88%98')  转成中文
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

// 要成功的发送请求头部信息，必须在调用open() 方法之后且调用send()方法之前调用setRequestHeader()
```

**4、发送数据**  
```
ajax.send('user=cfangxu')
```

#### 注意点

1. 用post方式请求，理论上来说是没有长度或体积限制的，看具体浏览器和后端的设置。  

2. 数据是通过http正文（请求体-请求正文）进行发送的，不会直接的暴露用户的信息，并且发送的数据不会被浏览器缓存，相对来说是比较安全的。  

3. 在send()的前面需要设置一个请求头（不设置要出错）。  

```
post提交的数据格式有多种

    text/plain
    application/x-www-form-urlencoded - 默认
    multipart/form-data
```
在post提交数据的时候，需要设置请求头`content-type:`值可以为上面三中类型之一  
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
0  （未初始化）还没有调用open()方法0是监听不到的
1  启动，open() 方法已经被调用。
2  发送，send() 方法已经被调用，但尚未接收到响应。 
3  接收，已经接收到部分相应数据。 
4  完成，已经接收到全部响应数据，而且可以在客户端使用了。
```
readyState : ajax工作状态  
onreadystatechange : 当readyState改变的时候触发  
status : 服务器状态，http状态码  
responseText : 返回以文本形式存放的内容  ajax请求返回的内容就被存放到这个属性下面  

### 注意  
* 事件监听最好写在事件发生之前(即.onload（.onreadystatechange）要放在.send之前)，避免没有监听到。


## 扩展

### `XMLHttpRequest` 兼容性问题，单纯了解，可以直接略过

`new XMLHttpRequest()` ie6 及以下不支持，所以需要用到插件  
 `new ActiveXObject('MSXML2.XMLHTTP')`
 IE中会有三种不同的XHR版本： `MSXML2.XMLHTTP` 、 `MSXML2.XMLHTTP.3.0` 、 `MSXML2.XMLHTTP.6.0` 因为只做了解，这里用最老的那一版

 ```
兼容写法如下：
var xhr = null;
if (window.XMLHttpRequest) {	
    //直接用XMLHttpRequest是不能做判断的，因为IE6下没有，window.XMLHttpRequest会返回undefined
	xhr = new XMLHttpRequest();
} else {
    xhr = new ActiveXObject('MSXML2.XMLHTTP');
}

也可以用try catch来解决。
try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('MSXML2.XMLHTTP');
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

### XMLHttpRequest 2级

#### FormData

上面的ajax上传文件用到的 `FormData` 类型就是 `XMLHttpRequest 2级`中定义的。

FormData 为序列化表单以及创建与表单格式相同的数据(用于XHR传输)提供了便利。
```
var data = new FormData();
data.append('name','cfangxu');
```
`append()`方法接收两个参数：键和值，分别对应表单字段的名字和字段中包含的值。可以像上面代码一样添加任意多个值。

FormData 构造函数可以直接传入表单元素，表单元素的数据预先向其中填入键值对。
```
var data = new FormData(document.forms[0]);
```

FormData的另一个方便之处在于用其发送POST请求可以不必明确地在XHR对象上设置请求头部，XHR对象能够识别传入的数据类型是FormData的实例，并配置适当的头部信息。

#### overrideMimeType() 方法

重写XHR响应的MIME类型，比如服务器返回的MIME类型是 `text/plain`，但是数据中实际包含的是XML。根据MIME类型，即使数据是XML， responseXML属性中仍然是null，通过调用 `overrideMimeType()`方法，可以保证把响应当做XML而并非文本来处理。
```
var xhr = new XMLHttpRequest();
xhr.open('get','text.php',true);
xhr.overrideMimeType('text/xml');
xhr.send(null);
```

#### load 事件

上面提到过，用load事件替代readystatechange,响应接收完毕后会触发load事件，所以也就没有必要去检查readyState属性了，不过只要浏览器接收到服务器的响应，不管状态如何，都会触发load事件。所以必须要检查status属性，才能确定数据是否真的是可用的。
```
var xhr = new XMLHttpRequest();
xhr.onload = function () {
    if(xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
    }else {
        console.log('Request is unsuccessful' + xhr.status)
    }
}
xhr.open('get','test.php',true);
xhr.send(null);
```

#### progress 事件

这个事件会在浏览器接收新数据期间周期性地触发。事件监听函数会接收到一个event对象，其target属性是XHR对象，但是包含着三个额外的属性：lengthComputable、position和totalSize。

* lengthComputable: 是一个表示进度信息是否可用的布尔值。

* position: 表示已经接收的字节数

* totalSize: 表示根据Content-Length响应头部确定的预期字节数。

这些信息可以用来展示进度。
```
var xhr = new XMLHttpRequest();
xhr.onload = function () {
    if(xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
    }else {
        console.log('Request is unsuccessful' + xhr.status)
    }
}
xhr.onprogress = function (event) {
    var showEle = document.getElementById('status');
    if(event.lengthComputable){
        showEle.innerHTML = '接收' + event.position + 'of' + event.totalSize + '字节';
    }
}
xhr.open('get','test.php',true);
xhr.send(null);
```
为确保正常执行，必须在调用open()方法之前添加onprogress事件监听函数。


## 总结

### XMLHttpRequest实例的属性

readyState   
responseType  
responseText  
responseXML  
status  
statusText  
withCredentials  

### XMLHttpRequest实例的方法

abort()  abort方法用来终止已经发出的HTTP请求。  
getAllResponseHeaders()  
getResponseHeader()  
open()  
send()  
setRequestHeader()  
overrideMimeType()  

### XMLHttpRequest实例的事件

readyStateChange事件  
progress事件  
load事件






