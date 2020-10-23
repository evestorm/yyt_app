// 使用 Mock
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random

// Mock示例
// http://mockjs.com/examples.html
// Mock文档
// https://github.com/nuysoft/Mock/wiki
Random.id()
Random.cname()
Random.csentence()
Random.datetime()
Random.boolean(1, 1, true)
Random.integer(1, 4)
// mock接口会导致内存损耗大 不用
// Mock.mock('/mock/users',{
//   'marketers|10-20': [
//     {
//       value: '@id',
//       label: '@cname'
//     },
//   ],
//   count() {
//     return this.marketers.length
//   },
// })
