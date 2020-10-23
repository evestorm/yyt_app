import {
	Enum
} from '@/common/enum/Enum.js';

/**
 * 全局公共枚举类
 */
export default {
	// 公共列表页页面类型
	commonListEnum: new Enum()
		.add('customerOrder', '客户订单', '1')
		.add('banquetOrder', '宴会订单', '2')
		.add('individualOrders', '散客订单', '3')
		.add('accommodationOrder', '住宿订单', '4')
		.add('transformOrder', '转化订单', '5')
		.add('activeTransformation', '全部转化', '6') // 从主动转化改为全部转化
		.add('recommendedTransformation', '推荐转化', '7')
		.add('customerPool', '客户池', '8')
		.add('customerTracking', '客户跟踪', '9')
	// // 结果枚举
	// ResultEnum: new Enum().add('SUCCESS', '操作成功', 200).add('ERROR', '操作失败', 400).add('PARAM_ERROR', '参数错误', 405).add(
	// 		'SERVER_ERROR', '服务器异常', 500)
	// 	.add('NO_PERMISSION', '没有权限', 501)
}
