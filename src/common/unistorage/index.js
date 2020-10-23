import uStorage from './storage.js'

const prefix = 'CW.YYT.App.';

const storage = {
	// 设置token缓存
	setToken(token,timeout) {
		 uStorage.set(prefix + 'Token',token,timeout);
	},
	// 获取token
	getToken() {
		return uStorage.get(prefix + 'Token');
	},
	// 移除token
	removeToken() {
		uStorage.remove(prefix + 'Token');
	},

	setAppUserId(value, timeout = 25920) { // 默认0.3天
		return uStorage.set(prefix + 'UserId', value, timeout)
	},
	getAppUserId() { // 和下面一个,保留一个
		return uStorage.get(prefix + 'UserId');
	},
	removeAppUserId() {
		return uStorage.remove(prefix + 'UserId');
	},
	// 设置app端客户经理列表
	setChooseMarketData(value) {
		return uStorage.set(prefix + 'ChooseMarketData', value)
	},
	// 获取app端客户经理列表
	getChooseMarketData() {
		return uStorage.get(prefix + 'ChooseMarketData');
	},
	// 设置所有客户经理列表（app和非app）
	setAllChooseMarketData(datas) {
		return uStorage.set(prefix + 'AllChooseMarketData', datas);
	},
	// 获取所有客户经理列表（app和非app）
	getAllChooseMarketData() {
		return uStorage.get(prefix + 'AllChooseMarketData')
	},
	// 设置当前登录用户信息
	setAppUserInfo(value) {
		getApp().globalData.userInfo = value;
		return uStorage.set(prefix + 'UserInfo', value);
	},
	// 获取当前登录用户信息
	getAppUserInfo() {
		return uStorage.get(prefix + 'UserInfo');
	},
	// 移除当前登录用户信息
	removeAppUserInfo() {
		return uStorage.remove(prefix + 'UserInfo');
	},
	// 设置当前登录用户的各种权限
	setSalesAuthority(value) {
		return uStorage.set(prefix + 'SalesAuthority', value);
	},
	// 获取当前登录用户的各种权限
	getSalesAuthority() {
		return uStorage.get(prefix + 'SalesAuthority');
	},
	// 移除当前登录用户的各种权限
	removeSalesAuthority() {
		return uStorage.remove(prefix + 'SalesAuthority');
	},
	// 设置当前登录门店的各种权限
	setStoreAuthority(value) {
		return uStorage.set(prefix + 'StoreAuthority', value);
	},
	// 获取当前登录门店的各种权限
	getStoreAuthority() {
		return uStorage.get(prefix + 'StoreAuthority');
	},
	// 移除当前登录门店的各种权限
	removeStoreAuthority() {
		return uStorage.remove(prefix + 'StoreAuthority');
	},
	// 设置当前登录门店的各种权限
	setNotificationCount(value) {
		return uStorage.set(prefix + 'NotificationCount', value);
	},
	// 获取当前登录门店的各种权限
	getNotificationCount() {
		return uStorage.get(prefix + 'NotificationCount');
	},
	// 移除当前登录门店的各种权限
	removeNotificationCount() {
		return uStorage.remove(prefix + 'NotificationCount');
	},
	// 获取门店ID
	getStoreID() {
		return uStorage.get('storeID');
	},
	// 存储当前门店餐别
	setMealsType(value, timeout = 3600) { // 存1小时
		return uStorage.set('mealsType', value, timeout);
	},
	// 获取当前门店餐别
	getMealsType() {
		return uStorage.get('mealsType');
	},
	// 存储当前门店区域+桌台
	setAreaAndTable(value, timeout = 3600) {
		return uStorage.set('areaAndTable', value, timeout);
	},
	// 获取当前门店区域+桌台
	getAreaAndTable() {
		return uStorage.get('areaAndTable');
	},
	// 保存当前保留的已选择客户标签(客户列表侧边栏)
	setCurrentTagList(value) {
		return uStorage.set('currentTagList', value);
	},
	// 获取当前保留的已选择客户标签
	getCurrentTagList() {
		return uStorage.get('currentTagList');
	},
	// 移除当前保留的已选择客户标签
	removeCurrentTagList() {
		return uStorage.remove('currentTagList');
	},
	// 保存当前保留的已选择客户标签(预订侧边栏)
	setCurrentReserveTagList(value) {
		return uStorage.set('currentReserveTagList', value);
	},
	// 获取当前保留的已选择客户标签
	getCurrentReserveTagList() {
		return uStorage.get('currentReserveTagList');
	},
	// 移除当前保留的已选择客户标签
	removeCurrentReserveTagList() {
		return uStorage.remove('currentReserveTagList');
	},
	// 保存当前保留的已选择客户标签(客户跟踪侧边栏)
	setCurrentFollowTagList(value) {
		return uStorage.set('currentFollowTagList', value);
	},
	// 获取当前保留的已选择客户标签
	getCurrentFollowTagList() {
		return uStorage.get('currentFollowTagList');
	},
	// 移除当前保留的已选择客户标签
	removeCurrentFollowTagList() {
		return uStorage.remove('currentFollowTagList');
	},
	// 保存当前保留的已选择客户标签(添加收件人侧边栏)
	setCurrentReceiveTagList(value) {
		return uStorage.set('currentReceiveTagList', value);
	},
	// 获取当前保留的已选择客户标签
	getCurrentReceiveTagList() {
		return uStorage.get('currentReceiveTagList');
	},
	// 移除当前保留的已选择客户标签
	removeCurrentReceiveTagList() {
		return uStorage.remove('currentReceiveTagList');
	},
	// 【新增客户页面专用】保存当前保留的已选择客户标签
	setAddCustomerTagList(value) {
		return uStorage.set('addCustomerTagList', value);
	},
	// 【新增客户页面专用】获取当前保留的已选择客户标签
	getAddCustomerTagList() {
		return uStorage.get('addCustomerTagList');
	},
	// 【新增客户页面专用】移除当前保留的已选择客户标签
	removeAddCustomerTagList() {
		return uStorage.remove('addCustomerTagList');
	},
	// 设置首页顶部快速菜单列表
	setSwMenuList(value) {
		return uStorage.set('swMenuList', value);
	},
	// 获取宴会单列表选项卡
	getBanquetisactive() {
		return uStorage.get('Banquetisactive');
	},
	// 移除宴会单列表选项卡
	removetBanquetisactive() {
		return uStorage.remove('Banquetisactive');
	},
	// 设置宴会单列表选项卡
	settBanquetisactive(value) {
		return uStorage.set('Banquetisactive', value);
	},
	// 获取首页顶部快速菜单列表
	getSwMenuList() {
		return uStorage.get('swMenuList');
	},
	// 移除首页顶部快速菜单列表
	removeSwMenuList() {
		return uStorage.remove('swMenuList');
	},
	// 设置首页运营概况数据(个人)
	setSwOperate(value) {
		return uStorage.set('swOperate', value);
	},
	getSwOperate() {
		return uStorage.get('swOperate');
	},
	removeSwOperate() {
		return uStorage.remove('swOperate');
	},
	// 设置首页运营概况数据(全部)
	setSwOperateAll(value) {
		return uStorage.set('swOperateAll', value);
	},
	getSwOperateAll() {
		return uStorage.get('swOperateAll');
	},
	removeSwOperateAll() {
		return uStorage.remove('swOperateAll');
	},
	// 存储当前用户的门店列表
	setStoreData(value) {
		return uStorage.set(prefix + 'StoreData', value);
	},
	getStoreData() {
		return uStorage.get(prefix + 'StoreData');
	},
	removeStoreData() {
		return uStorage.remove(prefix + 'StoreData');
	},
	// 存储当前tabBar传参
	setTabBarPayload(value) {
		return uStorage.set(prefix + 'TabBarPayload', value);
	},
	getTabBarPayload() {
		return uStorage.get(prefix + 'TabBarPayload');
	},
	removeTabBarPayload() {
		return uStorage.remove(prefix + 'TabBarPayload');
	},
	// 存储添加收件人id
	setCustomerIDs(value) {
		return uStorage.set(prefix + 'customerIDs', value);
	},
	getCustomerIDs() {
		return uStorage.get(prefix + 'customerIDs');
	},
	removeCustomerIDs() {
		return uStorage.remove(prefix + 'customerIDs');
	},
	// 存储 添加收件人信息
	setCustomers(value) {
		return uStorage.set(prefix + 'customers', value);
	},
	getCustomers() {
		return uStorage.get(prefix + 'customers');
	},
	removeCustomers() {
		return uStorage.remove(prefix + 'customers');
	},
	// 存储 选择的短信模板
	setMsgMould(value) {
		return uStorage.set(prefix + 'msgMould', value);
	},
	getMsgMould() {
		return uStorage.get(prefix + 'msgMould');
	},
	removeMsgMould() {
		return uStorage.remove(prefix + 'msgMould');
	},
	//登陆页面缓存同意协议
	setAgreeFile(value) {
		return uStorage.set(prefix + 'agreeFile', value);
	},
	getAgreeFile() {
		return uStorage.get(prefix + 'agreeFile');
	},
	removeAgreeFile() {
		return uStorage.remove(prefix + 'agreeFile');
	},
	//宴会页面 显示宴会线索 宴会订单
	setBanquetActive(value) {
		return uStorage.set(prefix + 'banquetActive', value);
	},
	getBanquetActive() {
		return uStorage.get(prefix + 'banquetActive');
	},
	removeBanquetActive() {
		return uStorage.remove(prefix + 'banquetActive');
	},
	//新增宴会订单跳转宴会订单tab缓存参数isactive
	setBanquetIsactive(value) {
		return uStorage.set(prefix + 'banquetIsactive', value);
	},
	getBanquetIsactive() {
		return uStorage.get(prefix + 'banquetIsactive');
	},
	//宴会-宴会跟进人客户经理列表
	setBanquetMarketers(value) {
		return uStorage.set(prefix + 'BanquetMarketers', value);
	},
	getBanquetMarketers() {
		return uStorage.get(prefix + 'BanquetMarketers');
	},
	removeBanquetMarketers() {
		return uStorage.remove(prefix + 'BanquetMarketers');
	},
	//添加项目页面跳转至添加任务缓存的任务列表
	setTaskList(value) {
		return uStorage.set(prefix + 'taskList', value);
	},
	getTaskList() {
		return uStorage.get(prefix + 'taskList');
	},
	removeTaskList() {
		return uStorage.remove(prefix + 'taskList');
	},
	//控制任务详情页面刷新
	setIsRefresh(value) {
		return uStorage.set(prefix + 'isRefresh', value);
	},
	getIsRefresh() {
		return uStorage.get(prefix + 'isRefresh');
	},
	removeIsRefresh() {
		return uStorage.remove(prefix + 'isRefresh');
	},
	// 搜索栏历史记录
	setSearchLocal(value) {
		return uStorage.set(prefix + 'searchLocal', value);
	},
	getSearchLocal() {
		return uStorage.get(prefix + 'searchLocal');
	},
	removeSearchLocal() {
		return uStorage.remove(prefix + 'searchLocal');
	},
	// 通讯录定位
	setABScrollTop(value) {
		return uStorage.set(prefix + 'ABScrollTop', value);
	},
	getABScrollTop() {
		return uStorage.get(prefix + 'ABScrollTop');
	},
	removeABScrollTop() {
		return uStorage.remove(prefix + 'ABScrollTop');
	},
	//预订缓存发送短信方式
	setBookNowMsgType(value) {
		return uStorage.set(prefix + 'BookNowMsgType', value);
	},
	getBookNowMsgType() {
		return uStorage.get(prefix + 'BookNowMsgType');
	},
	removeBookNowMsgType() {
		return uStorage.remove(prefix + 'BookNowMsgType');
	},
	// 缓存极光registrationId
	setJPushRId(value) {
		return uStorage.set(prefix + 'JPushRId', value);
	},
	getJPushRId() {
		return uStorage.get(prefix + 'JPushRId');
	},
	removeJPushRId() {
		return uStorage.remove(prefix + 'JPushRId');
	}
}

export default storage
