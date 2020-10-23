import util from '@/common/util.js'
import appConfig from '@/common/config/config.js'
import storage from '@/common/unistorage/index.js'

let REQUESTAPICOUNT = 0; // 请求的api接口数量 档为0的时候那么才隐藏totast

let api = {
	domain: appConfig.domain
}

const getToken = async () => {
	let token = storage.getToken();
	if (token) {
		return token;
	} else {
		const userInfo = storage.getAppUserInfo();
		let userNameOrEmailAddress = "";
		let password = "";
		if (userInfo) {
			userNameOrEmailAddress = userInfo.loginName;
			password = userInfo.pwd;
		}
		uni.showLoading({
			title: '处理中...',
			mask: true,
		});
		let [error, res] = await uni.request({
			method: 'POST',
			url: api.domain + '/api/services/app/TokenAuthService/Authenticate',
			data: {
				userNameOrEmailAddress: userNameOrEmailAddress,
				password: password
			}
		});

		uni.hideLoading();
		// 登陆不成功跳转登陆页
		if (res.data.success) {
			let token = `Bearer ${res.data.result.accessToken}`;
			storage.setToken(`Bearer ${res.data.result.accessToken}`, res.data.result.expireInSeconds);
			return token;
		} else {
			uni.navigateTo({
				url: '/pages/homePage/login/login'
			});
		}
	}
};

const Request = async (option) => {
	if (!option.isObj) {
		//假如只有一个参数就拼接到url上（EFcore单个参数只能这么传递）
		let paramData = util.urlEncode(option.data);
		// isObj参数为假，则把option.data参数写入url
		option.url = api.domain + option.url + '?' + paramData;
		option.data = '';
	} else {
		// isObj参数为真，data 放到post里面去传递
		option.url = api.domain + option.url;
	}
	option.header = {
		'X-Requested-With': 'XMLHttpRequest',
	};

	// 需要token 才请求
	if (!option.isNotNeedToken) {
		option.header.Authorization = await getToken();
	}

	const userInfo = storage.getAppUserInfo();
	if (userInfo) {
		option.header.StoreInfo = `{storeId:'${userInfo.currentStoreId}',cWCompanyID:'${userInfo.cwCompanyID}'}`; // 当前门店的信息用于全局过滤
		option.header.YYTAppUserId = userInfo.id; // 当前门店的信息用于全局过滤
	}

	// 需要传入wx.request()的method属性，默认设置为'post'
	if (option.method != 'GET') {
		option.method = 'POST';
	}
	if (option.isShowLoading) {
		REQUESTAPICOUNT++; // 非静默加载那么需要把请求数加一
		uni.showLoading({
			title: '处理中...',
			mask: true,
		});
	}

	let errorMsg = '';
	let [error, rdata] = await uni.request(option);
	if (error) {
		errorMsg = '系统繁忙,请稍后再试';
	} else {
		if (rdata && (rdata.data.success === true || rdata.data.success === undefined)) {
			option.abpSuccess && option.abpSuccess(rdata.data.result);
		} else if (rdata && !rdata.data.success) {
			if (rdata.data.error.message) {
				errorMsg = rdata.data.error.message;
			}
			if (rdata.data.error.validationErrors) {
				rdata.data.error.validationErrors.forEach(item => {
					errorMsg += item.message + ',';
				});
				errorMsg = errorMsg.substring(0, errorMsg.length - 1);
			}

			option.abpFail && option.abpFail();
		}
	}

	if (option.isShowLoading) {
		REQUESTAPICOUNT--; // 非静默加载那么需要把请求数加一
	}
	if (option.isShowLoading&&REQUESTAPICOUNT === 0) {
		uni.hideLoading();
	}

	// 防止hideLoading 把showToast 展示出来隐藏掉
	if (errorMsg) {
		errorMsg = errorMsg.indexOf("服务器内部") != -1 ? '系统繁忙,请稍后再试' : errorMsg;
		uni.showToast({
			title: '提示信息 : ' + errorMsg,
			icon: 'none',
			duration: 3000
		});

		// 有错误信息就返回空
		return null;
	}

	let result = rdata.data;
	if (rdata.data.result) {
		result = rdata.data.result;
	}
	
	if (result) {
		// 把null 值替换成''
		result = util.null2str(result);
	}

	return result;
}

export default {
	Request
};
