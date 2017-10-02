require("babel-core/register")({
  "presets": [
    ["env", {
      "targets": {
        "node": true
      }
    }]
  ],
  'plugins': [
    'transform-decorators-legacy',
  ]
})

require('babel-polyfill')
require("./server")
