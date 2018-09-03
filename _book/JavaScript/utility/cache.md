## 三种本地存储方式和一些扩展

## cookie

### **前言**  

网络早期最大的问题之一是如何管理状态。简而言之，服务器无法知道两个请求是否来自同一个浏览器。当时最简单的方法是在请求时，在页面中插入一些参数，并在下一个请求中传回参数。这需要使用包含参数的隐藏的表单，或者作为URL参数的一部分传递。这两个解决方案都手动操作，容易出错。cookie出现来解决这个问题。

### **作用**  

cookie是纯文本，没有可执行代码。存储数据，当用户访问了某个网站（网页）的时候，我们就可以通过cookie来向访问者电脑上存储数据，或者某些网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密）

### **如何工作**  

当网页要发http请求时，浏览器会先检查是否有相应的cookie，有则自动添加在request header中的cookie字段中。这些是浏览器自动帮我们做的，而且每一次http请求浏览器都会自动帮我们做。这个特点很重要，因为这关系到“什么样的数据适合存储在cookie中”。  

存储在cookie中的数据，每次都会被浏览器自动放在http请求中，如果这些数据并不是每个请求都需要发给服务端的数据，浏览器这设置自动处理无疑增加了网络开销；但如果这些数据是每个请求都需要发给服务端的数据（比如身份认证信息），浏览器这设置自动处理就大大免去了重复添加操作。所以对于那种设置“每次请求都要携带的信息（最典型的就是身份认证信息）”就特别适合放在cookie中，其他类型的数据就不适合了。

### **特征**  

1. 不同的浏览器存放的cookie位置不一样，也是不能通用的。
2. cookie的存储是以域名形式进行区分的，不同的域下存储的cookie是独立的。
3. 我们可以设置cookie生效的域（当前设置cookie所在域的子域），也就是说，我们能够操作的cookie是当前域以及当前域下的所有子域
4. 一个域名下存放的cookie的个数是有限制的，不同的浏览器存放的个数不一样,一般为20个。
5. 每个cookie存放的内容大小也是有限制的，不同的浏览器存放大小不一样，一般为4KB。
6. cookie也可以设置过期的时间，默认是会话结束的时候，当时间到期自动销毁

### **cookie值既可以设置，也可以读取。**

#### 设置  
    
**客户端设置**
```
document.cookie = '名字=值';
document.cookie = 'username=cfangxu;domain=baike.baidu.com'	并且设置了生效域
```  

**注意：** 客户端可以设置cookie 的下列选项：expires、domain、path、secure（有条件：只有在https协议的网页中，客户端设置secure类型的 cookie 才能成功），但无法设置HttpOnly选项。  

**服务器端设置**  
不管你是请求一个资源文件（如 html/js/css/图片），还是发送一个ajax请求，服务端都会返回response。而response header中有一项叫set-cookie，是服务端专门用来设置cookie的。
```
Set-Cookie 消息头是一个字符串，其格式如下（中括号中的部分是可选的）：
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```  

**注意：** 一个set-Cookie字段只能设置一个cookie，当你要想设置多个 cookie，需要添加同样多的set-Cookie字段。  
服务端可以设置cookie 的所有选项：expires、domain、path、secure、HttpOnly  
通过 Set-Cookie 指定的这些可选项只会在浏览器端使用，而不会被发送至服务器端。

#### 读取  

我们通过document.cookie来获取当前网站下的cookie的时候，得到的字符串形式的值，它包含了当前网站下所有的cookie（为避免跨域脚本(xss)攻击，这个方法只能获取非 HttpOnly 类型的cookie）。它会把所有的cookie通过一个分号+空格的形式串联起来，例如`username=chenfangxu; job=coding`

#### 修改 cookie  

要想修改一个cookie，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。

#### 删除

把要删除的cookie的过期时间设置成已过去的时间,path/domain/这几个选项一定要旧cookie 保持一样。

#### 注意

如果只设置一个值，那么算cookie中的value; 设置的两个cookie,key值如果设置的相同，下面的也会把上面的覆盖。


### **cookie的属性（可选项）**   

#### 过期时间  

如果我们想长时间存放一个cookie。需要在设置这个cookie的时候同时给他设置一个过期的时间。如果不设置，cookie默认是临时存储的，当浏览器关闭进程的时候自动销毁  
```
注意：document.cookie = '名称=值;expires=' + GMT(格林威治时间)格式的日期型字符串; 
```  
一般设置天数：new Date().setDate( oDate.getDate() + 5 );	比当前时间多5天  

一个设置cookie时效性的例子  
```
function setCookie(c_name, value, expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
使用方法：setCookie('username','cfangxu',30)
```  
> expires 是 http/1.0协议中的选项，在新的http/1.1协议中expires已经由 max-age 选项代替，两者的作用都是限制cookie 的有效时间。expires的值是一个时间点（cookie失效时刻= expires），而max-age 的值是一个以秒为单位时间段（cookie失效时刻= 创建时刻+ max-age）。  
另外，max-age 的默认值是 -1(即有效期为 session )；max-age有三种可能值：负数、0、正数。  
负数：有效期session；  
0：删除cookie；  
正数：有效期为创建时刻+ max-age  

### cookie的域概念（domain选项）  

domain指定了 cookie 将要被发送至哪个或哪些域中。默认情况下，domain 会被设置为创建该 cookie 的页面所在的域名，所以当给相同域名发送请求时该 cookie 会被发送至服务器。  

浏览器会把 domain 的值与请求的域名做一个尾部比较（即从字符串的尾部开始比较），并将匹配的 cookie 发送至服务器。

#### **客户端设置**  

`document.cookie = "username=cfangxu;path=/;domain=qq.com"`  
如上：“www.qq.com" 与 "sports.qq.com" 公用一个关联的域名"qq.com"，我们如果想让 "sports.qq.com" 下的cookie被 "www.qq.com" 访问，我们就需要用到 cookie 的domain属性，并且需要把path属性设置为 "/"。  

#### **服务端设置**  

`Set-Cookie: username=cfangxu;path=/;domain=qq.com`  
*注：一定的是同域之间的访问，不能把domain的值设置成非主域的域名。*

### cookie的路径概念（path选项）  

cookie 一般都是由于用户访问页面而被创建的，可是并不是只有在创建 cookie 的页面才可以访问这个 cookie。  
因为安全方面的考虑,默认情况下，只有与创建 cookie 的页面在同一个目录或子目录下的网页才可以访问。
即path属性可以为服务器特定文档指定cookie，这个属性设置的url且带有这个前缀的url路径都是有效的。  

#### **客户端设置**  

 最常用的例子就是让 cookie 在根目录下,这样不管是哪个子页面创建的 cookie，所有的页面都可以访问到了。  

`document.cookie = "username=cfangxu; path=/"` 

#### **服务端设置**  

`Set-Cookie:name=cfangxu; path=/blog`  

如上设置：path 选项值会与 /blog，/blogrool 等等相匹配；任何以 /blog 开头的选项都是合法的。需要注意的是，只有在 domain 选项核实完毕之后才会对 path 属性进行比较。path 属性的默认值是发送 Set-Cookie 消息头所对应的 URL 中的 path 部分。

#### **domain和path总结：**  

domain是域名，path是路径，两者加起来就构成了 URL，domain和path一起来限制 cookie 能被哪些 URL 访问。  
所以domain和path2个选项共同决定了cookie何时被浏览器自动添加到请求头部中发送出去。如果没有设置这两个选项，则会使用默认值。domain的默认值为设置该cookie的网页所在的域名，path默认值为设置该cookie的网页所在的目录。  

### cookie的安全性（secure选项）  

通常 cookie 信息都是使用HTTP连接传递数据，这种传递方式很容易被查看，所以 cookie 存储的信息容易被窃取。假如 cookie 中所传递的内容比较重要，那么就要求使用加密的数据传输。  

secure选项用来设置cookie只在确保安全的请求中才会发送。当请求是HTTPS或者其他安全协议时，包含 secure 选项的 cookie 才能被发送至服务器。  

`document.cookie = "username=cfangxu; secure"`  

把cookie设置为secure，只保证 cookie 与服务器之间的数据传输过程加密，而保存在本地的 cookie文件并不加密。就算设置了secure 属性也并不代表他人不能看到你机器本地保存的 cookie 信息。机密且敏感的信息绝不应该在 cookie 中存储或传输，因为 cookie 的整个机制原本都是不安全的  

**注意：如果想在客户端即网页中通过 js 去设置secure类型的 cookie，必须保证网页是https协议的。在http协议的网页中是无法设置secure类型cookie的。**

### httpOnly  

这个选项用来设置cookie是否能通过 js 去访问。默认情况下，cookie不会带httpOnly选项(即为空)，所以默认情况下，客户端是可以通过js代码去访问（包括读取、修改、删除等）这个cookie的。当cookie带httpOnly选项时，客户端则无法通过js代码去访问（包括读取、修改、删除等）这个cookie。  

**在客户端是不能通过js代码去设置一个httpOnly类型的cookie的，这种类型的cookie只能通过服务端来设置。**

### **cookie的编码**  

cookie其实是个字符串，但这个字符串中等号、分号、空格被当做了特殊符号。所以当cookie的 key 和 value 中含有这3个特殊字符时，需要对其进行额外编码，一般会用escape进行编码，读取时用unescape进行解码；当然也可以用encodeURIComponent/decodeURIComponent或者encodeURI/decodeURI，[查看关于编码的介绍](http://www.cnblogs.com/season-huang/p/3439277.html)

### **第三方cookie**  
通常cookie的域和浏览器地址的域匹配，这被称为第一方cookie。那么第三方cookie就是cookie的域和地址栏中的域不匹配，这种cookie通常被用在第三方广告网站。为了跟踪用户的浏览记录，并且根据收集的用户的浏览习惯，给用户推送相关的广告。  
关于第三方cookie和cookie的安全问题可以查看[https://mp.weixin.qq.com/s/oOGIuJCplPVW3BuIx9tNQg](https://mp.weixin.qq.com/s/oOGIuJCplPVW3BuIx9tNQg)  

* **cookie推荐资源**
  - [聊一聊 cookie](https://segmentfault.com/a/1190000004556040)  
  - [HTTP cookies 详解](http://bubkoo.com/2014/04/21/http-cookies-explained/)  

---
---

## localStorage（本地存储）

HTML5新方法，不过**IE8及以上**浏览器都兼容。  

### 特点  

- 生命周期：持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。  
- 存储的信息在同一域中是共享的。  
- 当本页操作（新增、修改、删除）了localStorage的时候，本页面不会触发storage事件,但是别的页面会触发storage事件。  
- 大小：据说是5M（跟浏览器厂商有关系）  
- 在非IE下的浏览中可以本地打开。IE浏览器要在服务器中打开。  
- localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡
- localStorage受同源策略的限制

### 设置  
`localStorage.setItem('username','cfangxu');`  

### 获取  
`localStorage.getItem('username')`  
也可以获取键名  
`localStorage.key(0) #获取第一个键名 `

### 删除  
`localStorage.removeItem('username')`  
也可以一次性清除所有存储  
`localStorage.clear()`

### storage事件  
当storage发生改变的时候触发。  
**注意：** 当前页面对storage的操作会触发其他页面的storage事件  
事件的回调函数中有一个参数event,是一个StorageEvent对象，提供了一些实用的属性,如下表：  

| Property | Type | Description |
| :---: | :---: | :--- |
| key | String | The named key that was added, removed, or moddified |
| oldValue | Any | The previous value(now overwritten), or null if a new item was added |
| newValue | Any | The new value, or null if an item was added |
| url/uri | String | The page that called the method that triggered this change |  

---
---

## sessionStorage 

其实跟localStorage差不多，也是本地存储，会话本地存储

### 特点：

- 用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。也就是说只要这个浏览器窗口没有关闭，即使刷新页面或进入同源另一页面，数据仍然存在。关闭窗口后，sessionStorage即被销毁，或者在新窗口打开同源的另一个页面，sessionStorage也是没有的。

---
---

## cookie、localStorage、sessionStorage区别

* 相同：在本地（浏览器端）存储数据

* 不同：  

  localStorage、sessionStorage  

  localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。  

  sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。    

  localStorage是永久存储，除非手动删除。  

  sessionStorage当会话结束（当前页面关闭的时候，自动销毁） 

  cookie的数据会在每一次发送http请求的时候，同时发送给服务器而localStorage、sessionStorage不会。

<br />

## 扩展其他的前端存储方式（不常用）

### web SQL database  

先说个会被取代的，为什么会被取代，主要有以下几个原因：  
1. W3C舍弃 `Web SQL database`草案,而且是在2010年年底，规范不支持了，浏览器厂商已经支持的就支持了，没有支持的也不打算支持了，比如IE和Firefox。

2. 为什么要舍弃？因为 `Web SQL database` 本质上是一个关系型数据库，后端可能熟悉，但是前端就有很多不熟悉了，虽然SQL的简单操作不难，但是也得需要学习。

3. SQL熟悉后，真实操作中还得把你要存储的东西，比如对象，转成SQL语句，也挺麻烦的。

### indexedDB  

> 来自MDN的解释： indexedDB 是一种低级API，用于客户端存储大量结构化数据(包括, 文件/ blobs)。该API使用索引来实现对该数据的高性能搜索。虽然 Web Storage 对于存储较少量的数据很有用，但对于存储更大量的结构化数据来说，这种方法不太有用。IndexedDB提供了一个解决方案。

所以，`IndexedDB` API是强大的，但对于简单的情况可能看起来太复杂了，所以要看你的业务场景来选择到底是用还是不用。

`indexedDB` 是一个基于JavaScript的面向对象的数据库。 `IndexedDB`允许你存储和检索用键索引的对象;

IndexedDB 鼓励使用的基本模式如下所示：  
* 打开数据库并且开始一个事务。
* 创建一个 object store。
* 构建一个请求来执行一些数据库操作，像增加或提取数据等。
* 通过监听正确类型的 DOM 事件以等待操作完成。
* 在操作结果上进行一些操作（可以在 request 对象中找到）

#### 1、首先打开indexedDB数据库  

语法：  
`window.indexedDB.open(dbName, version)`  

```
var db;
// 打开数据库,open还有第二个参数版本号
var request = window.indexedDB.open('myTestDatabase');
// 数据库打开成功后
request.onsuccess = function (event) {
    // 存储数据结果,后面所有的数据库操作都离不开它。
    db = request.result;
}
request.onerror = function (event) {
    alert("Why didn't you allow my web app to use IndexedDB?!");
}

// 数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
request.onupgradeneeded = function (event) {

}
```
**onupgradeneeded事件：** 更新数据库的 schema，也就是创建或者删除对象存储空间，这个事件将会作为一个允许你处理对象存储空间的 `versionchange` 事务的一部分被调用。在数据库第一次被打开时或者当指定的版本号高于当前被持久化的数据库的版本号时，这个 `versionchange` 事务将被创建。`onupgradeneeded` 是我们唯一可以修改数据库结构的地方。在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。

#### 2、构建数据库

IndexedDB 使用对象存储空间而不是表，并且一个单独的数据库可以包含任意数量的对象存储空间。每当一个值被存储进一个对象存储空间时，它会被和一个键相关联。

```
  // 数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
  request.onupgradeneeded = function (event) {

      //之前咱们不是在success中得到了db了么，为什么还要在这获取，
      //因为在当前事件函数执行后才会去执行success事件
      var db = event.target.result;

      // 创建一个对象存储空间，keyPath是id，keyGenerator是自增的
      var objectStore = db.createObjectStore('testItem',{keyPath: 'id',autoIncrement: true});
      // 创建一个索引来通过id搜索，id是自增的，不会有重复，所以可以用唯一索引
      objectStore.createIndex('id','id',{unique: true})

      objectStore.createIndex('name','name');
      objectStore.createIndex('age','age');

      //添加一条信息道数据库中
      objectStore.add({name: 'cfangxu', age: '27'});

  }
```
**注意：** 执行完后，在调试工具栏Application的indexedDB中也看不到，你得右键刷新一下。

**创建索引的语法：**  
```
objectStore.createIndex(indexName, keyPath, objectParameters)

indexName:创建的索引名称，可以使用空名称作为索引。
keyPath:索引使用的关键路径，可以使用空的keyPath, 或者keyPath传为数组keyPath也是可以的。
objectParameters:可选参数。常用参数之一是unique，表示该字段值是否唯一，不能重复。例如，本demo中id是不能重复的，于是有设置：
```

#### 3、添加数据

上面的代码建好了字段，并且添加了一条数据，但是我们如果想在onupgradeneeded事件外面操作，接下来的步骤了。  
由于数据库的操作都是基于事务（transaction）来进行，于是，无论是添加编辑还是删除数据库，我们都要先建立一个事务（transaction），然后才能继续下面的操作。  
语法： `var transaction = db.transaction(dbName, "readwrite");`  
第一个参数是事务希望跨越的对象存储空间的列表，可以是数组或者字符串。如果你希望事务能够跨越所有的对象存储空间你可以传入一个空数组。如果你没有为第二个参数指定任何内容，你得到的是只读事务。因为这里我们是想要写入所以我们需要传入 "readwrite" 标识。
```
var timer = setInterval(function () {
    if(db) {
        clearInterval(timer);
        // 新建一个事务
        var transaction = db.transaction(['testItem'], 'readwrite');
        // 打开一个存储对象
        var objectStore = transaction.objectStore('testItem');
        // 添加数据到对象中
        objectStore.add({ name: 'xiaoming', age: '12' });
        objectStore.add({ name: 'xiaolong', age: '20' });
    }
},100)
```
**为什么要用一个间隔定时器？** 因为这是一个demo，正常的是要有操作才能进行数据库的写入，在我们的demo中，js执行到transaction会比indexedDB的onsuccess事件回调快，导致会拿到db为undefined，所以写了个间隔定时器等它一会。

#### 4、获取数据

```
var transaction = db.transaction(['testItem'], 'readwrite');

var objectStore = transaction.objectStore('testItem');

var getRquest = objectStore.get(1);
getRquest.onsuccess = function (event) {
    console.log(getRquest.result);
}
//输出：{name: "cfangxu", age: "27", id: 1}
```

#### 5、修改数据

```
var transaction = db.transaction(['testItem'], 'readwrite');

var objectStore = transaction.objectStore('testItem');

var getRquest = objectStore.put({ name: 'chenfangxu', age: '27', id:1 });
// 修改了id为1的那条数据
```

#### 6、删除数据

```
var transaction = db.transaction(['testItem'], 'readwrite');

var objectStore = transaction.objectStore('testItem');

var getRquest = objectStore.delete(1);
// 删除了id为1的那条数据
```

> 上面的例子执行完后，一定一定要右键刷新indexedDB,它自己是不会变的。

* 关于数据库的名词解释和indexedDB的游标介绍参阅：[HTML5 indexedDB前端本地存储数据库实例教程](http://www.zhangxinxu.com/wordpress/2017/07/html5-indexeddb-js-example/) 张大神的文中没有指出新手要踩的坑，我踩完也说明了。
















