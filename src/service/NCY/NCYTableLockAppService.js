import app from '@/common/request.js';

// 更新锁台状态
const TableLockingAndUnlocking = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/NCYTableLock/TableLockingAndUnlocking',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};


export default {
	TableLockingAndUnlocking
};
