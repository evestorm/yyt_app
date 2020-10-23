<template>
	<view>
		<z-nav-bar :title="customTitle" bgColor="#0183ff" fontColor="#FFF">
			<sw-icon type="back" color="#fff" size="27" slot="left" @tap="onBack"></sw-icon>
		</z-nav-bar>
		<view class="mui-content">
			<view class="searchComment">
				<view class="tabControl" v-show="!isMonthCom">
					<view class="tabControl-item">
						<view class="dateShow" @tap="selectedTemplet(1)" id="replyTitle">
							<text>{{ dateShow.reply.title }}</text>
							<view class="dateSelectIcon"><image :src="picDomain + '/upload/yytApp/my/down.png'" alt="" class="toTopPic" /></view>
						</view>
					</view>
					<view class="tabControl-item">
						<view class="dateShow" @tap="selectedTemplet(2)" id="starTitle">
							<text>{{ dateShow.star.title }}</text>
							<view class="dateSelectIcon"><image :src="picDomain + '/upload/yytApp/my/down.png'" alt="" class="toTopPic" /></view>
						</view>
					</view>
					<view class="tabControl-item">
						<view class="toLeft" @tap="getPreMonth"><image :src="picDomain + '/upload/yytApp/my/left.png'" alt="" class="toLeftPic" /></view>
						<picker
							class="toCenter"
							mode="date"
							:value="searchObj.month"
							fields="month"
							:start="searchObj.beginTime"
							:end="searchObj.endTime"
							@change="chooseDate"
						>
							<view class="toCenter-conter">
								<text>{{ searchObj.month }}</text>
								<!-- <image :src="picDomain + '/upload/yytApp/images/datePic.png'" alt="" class="dateSelectPic" /> -->
							</view>
						</picker>
						<view class="toRight" @tap="getNextMonth"><image :src="picDomain + '/upload/yytApp/my/right.png'" alt="" class="toRightPic" /></view>
					</view>
				</view>
				<!-- 筛选项 -->
				<view class="search-list">
					<!-- 回复状态 -->
					<view class="state" v-show="replyTitleModal">
						<view class="" v-for="item in replyList" :key="item.value">
							<view @tap="selectReplyTitle(item.value)" class="search-list-item" :class="{ isSel: replyIndex == item.value }">
								{{ item.text }}
							</view>
						</view>
					</view>
					<!-- 评价等级 -->
					<view class="star" v-show="starScoreModal">
						<view class="" v-for="item in starlist" :key="item.value">
							<view @tap="selectStarScore(item.value)" class="search-list-item" :class="{ isSel: scoreIndex == item.value }">
								{{ item.text }}
							</view>
						</view>
					</view>
				</view>
				<view class="mengban" @tap="closeMengBan" v-show="starScoreModal || replyTitleModal"></view>
				<view class="searchComment-Info">
					<view class="searchComment-Info-t">
						<view class="headline">
							<text>客户评价</text>
							<text class="multipleScore_num">{{ rowCount }}</text>
							<text class="multipleScore_text">条</text>
						</view>
						<view class="multipleScore">
							<text>综合评分</text>
							<text v-if="score">
								<text class="multipleScore_num">{{ score }}</text>
								<text>分</text>
							</text>
							<text class="multipleScore_num" v-else>暂无评分</text>
						</view>
					</view>
					<view class="searchComment-Info-b">
						<view class="searchComment-item" v-for="(commentData, index) in commentInfo" :key="index">
							<view class="searchComment-item-t">
								<view class="searchComment-item-t-l">
									<image :src="commentData.headImg || 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'" alt="" class="customerpersonPic" />
								</view>
								<view class="searchComment-item-t-r">
									<view class="">
										<view class="customerInfo">
											<text class="customerName">{{ commentData.nickName }}</text>
											<!-- <view class="gradeScore" v-for="n in commentData.score" :key="n"><text class="start_on">&#9733;</text></view>
											<view class="gradeScore" v-for="(n, m) in 5 - commentData.score" :key="n + 10"><text class="start">&#9733;</text></view> -->
											<sx-rate :value="commentData.score" :default-color="'#fff'" :active-color="'#FC4732'" disabled></sx-rate>
										</view>
										<view class="searchComment-item-t-market">
											<text class="icon iconfont lines-blue" :class="commentData.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
											<!-- <image class="iconImg" :src="picDomain + '/upload/yytApp/my/jingli.png'" mode=""></image> -->
											<text>{{ commentData.marketerName }}</text>
										</view>
									</view>
									<view class="salesRecodeInfo">
										<text v-show="commentData.createOn">{{ commentData.createOn.substring(0, 10) }}</text>
										<text v-show="commentData.typeName">{{ commentData.typeName }}</text>
										<text v-show="commentData.diningTypeName">{{ commentData.diningTypeName }}</text>
										<text v-show="commentData.tableName">{{ commentData.tableName }}</text>
										<text v-show="commentData.fee">(￥){{ commentData.fee | formatMoney }}</text>

										<!-- <text>{{ commentData.marketerName }}</text> -->
									</view>
								</view>
							</view>
							<view class="searchComment-item-b">
								<view class="searchComment-content">
									<text>{{ commentData.description }}</text>
								</view>
								<view class="searchComment-photos">
									<image
										v-for="(imgs, index) in commentData.img"
										:key="index"
										:src="imgs"
										mode="aspectFill"
										alt=""
										@tap="ImgPreviewImage(commentData.img, index)"
									/>
								</view>
								<view class="searchComment-handle">
									<text class="salseTime">评论时间：{{ commentData.time }}</text>
								</view>
								<view class="userhandle">
									<image class="handleImg" @tap="deleteComment(commentData)" src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png" mode=""></image>
									<view class=" praise">
										<image class="handleImg" :src="picDomain + '/upload/yytApp/my/notzan.png'" mode=""></image>
										<text>{{ commentData.giveLikeNum ? Comment.giveLikeNum : 0 }}</text>
									</view>
									<image class="handleImg" @tap="repleyComment(commentData)" :src="picDomain + '/upload/yytApp/my/reply.png'" mode=""></image>
								</view>
							</view>
							<view class="searchComment-shopReply">
								<view class="title">商家回复</view>
								<view class="content">{{ commentData.reply }}</view>
								<view class="content-tip" v-show="!commentData.reply">请及时回复</view>
							</view>
						</view>
						<view class="no-replay" v-show="rowCount == 0">
							<image class="no-replay-img" :src="picDomain + '/upload/yytApp/my/noreplay.png'" mode=""></image>
							<view class="no-replay-text">暂无内容</view>
						</view>
						<!-- 底部logo -->
					</view>

					<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
				</view>
			</view>
		</view>
		<!-- 删除模板 -->
		<uni-popup ref="popup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="close()"></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
					<text class="popup-mid-text">您确认删除此评价？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="close()">取消</view>
					<view class="confirm" @tap="DeleteCY56()">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 底部回复 -->
		<uni-popup ref="replayPopup" type="bottom" class="bottom-popup" :custom="true" :maskClick="true">
			<view class="replayPopup">
				<view class="popup-top">
					<text>回复{{ replayInfo.nickName }}：</text>
					<text class="btn" v-show="replayInfo.reply.length != 0" @tap="confirmReply(replayInfo)">发送</text>
					<text class="unbtn" v-show="replayInfo.reply.length == 0">发送</text>
				</view>
				<textarea
					class="popup-textarea"
					@blur="StorageRecovery"
					maxlength="200"
					v-model="replayInfo.reply"
					auto-height
					placeholder-style="fontSize:22rpx"
					placeholder="客户已评价,正在等待您的回复哦!"
				></textarea>
				<text class="popup-textarea-text">{{ replayInfo.reply.length }}/200</text>
			</view>
		</uni-popup>
		<!--设置回复模板-->
		<short v-if="replyModal" v-on:close="replyModal = false">
			<text slot="title">回复模板</text>
			<image :src="picDomain + '/upload/yytApp/images/closePic.png'" class="closeBtn" @tap="closeReplyBtn" slot="close" />
			<view slot="content" class="shortContent">
				<view
					class="replyItem"
					v-for="(replyTemplateData, index) in replyTemplateInfo"
					:key="index"
					@tap="selectedReplyItem(replyTemplateData, index)"
				>
					{{ replyTemplateData.replyContent }}
				</view>
			</view>
		</short>
	</view>
</template>

<script>
export { default } from './SearchComment.js';
</script>

<style lang="less" scoped>
@import url('SearchComment.less');
</style>
