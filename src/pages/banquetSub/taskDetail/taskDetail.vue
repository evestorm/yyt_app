<template>
	<view class="task-detail-wrapper" :class="{ 'sw-scroll-no': !pageCanScroll }">
		<!-- uniapp-导航栏 -->
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="任务详情"
			:rightText="isCoordinator ? rightText : ''"
			@clickRight="tapRightFromNav"
			color="#ffffff"
			background-color="#0782ff"
			:fixed="true"
			ref="navbarRef"
		></uni-nav-bar>
		<!-- 档案内容 -->
		<view class="task-detail">
			<checkbox-group class="task-checkbox">
				<label class="uni-list-cell" @tap="createFile">
					<checkbox
						:disabled="!isCoordinator"
						value=""
						:checked="isChecked"
						color="#FFCC33"
						style="transform:scale(0.7)"
					/>
					<text class="check-text">{{ taskDetail.taskConfName }}</text>
				</label>
			</checkbox-group>
			<view class="task-list">
				<view class="line-title">任务类型</view>
				<view class="line-info">{{ taskDetail.bizOptionName }}</view>
			</view>
			<view class="task-list" @tap="changeExecutor">
				<view class="line-title">执行人</view>
				<view class="line-info">
					<text>
						{{
							taskDetail.banquetTaskExecutorNames &&
								taskDetail.banquetTaskExecutorNames.slice(0, 20)
						}}
					</text>
					<text
						v-show="
							taskDetail.banquetTaskExecutorNames &&
								taskDetail.banquetTaskExecutorNames.length > 20
						"
					>
						...
					</text>
					<image
						v-show="isAdmin"
						class="arrowRight"
						:src="picDomain + '/upload/yytApp/images/arrowRight.png'"
					></image>
				</view>
			</view>
			<view class="task-list">
				<view class="line-title">执行日期</view>
				<view class="" v-show="!isAdmin">{{ taskDetail.executeDate | parseShortDate }}</view>
				<picker
					v-show="isAdmin"
					class=""
					mode="date"
					:value="taskDetail.executeDate | parseShortDate"
					@change="chooseDate"
				>
					<view class="line-info">
						{{ taskDetail.executeDate | parseShortDate }}
						<text class="line-title" v-show="taskDetail.executeDate == ''">请选择执行日期</text>
						<image
							class="arrowRight"
							:src="picDomain + '/upload/yytApp/images/arrowRight.png'"
						></image>
					</view>
				</picker>
			</view>
			<view class="task-list">
				<view class="line-title">所属项目</view>
				<view class="line-info">{{ taskDetail.projectConfName }}</view>
			</view>
			<view class="task-remark">
				<view class="line-title lie-h">相关资料</view>
				<view class="d-flex flex-wrap pt-2">
					<view
						class="w-25 my-1 text-center px-1"
						v-for="(item, aIndex) in taskDetail.attachInfos"
						:key="aIndex"
						@tap="openAttchInfo(item)"
					>
						<view class="">
							<image
								:src="item.bgUrl"
								class="img"
								:class="`img${item.contentType}`"
								mode=""
							></image>
							<view class="line-h-sm ellips-2">{{ item.name }}</view>
						</view>
						<!-- <a :href="fileOnlineRead+item.content" target='_blank' v-else style="text-decoration: none;color: #000000;">
							<image :src="item.bgUrl" class="img" :class="`img${item.contentType}`" mode=""></image>
							<view class="line-h-sm ellips-2">
								{{item.name}}
							</view>
						</a> -->
					</view>
				</view>
			</view>
			<view class="task-remark" v-show="taskDetail.isOpenToCst == 1 && taskDetail.isCanCstRemark == 1">
				<view class="line-title">客户备注</view>
				<view class="line-info">{{ taskDetail.cstRemark }}</view>
			</view>
			<view class="remark" v-show="taskDetail.isCanRemark == 1" @tap="changeRemark">
				<view class="remark-top">
					<view class="line-title">备注</view>
					<image
						class="arrowRight"
						:src="picDomain + '/upload/yytApp/images/arrowRight.png'"
					></image>
				</view>
				<view class="remark-placeholder" v-show="taskDetail.banquetTaskRemark == ''">
					请输入备注信息
				</view>
				<view class="remark-bot" v-show="taskDetail.banquetTaskRemark != ''">
					{{ taskDetail.banquetTaskRemark }}
				</view>
			</view>
			<view class="task-list" v-show="taskDetail.isOpenToCst == 1 && taskDetail.isCanSign == 1">
				<view class="line-title">客户签名</view>
				<view class="line-sign" v-show="taskDetail.cstSignImgUrl == ''">等待客户签名</view>
				<image
					v-show="taskDetail.cstSignImgUrl != ''"
					:src="taskDetail.cstSignImgUrl"
					mode=""
					@tap="previewSignImg"
					class="line-image"
				></image>
			</view>
			<view class="task-list" v-show="taskDetail.relatedDate">
				<view class="line-title">{{ taskDetail.ralationTaskText }}</view>
				<view class="line-info">{{ taskDetail.relatedDate | parseShortDate }}</view>
			</view>
		</view>
		<!-- 上传文件图片内容 -->
		<view class="task-file">
			<view class="file-list" v-for="item in viewYHClueFileManages" :key="item.id">
				<image
					v-show="item.clueFileType == 2"
					class="file-icon"
					:src="picDomain + '/upload/yytApp/banquet/files.png'"
					mode=""
				></image>
				<image
					v-show="item.clueFileType == 1"
					class="file-img"
					@tap="previewImage(item.clueFileUrl)"
					:src="item.clueFileUrl"
					mode="aspectFit"
				></image>
				<!-- 图片 -->
				<view class="file-sec">
					<view class="file-title">{{ item.createdRemark }}</view>
					<view class="file-info">
						<text>{{ item.clueFileSize }}M</text>
						<text>{{ item.createTime }}</text>
						<!-- <text>10:26</text> -->
						<text>来自{{ item.createdName }}</text>
					</view>
				</view>
				<image
					v-show="isCoordinator || item.createGUID == marketerId"
					@tap="delFile(item.id, item.clueFileType)"
					class="del-file"
					:src="picDomain + '/upload/yytApp/banquet/del.png'"
					mode=""
				></image>
			</view>
		</view>
		<!-- 弹出确认提示框 -->
		<uni-popup ref="delPopup" type="center" class="del-popup">
			<view class="popup-top">
				<text>提示</text>
				<image
					class="popup-top-img"
					:src="picDomain + '/upload/yytApp/banquet/quxiao.png'"
					mode=""
					@tap="cancel()"
				></image>
			</view>
			<!-- popup中部 -->
			<!-- 删除任务1 -->
			<view class="" v-show="popupNum == 1">
				<view class="popup-mid">
					<image
						class="popup-mid-img"
						:src="picDomain + '/upload/yytApp/banquet/error.png'"
						mode=""
					></image>
					<text>您确定要删除该任务？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancel()">取消</view>
					<view class="confirm" @tap="confirm()">确定</view>
				</view>
			</view>
			<!-- 提示关联任务 -->
			<view class="relation" v-show="popupNum == 2">
				<view class="popup-mid">
					<image
						class="popup-mid-img"
						:src="picDomain + '/upload/yytApp/banquet/info.png'"
						mode=""
					></image>
					<view class="popup-mid-info">
						<view class="">
							您已经选择{{ relationDetail.relatedDate | parseTextDate }},此日期有关联任务：
						</view>
						<view class="">
							<text>项目: “</text>
							<text class="blue-font">{{ relationDetail.projectConfName }}</text>
							<text>”</text>
						</view>
						<view class="">
							<text>任务名: “</text>
							<text class="blue-font">{{ relationDetail.taskConfName }}</text>
							<text>”</text>
						</view>
						<view class="">
							<text>执行人:</text>
							<text class="blue-font">{{ relationDetail.banquetTaskExecutorNames }}</text>
							<text>。</text>
						</view>
						<view class="">是否创建?</view>
					</view>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancel()">否</view>
					<view class="confirm" @tap="create()">创建</view>
				</view>
			</view>
			<!-- 再次修关联任务日期 -->
			<view class="rechange" v-show="popupNum == 3">
				<view class="popup-mid">
					<image
						class="popup-mid-img"
						:src="picDomain + '/upload/yytApp/banquet/info.png'"
						mode=""
					></image>
					<text class="popup-mid-info">
						修改此日期会将“
						<text class="blue-font">{{ taskDetail.relatedTaskConfName }}</text>
						”任务的执行日期改变，是否要修改？
					</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancel()">取消</view>
					<view class="confirm" @tap="updateDate()">确定</view>
				</view>
			</view>
			<!-- 删除文件4 -->
			<view class="" v-show="popupNum == 4">
				<view class="popup-mid">
					<image
						class="popup-mid-img"
						:src="picDomain + '/upload/yytApp/banquet/error.png'"
						mode=""
					></image>
					<text>您确定要删除该文件？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancel()">取消</view>
					<view class="confirm" @tap="fileConfirm()">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 相关资料文本弹窗 -->
		<uni-popup ref="textPopop" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<view class="">{{ textContent.name }}</view>
					<image
						src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png"
						mode=""
						@tap="closeTextPopup"
						class="popup-top-img"
					></image>
				</view>
				<scroll-view scroll-y="true" style="height:calc(100vh - 600upx)">
					<text selectable="true">
					{{ textContent.content }}
					</text>
				</scroll-view>
			</view>
		</uni-popup>
		<!-- 底部弹出相关资料-文件-弹窗操作项目popup -->
		<uni-popup ref="downFileTip" type="bottom" class="bottom-popup" :custom="true" :maskClick="true">
			<view class="wrapper">
				<view class="pop-group">
					<view class="item" @tap="readFile">预览文件</view>
					<view class="item" @tap="downFile">下载该文件</view>
				</view>
				<view class="pop-group"><view class="item" @tap="closeDownFileTip">取消</view></view>
			</view>
		</uni-popup>
		<!-- 底部弹出的操作项目popup -->
		<uni-popup ref="projPopupRef" type="bottom" class="bottom-popup" :custom="true" :maskClick="true">
			<view class="wrapper">
				<view class="pop-group">
					<view class="item" @tap="selCamera">拍照</view>
					<view class="item" @tap="selAlbum">从手机相册选择</view>
				</view>
				<view class="pop-group"><view class="item" @tap="closeProjPopup">取消</view></view>
			</view>
		</uni-popup>
		<!-- 底部logo -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
		<view style="height: 88rpx;width: 100%;"></view>
		<!-- 底部按钮及提示 -->
		<view class="bottom-fixed">
			<view class="" v-show="taskDetail.isOpenToCst == 1">
				<view class="bottom-tip" v-show="taskDetail.cstIsUploadImg == 0 || taskDetail.cstIsSign == 0">
					<image
						class="share-img"
						:src="picDomain + '/upload/yytApp/banquet/share.png'"
						mode=""
					></image>
					<view class="">
						<text class="share-text">此任务还需要客户</text>
						<text
							class="share-text"
							v-show="taskDetail.isCanCstUploadFile == 1 && taskDetail.cstIsUploadImg == 0"
						>
							上传图片
						</text>
						<text
							class="share-text"
							v-show="
								taskDetail.isCanCstUploadFile == 1 &&
									taskDetail.cstIsUploadImg == 0 &&
									taskDetail.isCanSign == 1 &&
									taskDetail.cstIsSign == 0
							"
						>
							,
						</text>
						<text v-show="taskDetail.isCanSign == 1 && taskDetail.cstIsSign == 0">签名</text>
					</view>
					<view class="go-share" v-if="isCoordinator" @tap="goFree">发给客户</view>
				</view>
			</view>

			<view
				class="bottom-btn"
				v-show="
					taskDetail.isRelateDate == 1 ||
						taskDetail.isCanUploadImg == 1 ||
						taskDetail.isCanUPloadFile == 1
				"
			>
				<picker
					:disabled="!!!(isCoordinator)"
					v-show="taskDetail.isRelateDate == 1 && taskDetail.relatedDate != ''"
					class=""
					mode="date"
					:value="taskDetail.relatedDate | parseShortDate"
					@change="relationDate"
				>
					<view class="btn date">{{ taskDetail.ralationTaskText }}</view>
				</picker>
				<picker
					:disabled="!!!(isCoordinator)"
					v-show="taskDetail.isRelateDate == 1 && taskDetail.relatedDate == ''"
					class=""
					mode="date"
					:value="taskDetail.relatedDate || '9999-99-99'"
					@change="relationDate"
				>
					<view class="btn date" :class="isCoordinator?'':'unAuth'">{{ taskDetail.ralationTaskText }}</view>
				</picker>
				<!-- upLoadImg() -->
				<view class="btn file" :class="isCoordinator?'':'unAuth'" v-show="taskDetail.isCanUploadImg == 1" @tap="addPhoto">
					上传图片
				</view>
				<yyt-upload-img ref="uploadImg" @getImgUrl="getImgUrl"></yyt-upload-img>
				<!-- <view class="btn file" v-show="taskDetail.isCanUploadImg == 1" @click="upBottomPopup">上传图片</view> -->
				<view class="btn file" :class="isCoordinator?'':'unAuth'" ref="input" v-show="taskDetail.isCanUPloadFile == 1">
					<text @tap="upLoadFiles">上传文件</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './taskDetail.js';
</script>

<style lang="less" scoped>
@import url('taskDetail.less');
</style>
