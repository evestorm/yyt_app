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
Mock.mock('/mock/users',{
  'userData|10-20': [
    {
      id: '@id',
      name: '@cname',
      main: '@csentence',
      deadTime: '@datetime',
	  disable: '@boolean',
	  'status|1-5': 1
    },
  ],
  count() {
    return this.userData.length
  },
})

