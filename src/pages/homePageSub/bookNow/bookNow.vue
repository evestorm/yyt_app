<template>
	<view class="bookNow-root">
		<!-- 导航栏 -->
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="立即预订"
			:right-icon="rightDynamicMenuArr.length > 0 ? 'more-filled' : ''"
			@clickRight="tapRightFromNav"
			color="#ffffff"
			background-color="#0782ff"
			:fixed="true"
			ref="navbarRef"
		></uni-nav-bar>
		<!-- 右上角门店弹窗 -->
		<uni-popup
			bubble='right'
			class="nav-popup"
			ref="morePopup"
			type="position"
			posi="top: 50px; right: 0; display: flex; justify-content: flex-end;"
			:custom="true"
			:mask-click="true"
		>
			<view class="wrapper" style="margin-right: 20rpx;">
				<view v-for="(item, index) in rightDynamicMenuArr" :key="index" class="item" @tap="seleMenu(item)">
					<!-- <image class="img" :src="item.icon"></image> -->
					<view class="title">{{ item.label }}</view>
				</view>
			</view>
		</uni-popup>

		<view class="bookNow-container">
			<!-- 左侧 未预订 -->
			<view class="bookNow-list" v-if="!bookID">
				<scroll-view class="table-list" scroll-y="true" v-if="curTable">
					<view :class="['bookNow-item', item.selected ? 'bookNow-selItem' : '']" v-if="item.tableIsLock == 0&&isCanSelect(item.orderList)" v-for="item in curTable.tableList"
					 :key="item.tableID" @tap="selectTable(item)">
						<view>
							<!-- <view>{{curTable.name}}</view> -->
							<view>{{item.tableName}}</view>
						</view>
						<view class="cuIcon-check"></view>
					</view>
				</scroll-view>
				<view v-if="curTable" class="bookNow-list-bot">
					<view>已选</view>
					<view>(<text>{{number}}</text>)</view>
				</view>
			</view>
			<!-- 左侧 已预订 -->
			<view class="bookNow-list" v-else>
				<scroll-view class="table-list" scroll-y="true" v-if="curTable">
					<view :class="orderTableClass(item)" v-if="item.orderList.length > 0 || ~orderTableId.indexOf(item.tableID)" v-for="item in curTable.tableList"
					 :key="item.tableID" @tap="selectOrderTable(item)">
						<view>
							<!-- <view>{{curTable.name}}</view> -->
							<view>{{item.tableName}}</view>
						</view>
						<view class="bookNow-dot-box" v-if="item.orderList.length >= 2">
							<!-- <view></view> -->
							<view v-for="(orderItem, orderIndex) in item.orderList" :key="orderIndex"></view>
						</view>
					</view>
				</scroll-view>
				<view v-if="curTable" class="bookNow-list-bot">
					<view>已选</view>
					<view>(<text>{{orderTableId.length}}</text>)</view>
				</view>
			</view>
			<!-- 右侧 -->
			<view class="bookNow-box">
				<view class="bookNow-custom" v-if="curOrderTable.orderList && curOrderTable.orderList.length > 1 && !isEdit">
					<scroll-view scroll-x="true" class="bookNow-personList">
						<view :class="['bookNow-person', item.bookID == curOrder.bookID ? 'bookNow-personlSel' : '']" v-for="(item, index) in curOrderTable.orderList"
						 :key="index" @tap="changePeople(item)">{{item.bookerName}}</view>
					</scroll-view>
				</view>
				
				<!-- 顶部选中卓台 -->
				<view class="row  font-28 bg-white align-center d-flex align-center" style="height: 60rpx;margin-bottom: 8rpx;padding-left: 30rpx;" >
					<view class="">
						共{{alreadySelectTables.length}}桌:
					</view>
					<view class="font-weight ellips-1" style="max-width:calc(100vw - 260rpx)">
						{{alreadySelectTables.map(x=>x.tableName).join(';')}}
					</view>
					<!-- <text>
						共{{alreadySelectTables.length}}桌:<text class="font-weight">{{alreadySelectTables.map(x=>x.tableName).join(';')}}</text>
					</text> -->
				</view>
				
				<view class="bookNow-basis bookNow-com" :style="{marginTop: curOrderTable.orderList && curOrderTable.orderList.length > 1 && !isEdit ? '40rpx' : '0px'}">
					
					<view class="phone-inline position-relative" >
						<text class="bookNow-require">*</text>
						<text class="bookNow-label">电话:</text>
						<input class="bookNow-input flex-1" type="number" :disabled="!isCanEdit" cursor="20" placeholder="为必填信息" placeholder-class="place-class" v-model="bookInfo.bookerPhone" @input="changePhone"></input>
						<view class="iconfont icon-lianxiren text-primary yyt-extend-area" v-if="isEdit" @tap="searchTelPhone"></view>
						<text @tap="goCustomInfo(bookInfo)" class="go-info yyt-extend-area" v-else>详情</text>
						<!-- <view class="send-msg" v-else @tap="sendMsg(bookInfo)">
							发短信
						</view> -->
						<!-- 搜索电话时快捷提示 -->
						<view class="position-absolute right-0 tell-tip" @touchmove.prevent>
							<view class="ellips-1 line-h py-2 pl-1 font-22" v-for="(item,index) in phoneSearchList" :key='index' @tap='selectCustom(item)'>
								<text class="mr-1">{{item.phone}}</text>
								<text class="mr-1">{{item.name}}</text>
								<text>{{item.company}}</text>
							</view>
						</view>
						<!-- 全屏蒙版 可以点击 -->
						<view class="menban position-fixed top-0 left-0 " @touchmove.prevent @tap="closeMenban" v-show="phoneSearchList.length!=0 || companySearchList.length!=0"></view>
					</view>
					<view class=" name" style="position: relative;">
						<text class="bookNow-require">*</text>
						<text class="bookNow-label">姓名:</text>
						<!-- 编辑状态不显示input，显示一个text，实现点击姓名才能跳转 -->
							<!-- 右边这段是原input中的 :class="{ active: bookInfo.customerID !== '' && typeof(bookInfo.customerID) !== 'undefined' && bookInfo.customerID != 'null' }" -->
						<input class="bookNow-input flex-1"
							v-show="isEdit"
							max-length="10" type="text" :disabled="!isCanEdit" placeholder="为必填信息"
							placeholder-class="place-class" v-model="bookInfo.bookerName"></input>
						<view class="bookNow-input active" v-show="!isEdit" @tap="goCustomInfo(bookInfo)">{{ bookInfo.bookerName }}</view>
						<view @tap.stop.prevent="" v-if="statusStr" class="bookNow-status"><text>{{statusStr}}</text>
							<image v-if="statusImg" :src="statusImg"></image>
						</view>
					</view>
					<view class="position-relative">
						<text class="bookNow-require" style="visibility: hidden;">*</text>
						<text class="bookNow-label">单位:</text>
						<input class="bookNow-input" type="text" :disabled="(!isEdit) || (isSelf?false:!isCanEdit)" v-model="bookInfo.company" @input="changeCompany"></input>
						<!-- 搜索单位时快捷提示 -->
						<view class="position-absolute right-0 tell-tip" @touchmove.prevent>
							<view class="ellips-1 line-h py-2 pl-1 font-22" v-for="(item,index) in companySearchList" :key='index' @tap="selectCompany(item)" >
								<text class="">{{item.name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="bookNow-detail bookNow-com">
					<view>
						<text class="bookNow-label">客户经理:</text>
						<picker :value="marketerIndex" :range="marketerNames" @change="selMarket" :disabled="!isCanEdit">
							<view class="picker">
								{{marketerNames[marketerIndex]}}
							</view>
							<view class="cuIcon-right" v-if="isEdit"></view>
						</picker>
					</view>
					<view>
						<text class="bookNow-label">日期:</text>
						<picker mode="date" :value="pickerData" @change="chooseDate($event)" :disabled="!isCanEdit">
							<view class="picker">
								{{pickerData}}
							</view>
							<view class="cuIcon-right" v-if="isEdit"></view>
						</picker>
					</view>
					<view>
						<text class="bookNow-label">餐别:</text>
						<scroll-view scroll-x="true" class="bookNow-scroll">
							<view v-if="isEdit" v-for="(item, index) in dinnerType" :key="item.diningTypeID" :class="item.selected ? 'bookNow-scroll-sel' : '' "
							 @tap="selDinnerType(index)">{{item.name}}</view>
							<view v-if="!isEdit && item.selected" v-for="(item, index) in dinnerType" :key="item.name" :class="item.selected ? 'bookNow-scroll-sel' : '' "
							 @tap="selDinnerType(index)">{{item.name}}</view>
						</scroll-view>
					</view>
					<view>
						<text class="bookNow-label">预订时间:</text>
						<picker v-if="orderTime" :value="orderTimeIndex" :range="orderTime" @change="selOrderTime" :disabled="!isCanEdit">
							<view class="picker">
								{{isEdit?orderTime[orderTimeIndex]:bookInfo.willArrivedOn}}
							</view>
							<view class="cuIcon-right" v-if="isEdit"></view>
						</picker>
						<input v-else class="bookNow-input" type="text" disabled="disabled" placeholder="请先选择餐别" placeholder-class="place-class"></input>
					</view>
					<view class="plus-minus">
						<text class="bookNow-label">预订人数:</text>
						<view>
							<view class="span-5 radius-20 text-white bg-primary" style="padding:5rpx 0 5rpx 0"  @tap="minus('bookNums')" v-if="isEdit&&isCanEdit">-</view>
							<input class="bookNow-input" type="text" maxlength="4" v-model="bookNums" :disabled="!isCanEdit"></input>
							<view @tap="plus('bookNums')" v-if="isEdit&&isCanEdit" style="padding:5rpx 0 5rpx 0" class="span-5 radius-20 text-white bg-primary">+</view>
						</view>
					</view>
					<view class="plus-minus">
						<text class="bookNow-label">预订桌数:</text>
						<view>
							<view class="span-5 radius-20 text-white bg-primary"  style="padding:5rpx 0 5rpx 0" @tap="minus('bookTableNum')" v-if="isEdit&&isCanEdit">-</view>
							<input class="bookNow-input" type="text" maxlength="4" v-model="bookTableNum" :disabled="!isCanEdit"></input>
							<view @tap="plus('bookTableNum')" v-if="isEdit&&isCanEdit"  style="padding:5rpx 0 5rpx 0" class="span-5 radius-20 text-white bg-primary">+</view>
						</view>
					</view>
					<view>
						<text class="bookNow-require">*</text>
						<text class="bookNow-label">预订类型:</text>
						<picker :value="orderTypeIndex" :range="orderTypeName" @change="selOrderType" :disabled="(!isEdit) || (isSelf?false:!isCanEdit)">
							<view class="picker">
								{{orderTypeName[orderTypeIndex]}}
							</view>
							<view class="cuIcon-right" v-if="isEdit"></view>
						</picker>
					</view>
					<view>
						<text class="bookNow-label">应付金额:</text>
						<input class="bookNow-input" type="number" :disabled="!isCanEdit" v-model="fee"></input>
					</view>
					<view>
						<text class="bookNow-label">实付金额:</text>
						<input class="bookNow-input" type="number" :disabled="!isCanEdit" v-model="orderRealAmount"></input>
					</view>
					<view>
						<text class="bookNow-label">定金金额:</text>
						<view class="bookNow-input">
							<input v-if="paid" :disabled="!isCanEdit" v-model="frontMoney" type="number" placeholder="" placeholder-class="place-class"
							 maxlength="11"></input>
						</view>
						<checkbox-group @change="selectOrderFee" v-if="isCanEdit">
							<checkbox value="1" :checked="Boolean(paid)"></checkbox>
						</checkbox-group>
					</view>
					<view class="position-relative">
						<text class="bookNow-label">备注:</text>
						<textarea v-model="bookInfo.habit" :disabled="(!isEdit) || (isSelf?false:!isCanEdit)"></textarea>
						<!-- <view @tap='isEditRemark' style="top:-20rpx;right: -20rpx;" class="p-2 position-absolute" >
							<image style="width: 30rpx;height: 30rpx;" src="https://pic.cwyyt.cn/upload/yyticons/1623222322_address-edit.png" mode=""></image>
						</view> -->
					</view>
					<view v-if="!isApproveInAppBook">
					    <text class="bookNow-label">发送短信:</text>
					    <radio-group class="checkStatus-radio">
					        <label @tap="changeSendMsg('10')">
								<radio value="1" :checked="sendMsgType=='10'" :disabled="true"/>
								<view>短信</view>
					        </label>
					        <label @tap="changeSendMsg('20')">
								<radio value="0" :checked="sendMsgType=='20'" :disabled="true"/>
								<view>微信</view>
					        </label>
					        <label @tap="changeSendMsg('0')">
								<radio value="0" :checked="sendMsgType=='0'" :disabled="true"/>
								<view>不发送</view>
					        </label>
					    </radio-group>
					</view>
				</view>
				<view class="bookNow-tableSel bookNow-com">
					<view class="bookNow-tableSel-top">
						<view>已选桌台：</view>
						<view class="plus-css" @tap="tablePanelShow" v-if="isEdit&&isCanEdit"></view>
					</view>
					<view class="bookNow-tableSel-list">
						<!-- 利用计算属性获取已经选择的卓台 -->
						<view v-for="table in alreadySelectTables" :key="table.tableID"
						 class="bookNow-tableSel-item">
							{{table.areaName}} {{table.tableName}}
							<view class="cuIcon-close" @tap="delSelect(table)" v-if="isEdit"></view>
						</view>
					</view>
				</view>
				<view class="extend-view"></view>
				<view class="bookNow-orderBtn" v-if="!isEdit">
					<view v-if="!curOrder.isClose && isShowBtn" @tap="cancelReason(curOrder)">取消</view>
					<!-- <view v-if="curOrder.status != 3 && !curOrder.fee && !curOrder.isClose" @tap="UpdateByDto(3)">到店</view> -->
					<!-- <view v-if="curOrder.status == 1 && !curOrder.fee && !curOrder.isClose" @tap="Operbook(2)">审核</view> -->
					<!-- <view v-if="curOrder.status == 2 && !curOrder.fee && !curOrder.isClose" @tap="UpdateByDto(3)">到店</view> -->
					<!-- <view @tap="chance(curOrder)">机会</view> --> <!-- bug:5470 -->
					<view v-if="(!curOrder.isClose)&&(isSelf ? true : $cw.canEditCancelOfOther()) " @tap="editOrder">编辑</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" style="z-index: 990;">
			<!-- 新增 -->
			<view class="tablePanel-box" v-if="tablePanel && !bookID">
				<view class="tablePanel-container">
					<view class="tablePanel-head">选择桌台</view>
					<view class="tablePanel-mid">
						<scroll-view class="tablePanel-area" scroll-y="true">
							<view :class="['tablePanel-area-item', areaItem.selected ? 'tablePanel-area-sel' : '']" v-for="areaItem in areaTableCopy"
							 :key="areaItem.tableAreaID" @tap="selectArea(areaItem)">
								<view>{{areaItem.name}}</view>
								<view>(<text>{{areaItem | selArea}}</text>/{{areaItem | noOrderLength}})</view>
							</view>
						</scroll-view>
						<scroll-view class="tablePanel-table" scroll-y="true">
							<template v-if="curTableCopy">
								<view v-for="item in curTableCopy.tableList" :key="item.tableID" @tap="selectAreaTa(item)" v-if="item.tableIsLock == 0&&isCanSelect(item.orderList)"
								 :class="['tablePanel-table-item', item.selected ? 'tablePanel-table-sel' : '']">
									{{item.tableName}}
								</view>
							</template>
						</scroll-view>
					</view>
					<view class="tablePanel-bot">
						<view @tap="tableSelCancel">取消</view>
						<view @tap="tableSelConfirm">确认</view>
					</view>
				</view>
			</view>
			
			<!-- 预订 -->
			<view class="tablePanel-box" v-if="tablePanel && bookID">
				<view class="tablePanel-container">
					<view class="tablePanel-head">选择桌台</view>
					<view class="tablePanel-mid">
						<scroll-view class="tablePanel-area" scroll-y="true">
							<view :class="['tablePanel-area-item', areaItem.selected ? 'tablePanel-area-sel' : '']" v-for="areaItem in areaTableCopy"
							 :key="areaItem.tableAreaID" @tap="selectArea(areaItem)">
								<view>{{areaItem.name}}</view>
								<view>(<text>{{areaItem | selOrderNum(orderTableId)}}</text>/{{areaItem.tableList.length}})</view>
							</view>
						</scroll-view>
						<scroll-view class="tablePanel-table" scroll-y="true">
							<template v-if="curTableCopy">
								<view v-for="item in curTableCopy.tableList"
									v-if="item.tableIsLock == 0&&isCanSelect(item.orderList)"
								 :key="item.tableID" @tap="selectOrderTa(item)" :class="orderPanelClass(item)">
									{{item.tableName}}
								</view>
							</template>
						</scroll-view>
					</view>
					<view class="tablePanel-bot">
						<view @tap="tableSelCancel">取消</view>
						<view @tap="tableSelConfirm">确认</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- <uni-popup ref="remarkPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>输入备注信息</text>
					<image class="popup-top-img" src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png" mode="" @tap="cancel()"></image>
				</view>
				<view class="popup-mid">
					<textarea class="poput-textarea" v-model="remarkText" placeholder="" />
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancel()">取消</view>
					<view class="confirm" @tap="confirmRemark()">确定</view>
				</view>
			</view>
		</uni-popup> -->
		
		<!-- 确定按钮 -->
		<button class="cu-btn round confirm-btn bg-blue shadow" @tap="confirm" v-if="!bookID">确定</button>
		<!-- 编辑确定取消按钮 -->
		<view class="editBtn-container" v-if="bookID && isEdit">
			<button class="cu-btn bg-blue shadow" @tap="editCancel">取消</button>
			<button class="cu-btn bg-blue shadow" @tap="editConfirm">保存</button>
		</view>
	</view>
</template>

<script>
	export {
		default
	}
	from './bookNow.js'
</script>

<style lang="less" scoped>
	@import "../../../lib/colorui/icon.css";
	@import "./bookNow.less";
</style>
