require('whatwg-fetch')

const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

console.log('whattup?')
