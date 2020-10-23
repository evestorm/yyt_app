import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js';
import YHTaskConf from '@/service/YH/YHTaskConfAppService.js';
import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
import YHClueFileManage from '@/service/YH/YHClueFileManageAppService.js';
import YHBanquetHistoryLog from '@/service/YH/YHBanquetHistoryLogAppService.js';
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';

import util from '@/common/util.js';
import storage from '@/common/unistorage/index.js';
const app = getApp();
export default {
	data() {
		return {
			options: {}, //获取的路由参数
			picDomain: app.globalData.PicDomain,
			// fileOnlineRead:getApp().globalData.fileOnlineRead,
			marketerId: storage.getAppUserInfo().marketerId, //当前登陆人id
			isChecked: false, //顶部checkbox
			taskDetail: {}, //页面显示数据
			id: '', //获取任务详情id
			rightText: '删除', //导航栏右侧显示文字  统筹显示
			taskDate: '', //再次更改执行日期
			relationDetail: {}, //获取关联任务详情
			popupNum: 0, //选择弹窗类型
			viewYHClueFileManages: [], //文件图片列表
			fileId: '', //文件id
			fileType: '', //文件类型
			imageList: [], //图片数组
			// isCoordinator: false, //是否
			textContent: { //相关资料需要显示的文本
				name: '',
				content: ''
			},
			pageCanScroll: true, // 页面是否可以滚动(解决popup弹出后，滚动穿透问题)
			fileUrl: '', //相关资料--下载（down）还是预览文件(read) 默认预览
		}
	},
	components: {
		uniNavBar,
		uniPopup
	},
	mounted() { //上传文件
		let _this = this;
		let input = document.createElement('input');
		input.style.display = 'none'
		input.type = 'file'
		input.id = 'file';
		_this.$refs.input.$el.appendChild(input);
		input.onchange = (event) => {
			var file = event.target.files[0];
			//上传方法
			_this.uploadAPI(file)
		}
	},
	onLoad(option) {
		// console.log('获取任务详情', option)
		//获取任务详情id
		this.options = option;
		this.id = option.id;

		// this.id = '6bca579b-d11f-eaS11-ba53-fc0e03bf8d3e'
		this.getViewDto();
	},
	onShow() {
		if (storage.getIsRefresh()) { //刷新页面
			this.getViewDto();
		}
	},
	computed: {
		isCoordinator() { //是否有任务操作权限：客户经理，统筹人，有操作所有的权限，任务执行人
			let userId = storage.getAppUserInfo().marketerId;
			//是否是 任务执行人
			let arr = this.taskDetail.banquetTaskExecutorIds && this.taskDetail.banquetTaskExecutorIds.split(',');
			 if (this.options.coordinatorId == userId || this.options.marketerId == userId || this.$cw.canEditAllBanquet()) {
				//当前用户是统筹人或者是客户经理或者是【可操作所有（权限）】时 才有权限操作
				return true;
			} else if(arr) {
				if (arr.indexOf(userId) != -1) return true
			}else {
				return false;
			}
		},
		isAdmin() { //是否有任务操作权限：客户经理，统筹人,任务执行人没有修改执行人和执行日期的权限
			let userId = storage.getAppUserInfo().marketerId;
			if (this.options.coordinatorId == userId || this.options.marketerId == userId || this.$cw.canEditAllBanquet()) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//------------------------------------点击相关资料-------------------------------------
		openAttchInfo(item) { //点击相关资料
			// console.log(item)
			switch (item.contentType) { //(1,文本;2,跳转地址;3,图片;4,文件)
				case 1:
					this.pageCanScroll = false;
					//text文本 弹窗查看
					this.textContent = item;
					this.$refs.textPopop.open();
					break;
				case 2:
					//网址 跳转webPage
					uni.navigateTo({
						url: `/pages/_common/webPage/webPage?url=${item.content}`
					})
					break;
				case 3:
					//图片 预览
					this.$util.previewImage(item.content)
					break;
				case 4:
					// 弹窗选择文件预览还是下载
					this.fileUrl = item.content;
					this.$refs.downFileTip.open();
					break;
				default:
					break;
			}
		},
		closeDownFileTip() { //关闭下载文件弹窗
			this.$refs.downFileTip.close();
		},
		readFile() { //预览文件
			uni.navigateTo({
				url: `/pages/_common/webPage/webPage?url=${getApp().globalData.fileOnlineRead}${this.fileUrl}`
			})
			this.$refs.downFileTip.close();
		},
		downFile() { //下载文件
			YYT.DownloadFile(this.fileUrl);
			this.$refs.downFileTip.close();
		},
		closeTextPopup() { //相关资料文本弹窗-关闭
			this.pageCanScroll = true;
			this.$refs.textPopop.close();
		},
		//------------------------------------ -------------------------------------
		//导航栏返回按钮
		tapLeftFromNav() {
			uni.navigateBack({
				delta: 1
			})
		},
		//----------------------------------完成任务按钮------------------------------------
		async createFile() {
			if (!this.isCoordinator) {
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			// 没修改前的任务状态[1:已完成/0:未完成]
			let currentStatus = this.taskDetail.isExecuted;
			// 要修改成的任务状态
			let isExecuted = this.taskDetail.isExecuted == '1' ? '0' : '1';
			//检查是否可关任务权限的同时提示任务还需要提交的内容
			let res = await YHBanquetTask.GetTaskCompleteTip({
				banquetTaskGUID: this.taskDetail.id,
				factExecutorID: storage.getAppUserInfo().marketerId,
			});
			if (res.error) {
				this.$cw.showError(res.error.message);
				return;
			}
			// 有权限才会进success,否则走fail回调
			const {
				isUploadFile, // 是否需要上传文件
				isCanUPloadFile, // 是否有权限上传文件
				isUploadImg, // 是否需要上传图片
				isCanUploadImg, // 是否有权限能上传头像
				isRemark, // 是否备注
				isCanRemark, // 是否有权限备注
				isRelatedDate, // 是否关联日期
				isRelateDate, // 是否有权限关联日期
			} = res;
			const obj = res;
			console.log('填写并建立新人档案', obj);
			if (currentStatus == '1') { // 如果之前是已完成,现在就走取消已完成的逻辑
				// 更新任务状态
				let updateData = {
					id: this.taskDetail.id,
					isExecuted: isExecuted,
					factExecutorID: storage.getAppUserInfo().marketerId,
					modifiedName: storage.getAppUserInfo().userName, //跟新操作人
				};
				this.updateByDto(updateData);
			} else { // 否则是未完成转已完成的逻辑
				// 都填写过,直接发请求完成的命令
				if (
					this.$cw.isShowTaskTip(isUploadFile, isCanUPloadFile) ||
					this.$cw.isShowTaskTip(isUploadImg, isCanUploadImg) ||
					this.$cw.isShowTaskTip(isRemark, isCanRemark) ||
					this.$cw.isShowTaskTip(isRelatedDate, isRelateDate)
				) {
					let params = util.urlEncode(obj).substring(1);
					// authObj=util.urlEncode(authObj).substring(1);
					// console.log(params);
					let url = '/pages/banquetSub/taskTip/taskTip?taskId=' + this.taskDetail.id + '&ralationTaskText=' + this.taskDetail
						.ralationTaskText + '&' + params;
					uni.navigateTo({
						url,
					});
				} else {
					// 更新任务状态
					let updateData = {
						id: this.taskDetail.id,
						isExecuted: isExecuted,
						factExecutorID: storage.getAppUserInfo().marketerId,
					};
					this.updateByDto(updateData);
				}
			}
		},
		//导航栏删除按钮
		tapRightFromNav() {
			this.popupNum = 1;
			this.$refs.delPopup.open();
		},
		//点击跳转执行人页面
		changeExecutor() {
			if (this.isAdmin) {
				uni.navigateTo({
					url: `/pages/banquetSub/selExecutor/selExecutor?id=${this.taskDetail.id}&banquetTaskExecutorIds=${this.taskDetail.banquetTaskExecutorIds}`
				})
			}
		},
		//点击执行日期按钮
		chooseDate(e) {
			// console.log(e.target.value)
			this.taskDetail.executeDate = e.target.value || e.detail.value;
			let data = {
				id: this.taskDetail.id,
				executeDate: this.taskDetail.executeDate + ' 00:00:00'
			}
			this.updateByDto(data);
		},
		changeRemark() { //跳转备注页面
			if (!this.isCoordinator) {
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			uni.navigateTo({
				url: `/pages/banquetSub/addRemark/addRemark?id=${this.taskDetail.id}&banquetTaskRemark=${this.taskDetail.banquetTaskRemark}&type=2`
			})
		},
		delFile(id, type) { //删除文件
			this.popupNum = 4;
			this.$refs.delPopup.open();
			this.fileId = id;
			this.fileType = type;
		},
		previewSignImg() { //放大签名图片
			let imgarr = [];
			imgarr.push(this.taskDetail.cstSignImgUrl)
			uni.previewImage({
				urls: imgarr,
				indicator: 'none'
			})
		},
		previewImage(img) { //放大图片
			console.log('放大图片')
			uni.previewImage({
				current: img,
				urls: this.imageList,
				indicator: 'default'
			})
		},
		async goFree() { //去分享
			if (this.$cw.isApp(true)) {
				const webpageurl = "https://mp.weixin.qq.com";
				let imgUrl = '';
				const int = this.$cw.weixinIntType;
				let pagePath = `pages/myOrderSub/taskDetail/taskDetail?id=${this.id}`;
				let title = '有任务需要我们共同完成';
				let desc = '';

				// 获取动态imgUrl
				let bgData = {
					shareBgType: 4, // 分享背景图片类型(1,宴会情况;2,完善档案;3,项目评价;4.任务完成;5.预订信息)
					// banquetOrderGUID: this.taskDetail.banquetOrderGUID, // 宴会单id
					// banquetProjectGUID: this.taskDetail.banquetProjectGUID, // 宴会项目id
					banquetTaskGUID: this.taskDetail.id, // 宴会任务id
					// bookOrderId: '', // 预订单id
				};
				let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
				const {
					bgUrl
				} = result;
				imgUrl = bgUrl;
				console.log(
					`
						webpageurl:${webpageurl}
						pagePath:${pagePath}
						title:${title}
						desc:${desc}
						imgUrl:${imgUrl}
						int:${int}`
				)
				uni.showToast({
					title: '正在打开微信...',
					icon: 'none',
				});
				this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int);

			}
		},
		async relationDate(e) { //底部日期按钮
			if (!this.isCoordinator ) {
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			let date = e.target.value || e.detail.value;
			console.log('第一次关联日期', date)
			this.taskDate = e.target.value || e.detail.value; //再次改关联日期
			//判断是否有关联日期 有:修改日期/ 有:关联任务-确认  否:修改日期   弹窗:提示关联任务2   再次修改3
			// 有:判断是否有关联任务 ,修改关联任务时间
			// 	有 弹窗提示关联任务修改 3
			// 	否 修改关联任务时间
			// 没有:判断是否支持关联任务
			// 	支持 弹窗2确认关联任务信息 -发送创建关联任务请求
			// 	不支持 修改宴会详情关联日期
			if (this.taskDetail.relatedDate != '') { //判断是否有关联日期
				this.popupNum = 3;
				if (this.taskDetail.isOperTask == 1 && this.taskDetail.taskConfGUID != '') { //有关联日期 并且可以关联任务
					console.log('有关联日期 并且可以关联任务1')
					this.$refs.delPopup.open();
					if (JSON.stringify(this.relationDetail) == '{}') {
						//发送获取关联任务信息请求
						let res = await YHTaskConf.GetRelatedTaskInfo({
							taskConfGUID: this.taskDetail.taskConfGUID
						});
						this.relationDetail = res;
						this.relationDetail.relatedDate = date;
						this.$refs.delPopup.open();
					}
				} else { //有关联日期 不能关联任务
					console.log('有关联日期 不能关联任务1-2')
					let data = {
						id: this.taskDetail.id,
						relatedDate: date + ' 00:00:00'
					}
					this.updateByDto(data);
				}
			} else { //没有关联日期
				if (this.taskDetail.isOperTask == 1 && this.taskDetail.taskConfGUID != '') { // isOperTask: 否关联任务;是否有taskConfGUID 任务GUID
					console.log('没有关联日期 并且可以关联任务2-1')
					this.popupNum = 2;
					//发送获取关联任务信息请求
					let res = await YHTaskConf.GetRelatedTaskInfo({
						taskConfGUID: this.taskDetail.taskConfGUID
					});
					// console.log(res)
					this.relationDetail = res;
					this.relationDetail.relatedDate = date;
					this.$refs.delPopup.open();

				} else {
					console.log('没有关联日期 不能关联任务 修改关联日期2-2')
					//没有关联任务  发送更新任务详情请求 - 修改关联日期
					let data = {
						id: this.taskDetail.id,
						relatedDate: date + ' 00:00:00'
					}
					this.updateByDto(data);
				}
			}
		},
		upBottomPopup() { //打开底部popup 上传图片
			this.$refs.projPopupRef.open();
		},
		uploadAPI(path) {
			let imgSize = (path.size / 1048576).toFixed(2);
			let filesPath = path.webkitRelativePath;
			let data = {
				// clueFileUrl:"",//文件路径(上传文件)
				clueFileSize: imgSize, //文件大小M
				clueFileType: 2, //文件类型(1,图片;2,文件)
				createdRemark: path.name, //上传人文件描述 名字
			}
			// console.log('data', data)
			uni.uploadFile({
				url: 'https://pic.cwyyt.cn', //仅为示例，非真实的接口地址
				fileType: 'image',
				filePath: filesPath,
				name: 'file',
				success: (res) => {
					// console.log('tupian', res)
					let path = JSON.parse(res.data).path;
					let changeFileUrl = `https://pic.cwyyt.cn${path}`;
					data.clueFileUrl = changeFileUrl;
					//创建记录
					this.createByDto(data);
					this.$refs.projPopupRef.close();

				}
			});
		},
		upLoadFiles() { //上传文件
			if (!this.isCoordinator) {
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			return document.getElementById("file").click();
			// uni.showToast({
			// 	title: '上传文件-开发中...',
			// 	icon: 'none'
			// })
		},
		//popup 相机
		selCamera() {
			let imgType = ['camera'];
			this.upLoadImg(imgType);
		},
		//popup 相册
		selAlbum() {
			let imgType = ['album'];
			this.upLoadImg(imgType);
		},
		//popup 取消
		closeProjPopup() {
			this.$refs.projPopupRef.close();
		},
		//删除提示框取消按钮
		cancel() {
			this.$refs.delPopup.close();
		},
		//删除提示框确认按钮 1
		async confirm() { //删除任务
			let res = await YHBanquetTask.DeleteByDto({
				id: this.taskDetail.id
			});
			let logTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm');
			let createdName = storage.getAppUserInfo().userName; //登陆人
			let str = `${logTime} ${createdName}删除了任务 任务名称:${this.taskDetail.taskConfName}`
			this.createLogByDto(str)
			this.$refs.delPopup.close();
			uni.navigateBack({ //返回宴会详情
				detail: 1
			})
		},
		async create() { //创建关联任务 2
			let data = {
				banquetTaskGUID: this.taskDetail.id, //宴会任务id
				banquetOrderGUID: this.taskDetail.banquetOrderGUID, //宴会单id
				relatedDate: this.relationDetail.relatedDate + ' 00:00:00'
			};
			let res = await YHTaskConf.CreateRelatedTask(data);
			if (res.length != 0) {
				// console.log(res)
				// this.taskDetail.relatedDate=this.relationDetail.relatedDate   //this.relationDetail.relatedDate 或者返回日期
				this.$refs.delPopup.close();
				this.getViewDto();
			}
		},
		updateDate() { //再次修改关联日期 3
			//修改关联任务时间 -1.任务详情;2.关联任务
			let data = {
				id: this.taskDetail.id,
				relatedDate: this.taskDate + ' 00:00:00'
			}
			this.updateByDto(data);
			this.$refs.delPopup.close();
			// this.getViewDto();
		},
		async fileConfirm() { //删除文件 4
			let res = await YHClueFileManage.DeleteByDto({
				id: this.fileId
			});
			this.$refs.delPopup.close();
			//操作日志-删除图片 文件
			let str = '';
			let createdName = storage.getAppUserInfo().userName; //登陆人
			let logTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm');
			if (this.fileType == 1) {
				str = `${logTime} ${createdName}操作了任务 任务名称:${this.taskDetail.taskConfName},删除了图片 `
			} else if (this.fileType == 2) {
				str = `${logTime} ${createdName}操作了任务 任务名称:${this.taskDetail.taskConfName},删除了文件`
			}
			// 删除了文件  2020-01-14 09:33 项目名称：hhh
			this.createLogByDto(str);
			this.getViewDto();
		},
		//获取宴会详情
		async getViewDto() {
			let res = await YHBanquetTask.GetViewDto({
				id: this.id
			});
			let imgArr = [];
			res = this.$util.null2str(res);
			// console.log('res1:', res)
			this.taskDetail = res;
			this.viewYHClueFileManages = res.viewYHClueFileManages;
			this.isChecked = res.isExecuted == 0 ? false : true;
			//更新图片列表 用于放大图片
			this._(this.viewYHClueFileManages).forEach(item => {
				if (item.clueFileType == 1) {
					imgArr.push(item.clueFileUrl)
				}
			})
			this.imageList = imgArr;
			storage.removeIsRefresh(); //移除需要刷新缓存

		},
		//修改任务详情
		async updateByDto(data) {
			data.modifiedName = storage.getAppUserInfo().userName; //跟新操作人
			let res = await YHBanquetTask.UpdateByDto(data);
			// console.log(res)
			res = this.$util.null2str(res);
			if (res.relatedDate != '') {
				this.taskDetail.relatedDate = res.relatedDate;
			}
			console.log('关联日期更新后', this.taskDetail.relatedDate)
			this.isChecked = res.isExecuted == 0 ? false : true;
			this.taskDetail.isExecuted = res.isExecuted == 0 ? 0 : 1;
			// console.log('check', this.isChecked)
			// console.log('isExecuted', this.taskDetail.isExecuted)
		},
		//创建图片文件记录
		async createByDto(data) {
			data.banquetTaskGUID = this.taskDetail.id; //宴会任务GUID(YH_BanquetTask)
			// clueFileUrl:"",//文件路径(上传文件)
			data.uploadRoleType = 1; //上传人角色(1,客户经理;2,客户)
			data.createdName = storage.getAppUserInfo().userName; //登陆人

			let res = await YHClueFileManage.CreateByDto(data);
			this.getViewDto();
		},
		//创建操作日志=删除图片 任务
		createLogByDto(str) {
			let logData = {
				banquetOrderGUID: this.taskDetail.banquetOrderGUID, //宴会单GUID(YH_BanquetOrder)
				operatorName: storage.getAppUserInfo().userName, //操作人
				orderHistoryLogContent: str, //描述
			}
			YHBanquetHistoryLog.CreateByDto(logData, res => {
				// console.log('删除文件创建日志',res)
			})
		},
		addPhoto() {
			if (!this.isCoordinator) {
				this.$cw.showError('您没有权限执行此操作');
				return;
			}
			this.$refs.uploadImg._startChoose()
		},
		// 获取上传后的http图片地址
		getImgUrl(picInfo) {
			if (picInfo) {
				let logData = {
					clueFileUrl: picInfo.url, //文件路径(上传文件)
					clueFileSize: picInfo.imgSize, //文件大小M
					clueFileType: 1, //文件类型(1,图片;2,文件)
					createdRemark: picInfo.picName, //上传人文件描述 名字
				}
				//创建记录
				this.createByDto(logData);
			}
		}
	}
}
