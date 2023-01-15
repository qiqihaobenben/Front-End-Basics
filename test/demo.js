'use strict'

const set = new Set([1, 'some time', 2, 4, 6, 2, 2, 1, 5, 3])

console.log([...set])

function eliminateDuplicates(items) {
  return [...new Set(items)]
}

console.log(eliminateDuplicates(set))
