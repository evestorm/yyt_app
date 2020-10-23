import app from '@/common/request.js'

// 
const GetViewPage = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/GetViewPage',
		data: data,
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
const UpdateByDto = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/UpdateByDto',
		data: data,
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
const CreateByDto = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/CreateByDto',
		data: data,
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
const Delete = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/Delete?id=' + data,
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
const GetDto = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/GetDto?primaryKey=' + data,
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
// 发送短信内容模板/发送微信邀请函
const GetSmsTemplateListDetails = async (data, success, fail) => {
	const self = this;
	return await app.Request({
		data: data,
		url: '/api/services/app/CY67/GetSmsTemplateListDetails',
		isObj: true,
		abpSuccess: success,
		abpFail: fail,
	});
};
//获取短信模板
const GetMessageTemplate = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/GetMessageTemplate',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
//  获取短信更新模板
const GetMessageFillTemplate = async (data, success, fail, isShowLoading = false) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/GetMessageFillTemplate',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};

const GetSmsTemplateFilter = async (data, success, fail, isShowLoading = true) => {
	const self = this;
	return await app.Request({
		url: '/api/services/app/CY67/GetSmsTemplateFilter',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
// =================================短信预览=======================================
//  获取模拟模板
const GetSimulationTemplate = async (data, success, fail, isShowLoading = false) => {
	return await app.Request({
		url: '/api/services/app/CY67/GetSimulationTemplate',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
//  填充真实模板
const FillRealTemplate = async (data, success, fail, isShowLoading = false) => {
	return await app.Request({
		url: '/api/services/app/CY67/FillRealTemplate',
		data: data,
		isObj: true,
		isShowLoading: isShowLoading,
		abpSuccess: success,
		abpFail: fail
	});
};
export default {
	GetViewPage,
	Delete,
	GetDto,
	UpdateByDto,
	CreateByDto,
	GetSmsTemplateListDetails,
	GetMessageTemplate,
	GetMessageFillTemplate,
	GetSmsTemplateFilter,
	GetSimulationTemplate,
	FillRealTemplate
};
