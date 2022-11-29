'use strict'

var slice = [1, 2, 3],
  colors = ['red', 'green'],
  color = 'black'

with (colors) {
  push(color)
  push(...slice)
}

console.log(colors)
