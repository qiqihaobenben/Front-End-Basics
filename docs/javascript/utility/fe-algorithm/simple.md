# 简单算法实例

## 字符串反转

在 JavaScript 中，可以通过多种方式实现字符串反转。下面介绍两种常见的方法：

### 方法 1：使用数组的 `reverse()` 方法

1. 将字符串转换为数组。
2. 使用数组的 `reverse()` 方法反转数组元素。
3. 使用 `join()` 方法将数组元素合并成一个字符串。

```javascript
function reverseString(str) {
  return str
    .split('')
    .reverse()
    .join('')
}
```

### 方法 2：使用循环

1. 创建一个新的空字符串用于存放反转后的结果。
2. 通过循环遍历原字符串，从最后一个字符开始，逐个将字符添加到新字符串中。

```javascript
function reverseString(str) {
  let reversed = ''
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i]
  }
  return reversed
}
```

这两种方法都可以有效地反转字符串。选择哪种方法取决于个人偏好和具体的应用场景。第一种方法在代码上更简洁，而第二种方法提供了更多的控制能力，可能在处理非常大的字符串或需要优化性能的情况下更有优势。

## 判断回文

### 方法 1：将字符串反串后判断与原字符串是否相等

```js
function isPalindrome(str) {
  // 也可用上面实现的 reverseString 方法
  return (
    str ===
    str
      .split('')
      .reverse()
      .join('')
  )
}
```

### 方法 2：双指针

```js
function isPalindrome(str) {
  let left = 0
  let right = str.length - 1

  while (left < right) {
    if (str[left] !== str[right]) {
      return false
    }
    left++
    right--
  }

  return true
}
```

## 最常出现的字母

```js
function mostFrequentChar(str) {
  let charMap = {}
  let maxCount = 0
  let mostFrequentChar = ''

  for (let char of str) {
    charMap[char] = (charMap[char] || 0) + 1
    if (charMap[char] > maxCount) {
      maxCount = charMap[char]
      mostFrequentChar = char
    }
  }

  return mostFrequentChar
}
```

## 最常出现的连续字母

```js
function longestConsecutiveChar(str) {
  let longestChar = ''
  let currentChar = ''
  let count = 0
  let maxCount = 0

  for (let i = 0; i < str.length; i++) {
    if (str[i] === currentChar) {
      count++
    } else {
      if (count > maxCount) {
        maxCount = count
        longestChar = currentChar
      }
      currentChar = str[i]
      count = 1
    }
  }

  if (count > maxCount) {
    longestChar = currentChar
  }

  return longestChar
}
```

## 股票的最大利润

## 最长递增子序列

一个经典的动态规划问题是「最长递增子序列（Longest Increasing Subsequence，简称 LIS）」问题。给定一个整数数组 nums，找到其中最长的严格递增子序列的长度。

下面是用 JavaScript 实现 LIS 问题的动态规划算法，并一步一步拆解说明：

1. **定义状态：**
   我们定义状态 dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度。这里 dp[i] 是一个一维数组，长度与 nums 数组相同。

2. **初始条件：**
   初始时，每个元素自成一个序列，因此 dp[i] 的初始值都为 1。

3. **状态转移方程：**
   对于每个位置 i，我们需要计算 dp[i] 的值。遍历 i 之前的所有位置 j，如果 nums[j] 小于 nums[i]，说明可以将 nums[i] 加入到以 nums[j] 结尾的子序列中，形成更长的递增子序列。因此，状态转移方程为 dp[i] = max(dp[i], dp[j] + 1)，表示考虑将 nums[i] 加入到所有能够使得 nums[i] 大于 nums[j] 的子序列中，并取其中最大值作为 dp[i] 的值。

下面是具体的 JavaScript 代码实现：

```javascript
function lengthOfLIS(nums) {
  const n = nums.length
  if (n === 0) {
    return 0
  }

  const dp = new Array(n).fill(1)

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }

  let maxLength = 0
  for (let length of dp) {
    maxLength = Math.max(maxLength, length)
  }

  return maxLength
}
```

现在来一步一步解释这段代码：

- 首先，我们定义了函数 `lengthOfLIS`，它接收一个整数数组 `nums` 作为参数。
- 我们初始化了一个长度为 `n` 的数组 `dp`，初始值都为 1，其中 `n` 是 `nums` 的长度。
- 接着我们使用两层循环遍历数组 `nums`，在外层循环中遍历每个位置 `i`，在内层循环中遍历 `i` 之前的所有位置 `j`。
- 对于每个位置 `i`，我们计算 `dp[i]` 的值，根据状态转移方程 `dp[i] = max(dp[i], dp[j] + 1)` 更新 `dp[i]` 的值。
- 最后，我们遍历 `dp` 数组，找到其中的最大值作为最长递增子序列的长度，并返回该长度作为结果。

## 最常连续递增子序列

```js
function lengthOfLongestIncreasingSubsequence(nums) {
  const n = nums.length
  if (n === 0) {
    return 0
  }

  let maxLength = 1
  let currentLength = 1

  for (let i = 1; i < n; i++) {
    if (nums[i] > nums[i - 1]) {
      currentLength++
    } else {
      maxLength = Math.max(maxLength, currentLength)
      currentLength = 1
    }
  }

  return Math.max(maxLength, currentLength)
}
```

## 斐波那契数列

### 使用递归法实现

```js
function fibonacci(n) {
  if (n <= 1) {
    return n
  }

  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

### 使用动态规划实现

```js
function fibonacci(n) {
  if (n <= 1) {
    return n
  }

  let fib = [0, 1]
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2]
  }

  return fib[n]
}
```
