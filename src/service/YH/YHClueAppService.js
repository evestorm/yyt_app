import app from '@/common/request.js'

// 创建线索
const CreateByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/YHClue/CreateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 更新线索
const UpdateByDto = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/YHClue/UpdateByDto',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 请求数据来源信息
const GetClueSourceOfSearch = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/YHClue/GetClueSourceOfSearch',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// 获取线索分页列表集合
const GetCluePagedList = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/YHClue/GetCluePagedList',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 获取线索详情
let GetViewDto = async (data, success, fail, isShowLoading = true) => {
	let self = this
	return await app.Request({
		url: '/api/services/app/YHClue/GetViewDto',
		data: data,
		isObj: false,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	})
};

// 获取我的线索详情
const GetClueDetail = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/YHClue/GetClueDetail',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 获取线索报表数据
const GetLeadReportData = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHClue/GetLeadReportData',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 获取挖掘线索机会
const GetClueChances = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHClue/GetClueChances',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

// 根据挖掘机会添加线索
const BatchAddYHClueByChance = async (data, success, fail, isShowLoading = true) => {
	return await app.Request({
		url: '/api/services/app/YHClue/BatchAddYHClueByChance',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

export default {
	CreateByDto,
	UpdateByDto,
	GetClueSourceOfSearch,
	GetCluePagedList,
	GetClueDetail,
	GetViewDto,
	GetLeadReportData,
	GetClueChances,
	BatchAddYHClueByChance
};
