const taskDetail = {
	taskName: '预订单确认', // 任务名称
	taskShortName: '2020-09-09 00:00:00', // 任务副标题
	isConfirmeFinance: 0, // 财务是否确认
	taskStatus: 10, // 任务状态(10,进行中;20,已完成)
	taskType: 10,// 任务类型(10,每日预订;20,每月跟踪)
	xTTaskOrderDetails: [{ // 预订单确认明细
		id: '1', // 预订单确任GUID
		taskOrderName: '杨树', // 需确认人名称
		isConfrimeOrder: 0, // 是否确认
	},{
		id: '2', // 预订单确任GUID
		taskOrderName: '杨敏', // 需确认人名称
		isConfrimeOrder: 1, // 是否确认
	},{
		id: '3', // 预订单确任GUID
		taskOrderName: '李白', // 需确认人名称
		isConfrimeOrder: 0, // 是否确认
	},{
		id: '4', // 预订单确任GUID
		taskOrderName: '财务', // 需确认人名称
		isConfrimeOrder: 0, // 是否确认
	}],
	xTTaskFollowDetails: [{ // 跟踪上报明细
		id: '1', // 跟踪上报GUID
		taskFollowName: '王五', // 需上报人姓名
		waitFollowCount: 2, // 待跟踪数量
		alreadyFollowCount: 3, // 已跟踪数量
		cancleFollowCount: 1, // 取消跟踪数量
	}],
	xTTaskReplyDetails: [{
		id: '1', // 任务表GUID
		taskReplyName: '郭德纲', // 回复人姓名
		replyContent: '', // 回复内容
		isReplyMessage: 0, // 是否为回复
		createTime: '2020-09-09 00:00:00', // 创建时间
		imgUrl: 'http://placekitten.com/200/200', // 头像图片地址
	},{
		id: '1', // 任务表GUID
		taskReplyName: '郭德纲', // 回复人姓名
		replyContent: '阿斯达所多，阿斯达所多,1大叔大婶多,·阿斯达所多，啊实打实大所，啊实打实大的，啊实打实大苏打，啊实打实大苏打', // 回复内容
		isReplyMessage: 1, // 是否为回复
		createTime: '2020-09-09 00:00:00', // 创建时间
		imgUrl: 'http://placekitten.com/200/200', // 头像图片地址
	}],
}
// const taskDetail = {
// 	taskId: '1',
// 	title: '预订单确认',
// 	date: '2020-09-09 00:00:00',
// 	status: 0,
// 	list: [{
// 		name: '杨树',
// 		status: 0,
// 	},{
// 		name: '杨敏',
// 		status: 1,
// 	},{
// 		name: '李白',
// 		status: 0,
// 	},{
// 		name: '财务',
// 		status: 0,
// 	}],
// };

// 聊天记录
// const chatList = [{
// 	avatar: 'http://placekitten.com/100/100',
// 	name: '杨舒',
// 	desc: '杨舒已确认',
// 	date: '2020-09-09 00:00:00',
// 	type: 'record',
// 	msg: '',
// },{
// 	avatar: 'http://placekitten.com/200/100',
// 	name: '杨敏',
// 	desc: '杨敏已确认',
// 	date: '2020-09-09 00:00:00',
// 	type: 'record',
// 	msg: ''
// },{
// 	avatar: 'http://placekitten.com/300/200',
// 	name: 'GC',
// 	desc: '',
// 	date: '2020-09-09 00:00:00',
// 	type: 'chat',
// 	msg: '不错！阿斯达所多爱仕达多所，阿斯达四大，阿斯达所多，啊实打实大苏打，阿萨达是所大所·，阿斯达所多阿斯达所多，按时大大撒'
// },{
// 	avatar: 'http://placekitten.com/400/300',
// 	desc: '杨舒已确认',
// 	date: '2020-09-09 00:00:00',
// 	type: 'record',
// 	msg: ''
// },{
// 	avatar: 'http://placekitten.com/300/200',
// 	name: 'Lance',
// 	desc: '',
// 	date: '2020-09-09 00:00:00',
// 	type: 'chat',
// 	msg: '超赞！'
// },]

export default {
	taskDetail,
}
