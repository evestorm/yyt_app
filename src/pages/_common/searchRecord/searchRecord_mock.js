import utils from '@/common/util.js';
import moment from '@/lib/moment/moment.min.js';
const getDataList = () => {
	const arr = []
	for(let i = 0; i < 32; i++) {
		arr.push({
			phone: utils.getRandomMoble(), // 电话
			beginTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 开始通话时间
			callType: utils.getRandomNumberFrom(1, 2),  // 1. 呼入 2. 呼出
			talkTime: utils.getRandomNumberFrom(0, 100), // 通话时长，0表示未接通
			customSaveName: utils.getRandomName(), // 客户姓名
		})
	}
	return arr;
}

export default {
	getDataList,
}
