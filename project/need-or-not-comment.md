# 良性代码：到底要不要注释？

#### [原文链接](https://testing.googleblog.com/2017/07/code-health-to-comment-or-not-to-comment.html)

读代码时，一个适当的注释往往很有用。不过，也不能随意的瞎注释。而且有时候这段代码需要注释，往往意味着代码应该被重构了。

当你的代码不能不言自明时，要加注释。如果你觉得要加一个注释来说明这段代码是干了点啥，不如先试试下面的几种方法：

> 介绍一个变量

<table class="my-bordered-table">
  <tbody>
<tr>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 从价格中减去折扣</span>
finalPrice = (numItems * itemPrice)
    - min(5, numItems) * itemPrice * 0.1;</pre>
</td>
    <td style="background-color: #d9ead3; vertical-align: top; width: 50%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">price = numItems * itemPrice;
discount =
    min(5, numItems) * itemPrice * 0.1;
finalPrice = price - discount;</pre></td>
  </tr>
</tbody></table>

> 抽出一个方法

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 过滤敏感词</span>
for (String word : words) { ... }</pre></td>
    <td style="background-color: #d9ead3; vertical-align: top; width: 50%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">filterOffensiveWords(words);</pre></td>
  </tr>
</tbody></table>

> 用一个更具有描述性的标识名称

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">int width = ...; <span style="font-weight: bold;">// 宽度以像素为单位
</span></pre></td>
    <td style="background-color: #d9ead3; vertical-align: top; width: 50%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">int widthInPixels = ...;</pre></td>
  </tr>
</tbody></table>

> 给你存在假设的代码添加一个检查

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// height &gt; 0 时是安全的</span>
return width / height;</pre></td>
    <td style="background-color: #d9ead3; vertical-align: top; width: 50%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">checkArgument(height &gt; 0);
return width / height;
</pre></td>
  </tr>
</tbody></table>

<br />

下面也列举了一些恰当有用的注释：

> 表明你的用意：解释为什么代码要这么写（而不是它干了什么）

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #d9ead3; vertical-align: top; width: 100%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 因为很耗费性能，所以只计算一次</span></pre></td>
  </tr>
</tbody></table>

> 防止之后好心的维护者对你的代码进行错误的“修复”

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #d9ead3; vertical-align: top; width: 100%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 因为 Foo 不是线程安全的，所以要创建一个新的 Foo 实例</span></pre></td>
  </tr>
</tbody></table>

> 说明：code review 的时候发现的问题或者看代码的人碰到的问题

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #d9ead3; vertical-align: top; width: 100%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// Note：订单很重要，因为...</span></pre></td>
  </tr>
</tbody></table>

> 解释一下那些看上去不太好的软件工程实践的理由

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #d9ead3; vertical-align: top; width: 100%;"><pre style="background-color: #d9ead3; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;">@SuppressWarnings("unchecked") <span style="font-weight: bold;">// 这个列表是安全的，因为...</span></pre></td>
  </tr>
</tbody></table>


<br />

换句话说，要避免那些仅仅是重复说明代码干了点啥的注释。这样的注释没啥用，看着还烦。

<table class="my-bordered-table" style="width: 100%;">
  <tbody>
<tr>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 获取所有的用户</span>
userService.getAllUsers();</pre></td>
    <td style="background-color: #f4cccc; vertical-align: top; width: 50%;"><pre style="background-color: #f4cccc; border: 0px; color: black; margin-bottom: 0; margin-top: 0; padding-bottom: 0; padding-top: 0; padding-left: 0;"><span style="font-weight: bold;">// 如果 name 为空时的检查</span>
if (name.isEmpty()) { ... }</pre></td>
  </tr>
</tbody></table>
