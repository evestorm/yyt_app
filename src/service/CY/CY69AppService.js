import app from '@/common/request.js'

// 获取跟踪分类
const GetAllStoreSettingTemplate = async (
	data,
	success,
	fail,
	isShowLoading = true
) => {
	const self = this
	return await app.Request({
		url: '/api/services/app/CY69/GetAllStoreSettingTemplate',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
}

export default {
	GetAllStoreSettingTemplate
}
