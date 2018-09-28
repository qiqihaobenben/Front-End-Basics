做vue开发，基本的操作会了之后是不是特想撸一撸vue的插件，让自己的代码可（**骚**）复（**骚**）用（**的**）。别急，今天和你一起手摸手，哦呸，是手把手，一起撸一管，哦再呸，是封装一个基于vue的支付宝密码弹窗插件。然后还会介绍如何书写插件的markdown说明文档、发布到github、在github设置项目的运行地址、发布npm包。

简单看下效果图，主要实现密码输入完成自动触发输入完成的回调函数，自定义标题、自定义高亮颜色、自定义加载动画，密码错误弹窗，可清空密码等基本操作。

![](https://user-gold-cdn.xitu.io/2018/9/12/165cc517366bdf52?imageslim)  

开发插件
-----------------------------------------------------------------------

开发vue插件之前呢，先说下封装插件的目的是什么？封装插件的目的就是为了代码的可复用，既然是为了可复用，那么只要能实现可复用的操作，封装方式就可以多样化。这和jq的`$.fn.myPlugin =` `function(){}`有些区别。先来看下官方文档对于vue插件的说明：

插件通常会为 Vue 添加全局功能。插件的范围没有限制——一般有下面几种：

1. 添加全局方法或者属性，如: [vue-custom-element](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fkarol-f%2Fvue-custom-element)
    
2. 添加全局资源：指令/过滤器/过渡等，如 [vue-touch](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-touch)
    
3. 通过全局 mixin 方法添加一些组件选项，如: [vue-router](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-router)
    
4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
    
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 [vue-router](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-router)
    

    MyPlugin.install = function (Vue, options) {
        // 第一种方法. 添加全局方法或属性
        Vue.myGlobalMethod = function () {
            // 逻辑...
        }
    
        // 第二种方法. 添加全局资源
        Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {
                // 逻辑...
            }
            ...
        })
    
        // 第三种方法. 注入组件
        Vue.mixin({
            created: function () {
            // 逻辑...
            }
             ...
        })
    
        // 第五种方法. 添加实例方法
        Vue.prototype.$myMethod = function (methodOptions) {
            // 逻辑...
        }
    
        // 第六种方法，注册组件
        Vue.component(组件名, 组件)
    }

这些形式都可以作为我们的插件开发。插件的本质不就是为了代码的复用吗？根据你的封装需求选择不同的形式，例如`toast提示`可以选择`Vue.prototype`，输入框自动获取焦点可以选择`Vue.directive`指令，自定义组件可以选择`Vue.component`的形式。

因为我们的支付密码框可以看作为一个组件，所以才有`Vue.compnent`的形式。下面开始搭建基本的一个壳：

为了大家能看到项目运行起来，先初始化一个vue的项目。然后在src新建一个lib文件夹用于存放各个插件，在lib下新建一个vpay文件夹存放我们的插件。

在vpay文件夹下，新建一个index.js和一个lib文件夹，而我们真正的插件是写在新建的这个lib文件夹中的。这里之所以这么创建是因为后面还有在这里初始化npm包，发布到npm上：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d19d0c066d565?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

暂时先不管npm包的内容，这个最后再说。先看插件这一块，根据上述内容创建对应文件。

然后我们开始搭建插件开发的基本壳子，在插件的index.js中：

    // pay.vue写我们的组件
    import vpay from './pay'
    
    // 定义我们的插件
    const myPlugin = {    
        // 该插件有一个install方法
        // 方法的第一个参数是传入的Vue，第二个参数可以插件的自定义参数
        install (Vue, options) {
            // 将其注册为vue的组件，'vpay'是组件名，keyboard是我们开发的组件
            Vue.component('vpay', vpay)    
        }
    }
    
    // 最后将插件导出，并在main.js中通过Vue.use()即可使用插件
    export default myPlugin

待插件开发好后，就可以在mian.js中这样使用：

    // 引入插件
    import vpay from './lib/vpay'
    // 使用插件
    Vue.use(vpay);

而后在我们的页面中就可以直接像使用组件的方式使用插件：

    <!--支付密码弹窗-->
    <vpay    
        ref="pays"    
        v-model="show"               
        @close="close"    
        @forget="forget"    
        @input-end="inputEnd"
    ></vpay>

是不是跟我们平时使用插件的形式如出一辙？基本思路和插件的壳子有了，下面就开始开发pay.vue，这插件的具体内容了。这部分的开发，说的简单些，其实就和平时写个父子组件般，因为我们最后想向上面那种自定义组件的形式使用。

pay.vue文件：

* 首先是布局，这里不多说了，直接上代码吧。代码略微粗糙，主要用于演示：
```
    <template>    
        <div class="zfb-pay" v-if="show">        
            <div class="content">
                <!--标题栏-->            
                <header class="pay-title">                
                    <div class="ico-back" @click="cancel"></div>                
                    <h3>{{title}}</h3>            
                </header>
                
                <!--密码框-->            
                <div class="pass-box">                
                    <ul class="pass-area">                    
                        <li class="pass-item"                        
                            :class="{on: password.length > index}"                        
                            v-for="(item, index) in digit"                         
                            :key="index"></li>                                      
                    </ul>            
                </div>
     
                <!--忘记密码-->            
                <div class="forget-pass">                
                    <div class="forget-pass-btn" @click="forget">忘记密码</div>            
                </div>
    
                <!--键盘区-->            
                <ul class="keyboard">                
                    <li @click="onKeyboard(1)">                    
                        <p class="num"><strong>1</strong></p>                    
                        <p class="character"></p>                
                    </li>                
                    <li @click="onKeyboard(2)">                    
                        <p class="num"><strong>2</strong></p>                    
                        <p class="character">ABC</p>                
                        </li>                
                    <li @click="onKeyboard(3)">                    
                        <p class="num"><strong>3</strong></p>                    
                        <p class="character">DEF</p>                
                    </li>                
                    <li @click="onKeyboard(4)">                    
                        <p class="num"><strong>4</strong></p>                    
                        <p class="character">GHI</p>                
                    </li>                
                    <li @click="onKeyboard(5)">                    
                        <p class="num"><strong>5</strong></p>                    
                        <p class="character">JKL</p>                
                    </li>                
                    <li @click="onKeyboard(6)">                    
                        <p class="num"><strong>1</strong></p>                    
                        <p class="character">MNO</p>                
                    </li>                
                    <li @click="onKeyboard(7)">                    
                        <p class="num"><strong>7</strong></p>                    
                        <p class="character">PQRS</p>                
                    </li>                
                    <li @click="onKeyboard(8)">                    
                        <p class="num"><strong>8</strong></p>                    
                        <p class="character">TUV</p>                
                    </li>                
                    <li @click="onKeyboard(9)">                    
                        <p class="num"><strong>9</strong></p>                    
                        <p class="character">WXYZ</p>                
                    </li>                
                    <li class="none"></li>                
                    <li class="zero" @click="onKeyboard(0)"><strong>0</strong></li>                
                    <li class="delete" @click="deleteKey"></li>                        
                </ul>
    
                <!--加载中状态-->            
                <div class="loading-wrap" v-if="payStatus !== 0">                
                    <div class="loading">                    
                        <!--加载图标-->                    
                        <img src="@/assets/loading.png" class="loading-ico" alt="" v-if="payStatus === 1">
                        <img src="@/assets/success.png" class="success-ico" alt="" v-if="payStatus === 2">
                        <!--加载文字-->                    
                        <p v-if="payStatus === 1">{{loadingText}}</p>                    
                        <p v-if="payStatus === 2">{{finishedText}}</p>
                    </div>            
                </div>
    
                <!--支付失败提示框-->            
                <div class="pay-fail" v-if="isShowFail">                
                    <div class="pay-fail-lay">                    
                        <h3 class="title">{{failTip}}</h3>                    
                        <div class="btns">                        
                            <div @click="reInput">重新输入</div>                        
                            <div @click="forget">忘记密码</div>                    
                        </div>                
                    </div>            
                </div>        
            </div>    
        </div>
    </template>
```
布局没什么可说的，大体说下分为哪些板块吧：

* 首先一个全屏的遮罩层，弹窗部分是底部对齐的。
* 标题栏：可自定义弹窗标题内容
* 密码区：位数自定义，例如4位、6位、8位密码等忘。密码区黑点通过伪类实现。
* 忘记密码跳转：通过触发父组件的forget自定义事件，在父组件实现具体的跳转操作或者其他操作。
* 键盘区：只有数字键，支持回删。可以考虑修改一下增加空白键的某些操作。
* 加载提示区域：有加载中和加载成功两种状态。密码输入完成自动触发加载中状态，并触发父组件的input-end自定义事件，可在父组件这里发生支付请求。根据请求结果，要告知插件支付结果。可以自定义加载中和加载成功的文字，加载成功的提示停留时间等。加载成功后可以通过`this.$refs.pays.$success(true).then(res => {}）`告知插件成功结果并在成功提示停留结束后触发`then`里面的操作。
* 密码错误重新输入的提示框：当请求结果为密码错误时，可以在父组件通过`this.$refs.pays.$fail(false)`调用插件的方法告知插件支付结果为密码错误，插件会弹出错误的提示框。以上代码由于是已经写好了插件然后直接拷贝的，所以上面插入了变量和方法等。  
    

布局完成后，下面开始介绍实现:

    export default {
        data() {        
            return {            
                password: '', // 支付密码            
                payStatus: 0, // 支付状态，0无状态， 1正在支付，2支付成功            
                failTip: '支付密码错误', //             
                isShowFail: false        
            }    
        },
    }

**1.  在data中定义一个password变量，用于存放输入的支付密码。键盘区的每个数字按键对应一个键值（0-9）。点击数字按键时获取对应的键值并赋值更新password的值，对应如下methods的**`**onKeyboard**`**方法：**  

    // 点击密码操作
    onKeyboard(key) {            
        // 只截取前六位密码
        this.password = (this.password + key).slice(0, 6);        
    },

同时通过在watch钩子里面，监听password，在password长度达到设置的长度后（例如输入完6位后）通过$emit('input-end')通知父组件的自定义事件，可以理解为输入完成后的回调函数：

    watch: {        
        // 监听支付密码，支付密码输入完成后触发input-end回调 
        // 通知父组件的同时会把输入完成的密码作为参数告知父组件，即input-end函数的参数能拿到密码
        password (n, o) {            
            if (n.length === this.digit) {                
                this.payStatus = 1;                
                this.$emit('input-end', this.password)                            
            }            
        }    
    },

this.digit是通过prop传递的值，用于设置支付密码框的位数，默认六位：

    // 支付密码框位数        
    props: {
        // 支付密码框位数    digit: {            
            type: Number,            
            default: 6        
        },
    }

**2.  完成了密码的输入，开始做密码的回删，即每次回删，删除password的最后一位数，有点类似算法里面的堆（后进先出），有点扯远了，这里用不到：**

    // methods中的方法，密码回删
    deleteKey(){            
        // 密码已经为空时，不回删            
        if (this.password.length === 0) return;            
        // 回删一位密码            
        this.password = this.password.slice(0, this.password.length - 1);        
    },

密码长度为0时不再回删，不为0时每次截取0到长度减一的位置为新密码，即去掉了最后一位密码。

**3.说到了密码输入达到指定的长度后会自动触发父组件的自定义事件，这个是写在父组件的，等下演示调用插件的时候会介绍。那么对应的也会有取消支付弹窗的操作，即点击弹窗左上角的返回按钮取消支付，关闭弹窗：**

    // 取消支付        
    cancel () {            
        // 支付过程中，不允许取消支付            
        if (this.payStatus === 1) return;            
        // 清空密码            
        this.password = '';            
        // 恢复支付状态            
        this.payStatus = 0;            
        // 关闭组件，并触发父子组件数据同步            
        this.$emit('change', false);            
        // 触发父组件close自定义事件            
        this.$emit('close');        
    },

取消的时候首先要判断当前的支付状态，如果是正在支付的状态，则是不允许取消的。这里的在data中已经有过定义，主要payStatus有三个值：0无状态，1支付中，2支付成功。然后就是清空密码、初始化支付的状态、关闭弹窗、同时告知父组件使得父组件可以有一个close的自定义事件写回调函数。

由于支付弹窗的显示隐藏是由父组件传递的值控制的，所以这里在组件内改变了父组件传递的值后也要对应的更新父组件的值，即`this.$emit('change', false)`：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1b765ba74dc3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如图我们在使用插件的时候，想通过v-model的值来控制组件的显示隐藏，就像很多库一样使用v-model。所以这里展示如何操作能通过v-model实现：

还是组件的prop属性，通过prop的show属性来控制组件的显示隐藏：

    // 组件的显示隐藏
    show: {            
        type: Boolean,            
        required: true,            
        default: false        
    },

然后在model的钩子中：

    model: {        
        prop: 'show',        
        event: 'change'    
    },

![](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="705" height="278"></svg>)  

最后是在html中通过该字段控制显示隐藏。v-model的内容这里不多做介绍，回头这里更新一个连接地址，在另一篇里面有详细的介绍。

**4.  下面就是当你密码输入完成后，自动触发父组件的input-end回调，你在input-end回调中发起了支付请求，这时后台会返回给你支付状态，例如支付成功或者密码错误。未设置支付可以在吊起支付弹窗以前就去判断或者提示。当你拿到支付的结果后，要通过调用插件的**`**$success**`**方法或者**`**$fail**`**方法告知插件你的支付结果。如下图我们先看怎么使用的，然后再说怎么在插件中实现**`**$success**`**方法和**`**$fail**`**方法：**

![](https://user-gold-cdn.xitu.io/2018/9/12/165ccaeff6790874?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

调用`pay-keyboard`的时候，定义了`ref="key"`，于是我们就可以通过`this.$refs.pay`指向当前插件实例。用法很简单，注释写的也比较清楚就不解释了。下面是插件的$success方法:

    //支付成功        
    $success () {            
        return new Promise((resolve, reject) => {                
            // 支付成功立即显示成功状态                
            this.payStatus = 2;                
            // 待指定间隔后，隐藏整个支付弹窗，并resolve                
            setTimeout(() => {                    
                this.cancel();                    
                resolve();                
            }, this.duration);            
        })        
    },

该方法返回一个promise对象，promise会立即执行。返回`promise`是为了调用时通过`then`方法写回调，更优雅一些。在`promise`内，进行了支付状态的更改，然后在设置的支付成功状态显示的时间结束后关闭弹出并`resolve`。所以`this.$refs.pay.$success().then()`方法中的操作会在等待成功提示结束、也就是弹窗隐藏掉之后执行。

    // 支付失败        
    // 隐藏加载提示框，显示支付失败确认框        
    $fail (tip) {            
        tip && typeof tip === 'string' && (this.failTip = tip);
        // 隐藏掉支付状态窗口            
        this.payStatus = 0;
        // 显示密码错误弹窗            
        this.isShowFail = true;        
    },

`$fail`方法就是插件在得知支付结果为密码错误的时候，显示出密码错误的弹窗。密码错误弹窗的提示是可自定义的。通过tip参数获取自定义的错误提示。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1b8344bf3659?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

该错误提示弹窗，有两个按钮，有一个重新输入，一个忘记密码。

点击重新输入，肯定是要隐藏该弹窗，然后情况已经输入的密码。由此，在methods中写一个reInput方法来实现该功能：

    // 重新输入        
    // 清空之前输入的密码，隐藏支付失败的提示框        
    reInput () {            
        this.password = '';            
        this.isShowFail = false;        
    },

这样就可以重新输入支付密码了。

忘记密码，这里我们可以将点击后操作的控制权交给父组件。所以，我们写一个忘记密码的点击后的方法，这里的忘记忘记密码可以和上面密码区的忘记密码作为同一个操作。当然了你也根据自己的需求开发出区分开的操作。这里是作为同一个的操作：

    // 忘记密码,触发父组件的forget自定义事件        
    forget () {            
        this.$emit('forget');        
    }

由此，便可以在父组件的@forget自定义事件中进行一个连接的跳转等操作。

当然了，我们的prop接收的参数还有以下这些：

    // 弹窗标题        
    title: {            
        type: String,            
        default: '请输入支付密码'        
    },        
    // 正在支付的文字提示        
    loadingText: {            
        type: String,            
        default: '正在支付'        
    },        
    // 支付成功的文字提示        
    finishedText: {            
        type: String,            
        default: '支付成功'        
    },        
    // 支付成功的提示显示时间        
    duration: {            
        type: Number,            
        default: 500        
    }

通过这些prop参数，我们可以在初始化插件的时候进行配置。

  

插件开发完成后就是调用啦，在我们的main.js中先引入我们的插件，而后进行初始化插件：

    // 引入插件，位置是你的插件位置
    import payPassword from './lib/zfc-password'
    // 初始化插件
    Vue.use(payPassword)

然后在我们的页面内这样使用：

    <vpay          
        v-model="show"                       
        ref="pays"            
        @close="close"            
        @forget="forget"            
        @input-end="inputEnd"      
    ></vpay>

**到此我们的插件基本就开发完成了。已经提交github，送上 github项目地址:https://github.com/chinaBerg/vpay 和demo地址:https://chinaberg.github.io/vpay/dist/#/ ，自行查阅。**  

使用文档
-----------------------------------------------------------------------
插件写完了，我们还要简单写一个插件的使用文档。例如我们在github看到的组件库都是有使用说明的，包括api啊、事件说明等。有图有真相，上图：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1be0c9d40dc6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

是不是很熟悉呢！没错，这就是markdown格式的说明文档。说到markdown，其实也不少内容的，但是我们只说一些常用的写markdown文档的语法，这些已经足够我们平时写文档用了。

Markdown 是一种轻量级标记语言，创始人为约翰·格鲁伯（John Gruber）。它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。这种语言吸收了很多在电子邮件中已有的纯文本标记的特性。  

markdown使用途径很久，很多写作等都是使用的markdown文档，包括我们的掘金写作也是可以切换markdown稳当的。下面就说说markdown的常见语法吧。在我们vue创建的根目录，你会发现有一个reaame.md文件，这个文件就可以用来书写项目的说明文档。如果项目传到github上面，这个文档对应的就是如上图所示的使用文档说明。

markdown文档每种格式都有其他的书写方式，这里只介绍其中常见的一种或者说话是个人比较喜欢的形式：

* **标题的书写形式，对应h1,h2,h3,h4,h5,h6**  
    

    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题
    ###### 六级标题

效果图：

![](https://user-gold-cdn.xitu.io/2018/9/12/165ce42bd5f4d96c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

* **无序列表和有序列表：**


    * 1111
    * 2222
    * 3333
    
    1. 1111
    2. 2222
    3. 33334. 4444

效果图：

![](https://user-gold-cdn.xitu.io/2018/9/12/165ce4fdb55702cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

*   **表格的书写：**


    | 事件名 | 说明 | 参数 |
    | - | :- | :- | :-: |
    | input-end | 密码输入完成后的回调函数 | - |
    | close | 密码弹窗关闭后的回调函数 | - |
    | forget | 点击忘记密码的回调函数 | - |

![](https://user-gold-cdn.xitu.io/2018/9/12/165ce51fee4ee070?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

表格这里说一下，第一行对应表格的标题，第二行将表格标题和表格内容分开，并且在这里可以定义表格对齐方式，即| \- | 默认左对齐，| :\- |在左边添加`：`表示这一列左对齐，右边加`：`则这一列右对齐，两边都加`：`则居中对齐。

* **引入代码块：**  
    

    ```javascript
    this.$refs.pays.$success(true).then(res => {    
        console.log('支付成功')     
        this.$router.push('/success')
    })
    ```

即两个` ``` `之间可以添加代码块。是esc按键下的那个键，**不是单引号**。

* **引入图片：**


    ![支付密码框演示动图](./static/pay.gif)

通过`![图片说明](图片路径)`便可以引入图片。效果如上图演示的动态图。

* **引入超链接：**  
    

    [demo演示页面](https://chinaberg.github.io/vpay/dist/#/, '支付密码弹窗demo演示页面')

`[]`设置链接名称，`()`中第一个参数为链接地址，第二个参数为链接的`title`属性值，第二个参数可选。效果如图：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1c031c10bb4c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

**markdown文档的书写语法暂且介绍这些最最常用的一些。更多的markdown语法，请查看相关文档:https://www.appinn.com/markdown/index.html。**

  

上传预览
--------------------------

插件上传github，并设置项目的demo预览网址。

插件开发好了，文档说明也写好了，下面就是上传github、设置github的项目展示页，然后分享给更多的人。

* 首先要有github账号，这个就不说了，必备的。  
    
* 在github上新建一个项目：右上角点击加号，选择New repository新建一个项目，输入项目名->项目描述->创建项目  

![](https://user-gold-cdn.xitu.io/2018/9/13/165d09b62487bac1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  
    

![](https://user-gold-cdn.xitu.io/2018/9/13/165d09dd92d755f2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

* 创建成功后提示的这些命令是git的一些基本命令，还有怎么使用git连接github远程库、怎么推送远程库如果对git还不了解的话，先去网上简单学习一下git的基本操作，然后再进行后续的操作吧。网上廖雪峰的git教程 https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000 比较适合入门，刚开始学习起来比较简单。  
    

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0a4c34fde2d4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

* 在项目中打开终端或者通过cmd命令行打开，我这里演示的vscode编辑器的终端：  
    

![](https://user-gold-cdn.xitu.io/2018/9/13/165d09f8cb97e610?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

* 由于我们的vue项目是需要打包后才能运行的。所以我们要先npm run build打包项目。打包后你可以打开根目录下的dist文件夹，里面有一个index.html文件，打开运行试下，如果是白屏（一定是白屏），那就是路径不对，这里需要你修改打包路径，具体的不细说了，在另一篇文章有提到打包后资源路径不对的解决办法。这里送上链接 https://juejin.im/post/5b174de8f265da6e410e0b4e  ，很简单，增加一个配置就好。

* 打包完成后，通过git初始化我们的项目，最基本的步骤：

1、 `git init` 初始化git项目
2、 `git checkout -b master` 新建一个master分支
3、 由于vue-cli的默认配置，设置了`git`忽略监控我们打包后的dist文件夹，所以这里我要取消忽略，让`git`监控`dist`文件夹，不然提交远程库的时候不会提交`dist`文件夹：打开根目录下的.gitignore文件，这是git的配置文件，可以在这里设置git不需要监控的文件类型。所以我们在这里把`/dist/`这行代码删除，这样，后面我们再`git add .`的时候就会监控`dist`文件夹了。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0afe5c0d4eb4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

此时如果运行git status命令，可以看到git已经开始监控dis文件夹了

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0bc710c3f28f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

4、 `git add .` 注意，这里有一个点，而且点和add直接有空格。  
5、 `git commit -m"初始化支付宝密码弹窗" ` git本地提交
6、 在本地提交后，我们需要连接github远程库：`git remote add origin git@github.com:chinaBerg/my-project.git`，后面的地址是你的远程库的ssh地址，这里不要拷贝我的地址了，你连接我的远程库是不会成功的。然后运行`git remote -v`查看一下是否连接成功：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0c86f3f137cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

可以看到我的远程库已经连接成功了。下面就开始讲本地的代码推送到远程库。

7、 第一次提交，由于本地的分支没有和远程的分支进行关联，所以我们第一次push的时候，要先关联远程库：`git push -u origin master`  ， 其中`-u origin master` 表示将当前的分支关联到远程的master分支，这样你提交的时候当前的本地分支的内容就会提交到远程的master分支上。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0d1b27b99423?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
    
可以看到已经提交成功了。接下来我们打开github上面的项目看下，刷新后看到，项目以上传到远程了，其中既有我们的源码，也有打包后的dist文件，也有我们之前写好的readme.md说明文档：
    
![](https://user-gold-cdn.xitu.io/2018/9/13/165d0d290c5ec483?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**文件上传以后，我们怎么设置才能在github上查看运行的项目的呢？**

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0d50c80a93f2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在当前项目中，点击setttings选项，选择Options选项卡，拉倒底部的位置，找到GitHub Pages区域，点击下拉菜单将选择master branch选项，然后点击save按钮保存。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0d698cfd96f4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

然后我们就会看到，这个位置有一个url地址。没错，这个就是我们的项目路径，但是呢，我们打包后能允许的项目是在dist文件夹下，所以我们想访问打包后的项目的话，只要在这个路径后面拼接，例如：https://chinaberg.github.io/my-project/dist/index.html   你现在访问我这个项目可能不存在了，因为我已经删除了。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d0d872d6efcf3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

至此，我们上传github的操作已经完成了。

**其实这里主要用到的知识就是git的使用。使用git对我们的代码进行版本控制和连接远程库等，都是我们作为开发人员基本必须要会的一项技能，希望还不会git的小伙伴要抽点时间学习一下。不然这里估计会坑的想放弃呢！**  

  

npm包发布
-----------------

发布npm包，更方便以后下载使用。

我们已经把插件代码上传到github上面了，那么我们是否可以也做成一个npm包发布到npm上呢？答案是肯定的，如此一次，我们在需要使用到该插件的时候就可以直接`npm i vpay`等的实现安装到我们的项目中，岂不是很方便呢？

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1cc3a1f49f7a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

正如文章刚开始提到的文件目录，我们是把插件都写在了第二个lib中的。而整个vpay文件夹都是我们要作为npm包发布的。其中readme.md是说明文档，跟github上的一样，你可以简单的先拷贝根目录下的那个。

然后是vpay文件下面的index.js，里面就依据代码，即导出我们的插件：

    module.exports = require('./lib')

由于我们在使用插件的时候， 其实引入的就是这个index.js，所以在这个文件中，我们导出了我们的插件。

**而下面重点要说的是这个package.json文件，这个一开始是没有的，这是npm包的配置文件。我们要首先进入vpay文件夹的位置，然后终端运行**`**npm init**`**命令来初始化一个npm包配置文件，此时他会问你一些列问题来完成配置文件：**

* name：包名，默认是文件夹名。但是这个名字是需要唯一的，如果你命的名字已经被使用过了，那就只能换个名字。至于怎么查看包名是否存在，你可以去[npmjs官网](https://link.juejin.im?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fvpay)搜索你的包名，如果没搜索到则可以使用。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1d1a7c9d678b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

* version：包的版本，默认是1.0.0， 你可以更换，例如0.1.0或2.0.1等。
* description：包的描述。主要描述你的包是用来做什么的。
* entry point：包入口文件，默认是`Index.js`，可以自定义。
* test command：测试命令，这个直接回车就好了，因为目前还不需要这个。
* git repository：包的git仓库地址，npm自动读取`.git`目录作为这一项的默认值。没使用则回车略过。
*  keyword：包的关键词。该项会影响到用户怎样才能搜到你的包，可以理解为搜索引擎悠哈的关键词。建议关键词要能准确描述你的包，例如："vpay vue-pay vue-password password"
* author：作者。例如你的npm账号或者github账号
* license：开源协议，回车就好。

到这一步，其实我们已经做好了本地包的开发，我们要测试一下包能不能使用。怎么测试呢？我们知道，平时是使用npm安装插件的时候，其实是把插件安装在了根目录下的node\_modules文件中。那么，我们既然已经开发好了本地包，我们就把这个vpay文件夹直接拷贝到node\_modules文件夹中。然后在main.js中像平时一样使用插件：

    // 直接引入vpay,不需要写路径
    import vpay from 'vpay'
    
    Vue.use(vpay);

测试一看，一切正常，说明我们的包是没问题的。

下面就是要发布了。发布之前，我们首先要有一个npm的账号，如果你还没有账号的，自行去[npmjs官网注册](https://link.juejin.im?target=https%3A%2F%2Fwww.npmjs.com%2Fsignup)一个账号，这里提示一下，注册用户名的时候经常可能不通过，所以还是字母开头加一些数字方便些。这里的full name 可以理解为昵称，email邮箱，后面两个是用户名和密码。有些时候用户名总是会提示不合规范，所以还是字母加数字快些。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1e889c6c647e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

回归正题，先切换到我们的vpay文件目录，然后执行npm login命令登录我们的npm账号，他会提示你输入npm的用户名和密码，注意输入密码的时候不会有任何提示，这里不要以为是不是没有反应。你只管输入就好，只不过什么都看不到，输入完成回车，然后输入npm的邮箱。最后回车，这里有一点要注意的，如果你是之前安装了淘宝镜像，那是不会成功的，因为你的要把npm包发布到npm镜像上，而不是淘宝的镜像。我们平时可以通过淘宝镜像来加快下载速度，因为淘宝镜像其实就是每隔十分钟把npm的上的最新资源同步到自己身上而已。所以你要通过npm的镜像登录和发布。

如果配置了淘宝镜像，先设置回npm镜像：

    npm config set registry http://registry.npmjs.org

然后在终端执行`npm login`命令：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1e858153d87b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

看到最后一行`Logged in as ……`就说明登录成功了。

登录成功后，运行`npm publish`命令将npm包发布到npm上。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1eec9a583092?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

这样就发布成功了。我们去npm官网查一下我们的包：

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1efbaba6b960?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)  

如果发布成功后没有搜到，就稍微等几分钟。

![](https://user-gold-cdn.xitu.io/2018/9/13/165d1f6ded5bdb58?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

点击进去看下，一切正常。以后就直接可以通过npm i vpay将插件撞到我们的项目中了。

到这，我们基本已经完成了插件从开发、到写说明文档、再到发布github、最后发布npm包，一切已经可以正常使用了。插件的个别地方的样式有些略显粗糙，但是本文的主要目的在于演示插件的开发过程。希望能对有需要的小伙伴起到帮助。

  

❤如果觉得喜欢就收藏一下或者start一下呗~~❤

gitHub：https://github.com/chinaBerg/vpay
demo： https://chinaberg.github.io/vpay/dist/#/
npm：https://www.npmjs.com/package/vpay