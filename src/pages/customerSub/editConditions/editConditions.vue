<!--作者:覃彬-->
<template>
	<view class="editConditions">
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="编辑条件"
			@clickRight="tapRightFromNav"
			color="#ffffff"
			background-color="#0782ff"
			:fixed="true"
			ref="navbarRef"
		>
			<view slot="right">保存</view>
		</uni-nav-bar>
		<!-- ================================================列表============================================== -->
		<view class="edit-condition-list">
			<view class="selected-list bg-white p-2 pr-5" v-for="(item, index) in selectCondition" :key="index">
				<view class=" d-flex j-sb a-center">
					<view class="condition-title font-weight font-30 ">
						{{ item.selfConditionName || item.conditionName }}
					</view>
					<!-- .title -->
					<image
						@tap="delCondition(index)"
						src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png"
						class="del-img"
						mode=""
					></image>
				</view>
				<view class="" v-for="(field, fIndex) in item.fields" :key="fIndex">
					<view class="list-item font-28 d-flex j-sb a-center">
						<view class="left-key line-h">{{ field.fieldName }}</view>
						<!-- 月份信息 -->
						<view class="right-value text-right line-h" v-if="field.fieldType == 'int'">
							<input
								:value="field.fieldValue"
								type="number"
								:placeholder="`请输入${field.fieldName}数字信息`"
								placeholder-class="place-style"
								@blur="intBlur($event, index, fIndex)"
							/>
						</view>
						<!-- 金额信息 -->
						<view class="right-value text-right line-h" v-if="field.fieldType == 'money'">
							<input
								:value="field.fieldValue"
								type="number"
								:placeholder="`请输入消费金额`"
								placeholder-class="place-style"
								@blur="moneyBlur($event, index, fIndex)"
							/>
						</view>
						<!-- 条件 大于 小于 等于  -->
						<view class="right-value d-flex a-center" v-if="field.fieldType == 'select'">
							<view
								class="btn font-24 text-primary border border-primary py-1 px-3 mr-4 line-h"
								v-for="(e, eqIndex) in field.fieldDefaultValue"
								:class="field.fieldValue == e ? 'bg-primary text-white' : ''"
								@tap="selectEq(index, fIndex, e)"
								:key="eqIndex"
							>
								{{ e }}
							</view>
						</view>
						<!-- 预订类型 -->
						<view class="right-value d-flex a-center" v-if="field.fieldType == 'ajax'">
							<picker
								class="desc"
								:value="field.fieldIndex"
								@change="changeAjaxList($event, index, fIndex)"
								:range="field.fieldList"
								range-key="label"
							>
								<text
									v-if="field.fieldList && field.fieldList.length != 0 && field.fieldLabel"
								>
									{{ field.fieldLabel }}
									<!-- {{ field.fieldList[field.fieldIndex].label }} -->
								</text>
								<text class="text-date" v-if="!field.fieldLabel">
									请选择{{ field.fieldName }}
								</text>
								<image
									src="https://pic.cwyyt.cn/upload/yyticons/181708178_right.png"
									class="ml-3 right-icon"
								></image>
							</picker>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部新增按钮 -->
		<view class="position-fixed bottom-0 left-0 w-100 add-btn bg-white">
			<view
				class="add-condition bg-primary text-white text-center font-30 font-weight py-2 line-h"
				@tap="oepenSelPopup"
			>
				新增条件
			</view>
		</view>
		<!-- ====================================点击新增弹窗 底部弹出选择条件popup========================== -->
		<uni-popup ref="selConditionPopup" type="bottom" class="bottom-popup" :custom="true">
			<view class="wrapper bg-white">
				<view class="popup-title d-flex align-center p-2">
					<image
						@tap="closeSelPopup"
						src="https://pic.cwyyt.cn/upload/yyticons/160321321_arrow-down.png"
						class="img"
						mode=""
					></image>
					<view class="flex-1 text-center font-28 font-weight ">选择条件</view>
				</view>
				<scroll-view scroll-y="true" style="height: calc(100vh - 400rpx);">
					<view class="px-3">
						<view class="popup-list font-28" v-for="(item, conIndex) in pageList" :key="conIndex">
							<view class="group-name font-weight py-1">{{ item.groupName }}</view>
							<view
								class="condition-name px-2 py-3 line-h"
								v-for="(em, eIndex) in item.configs"
								:key="eIndex"
								@tap="selCondition(em)"
							>
								{{ em.conditionName }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script src="./editConditions.js"></script>

<style lang="less" scoped>
@import url('editConditions.less');
</style>
