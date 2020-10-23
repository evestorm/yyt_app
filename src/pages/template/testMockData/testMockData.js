// 作者:杨亮

//------------------------------mock数据引入---------------------------
import testMockDataMock from './testMockData_mock.js';

export default {
    data() {
        return {
			users: [], // 列表数据
        };
    },
    // 页面加载事件
    onLoad() {
		uni.request({
			method: 'get',
			url: '/mock/users',
			success: (res) => {
				console.log(res);
				this.users = res.data.userData;
			}
		});
    },
};
