### cookie

* **作用**  
存储数据，当用户访问了某个网站（网页）的时候，我们就可以通过cookie来向访问者电脑上存储数据，或者某些网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密）

* **特征**  

1. 不同的浏览器存放的cookie位置不一样，也是不能通用的。
2. cookie的存储是以域名形式进行区分的，不同的域下存储的cookie是独立的。
3. 我们可以设置cookie生效的域（当前设置cookie所在域的子域），也就是说，我们能够操作的cookie是当前域以及当前域下的所有子域
4. 一个域名下存放的cookie的个数是有限制的，不同的浏览器存放的个数不一样
5. 每个cookie存放的内容大小也是有限制的，不同的浏览器存放大小不一样
6. cookie也可以设置过期的时间，默认是会话结束的时候，当时间到期自动销毁

* **cookie值既可以设置，也可以读取。**
    - 设置：  
    ```
    document.cookie = '名字=值';
    document.cookie = 'username=cfangxu;domain=baike.baidu.com'	并且设置了生效域
    ```
    - 读取：  
    我们通过document.cookie来获取当前网站下的cookie的时候，得到的字符串形式的值，它包含了当前网站下所有的cookie。它会把所有的cookie通过一个分号+空格的形式串联起来，例如`username=chenfangxu; job=coding`

    - 删除：把要删除的cookie的过期时间设置成已过去的时间

    - 注意：如果只设置一个值，那么算cookie中的value; 设置的两个cookie,key值如果设置的相同，下面的也会把上面的覆盖。

    - cookie的过期时间  
    如果我们想长时间存放一个cookie。需要在设置这个cookie的时候同时给他设置一个过期的时间。如果不设置，cookie默认是临时存储的，当浏览器关闭进程的时候自动销毁  
    ```
    注意：document.cookie = '名称=值;expires=' + 字符串格式的时间; 
    ```  
    一般设置天数：new Date().setDate( oDate.getDate() + 5 );	比当前时间多5天  
    IE下如果不把日期转化成字符串，会报错。要用toGMTString()转化。  
    ```
    即：document.cookie = 'username=leo;expires=' + oDate.toGMTString();
    ```







