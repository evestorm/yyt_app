<template>
	<view v-if="showMask" class="contact-mask" @touchmove.stop.prevent="moveHandle">
		<view class="contact-box">
			<view class="page">
				<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px', width: winWidth + 'px'}">
						<view v-for="(list, key) in lists" :key="key">
							<view v-if="list.data.length">
								<view class="contact-divider" :id="list.id">{{list.letter}}</view>
								<view class="contact-item" v-for="item in list.data" :key="item.key" @tap="chooseItem(item)">
									<uni-icons :type="item.choose ? 'checkbox-filled' : 'circle'" :color="item.choose ? '#007aff' : '#aaa'" size="24"/>
									<text>{{item.name}}&nbsp;&nbsp;{{item.phone}}</text>
								</view>
							</view>
						</view>
				</scroll-view>
				
				<view class="index-bar" :class="touchmove ? 'active' : ''" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd" @touchcancel="touchCancel">
					<text v-for="(list, key) in lists" :key="key" class="index-bar-text" :class="touchmoveIndex == key ? 'active' : ''" :style="{height:itemHeight + 'px', lineHeight:itemHeight + 'px'}">{{list.letter}}</text>
				</view>
				<view class="index-alert" v-if="indexAlert">
					{{lists[touchmoveIndex].letter}}
				</view>
			</view>
			
			<view class="contact-button-groups">
				<button class="contact-button" type="default"  @click="cancel">取消</button>
				<button class="contact-button" type="primary" @click="confirm">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	var alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import pinyin from './pinyin.js';
	
	export default {
		components: {
			uniIcons
		},
		props: {
			mode: {	//	单选single或多选multi模式
				type: String,
				default: "single",
			},
			hashFirst: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				showMask: false,
				lists: [],	// 当前页面显示的列表
				chooseList: [],
				
				touchmove: false,
				indexAlert: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				barHeight: 0,
				titleHeight: 0,
				scrollViewId: "A",
			}
		},
	
		methods: {
			moveHandle() {},
			
			show() {
				uni.hideKeyboard()
				this.showMask = true
				this.winHeight = uni.getSystemInfoSync().windowHeight - 46; // 通讯录列表高度 = 页面高度（不含导航条） - 按钮高度
				this.winWidth = uni.getSystemInfoSync().windowWidth;
				
				if(this.lists.length == 0) { // 只获取一次
					this.getContacts()
				}
				
				// 清除上次选中
				this.lists.forEach(group => { 
					group.data.forEach(one => {
						one.choose = false 
					})
				})
				
				this.chooseList = []
			},
			
			getContacts() {
				let _this = this
				if(this.hashFirst){
					alphabet.unshift("#")
				} else {
					alphabet.push("#")
				}
				// #ifdef APP-PLUS
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
					addressbook.find(["displayName", "phoneNumbers"], function(contacts) {
						 _this.getIndexList(contacts)
					}, function() {
						uni.showToast({
							title: '联系人获取失败',
							duration: 2000
						})
					}, {
						multiple: true
					});
				}, function(e) {
					uni.showToast({
						title: '通讯录对象获取失败:' + e.message,
						duration: 2000
					})
				});
				
				// #endif
				
				// #ifdef H5
				let contacts = JSON.parse(
					'[{"id":1,"rawId":null,"target":0,"displayName":"z朱海","name":null,"nickname":null,"phoneNumbers":[{"id":"1","pref":false,"value":"+86 138 1234 2222","type":"mobile"},{"id":"2","pref":false,"value":"136-1111-2222","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":3,"rawId":null,"target":0,"displayName":" ","name":null,"nickname":null,"phoneNumbers":[{"id":"6","pref":false,"value":"1-800-MY-APPLE","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":4,"rawId":null,"target":0,"displayName":"林二","name":null,"nickname":null,"phoneNumbers":[{"id":"8","pref":false,"value":"137 2222 7777","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":6,"rawId":null,"target":0,"displayName":null,"name":null,"nickname":null,"phoneNumbers":[{"id":"12","pref":false,"value":"186 4444 5555","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":7,"rawId":null,"target":0,"displayName":"  程紫衣","name":null,"nickname":null,"phoneNumbers":[{"id":"14","pref":false,"value":"180 9999 7777","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":8,"rawId":null,"target":0,"displayName":"   ","name":null,"nickname":null,"phoneNumbers":[{"id":"16","pref":false,"value":"181 1115 6666","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":9,"rawId":null,"target":0,"displayName":"翁富翁","name":null,"nickname":null,"phoneNumbers":[{"id":"18","pref":false,"value":"134 6666 8888","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":10,"rawId":null,"target":0,"displayName":"我","name":null,"nickname":null,"phoneNumbers":[{"id":"20","pref":false,"value":"181 8888 8888","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":11,"rawId":null,"target":0,"displayName":"石更硬","name":null,"nickname":null,"phoneNumbers":[{"id":"22","pref":false,"value":"159 5555 5555","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":12,"rawId":null,"target":0,"displayName":"..私教","name":null,"nickname":null,"phoneNumbers":[{"id":"24","pref":false,"value":"131 5555 2222","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":13,"rawId":null,"target":0,"displayName":"!)陈靖南","name":null,"nickname":null,"phoneNumbers":[{"id":"27","pref":false,"value":"139 3333 2222","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":14,"rawId":null,"target":0,"displayName":"翁啊啊啊啊","name":null,"nickname":null,"phoneNumbers":[{"id":"28","pref":false,"value":"138 3333 2222","type":"mobile"}],"emails":null,"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":null,"categories":null,"urls":null}]'
				)
				this.getIndexList(contacts)
				// #endif
				
				
			},
			
			getIndexList(contacts) {
				let unsorted = this.getModel()
				let key = 0
				
				contacts.forEach(contact => {
					let firstChar = ''
					contact.displayName = contact.displayName ? contact.displayName.trim() : ""
					if(contact.displayName) { // 如传入空字符串，getCamelFistChar错误地返回Y
						firstChar = pinyin.getCamelFistChar(contact.displayName).toUpperCase() // 如字母开头，将返回字母且保留原大小写;一律改为大写
					}
					let hashIndex = alphabet.indexOf("#")
					let index = alphabet.indexOf(firstChar)
					index = index == -1 ? hashIndex : index
					contact.phoneNumbers.forEach(phoneNumber=>{ // 获取同一联系人下的多个电话号码
						unsorted[index].data.push({name: contact.displayName, phone: phoneNumber.value, choose: false, key: key})
						key ++
					})
				})
				// 只保留有数据的list
				let sorted = []
				unsorted.forEach(item=>{
					if(item.data.length > 0) {
						// 按姓名拼音排序
						item.data.sort((a, b)=> a.name.localeCompare(b.name, 'zh')) // name 不能为 null，否则localCompare 将报错
						sorted.push(item)
					}
				})
				this.lists = sorted
				this.itemHeight = this.winHeight / this.lists.length
			},
			
			getModel() {
				let model = []
				alphabet.forEach(letter => {
					model.push({"letter": letter, "data": [], id: letter == "#" ? "hash" : letter})
				})
				return model
			},
			
			confirm() {
				this.chooseList = []
				this.lists.forEach(group => {
					group.data.forEach(one => {
						if(one.choose){
							this.chooseList.push({name: one.name, phone: one.phone})
						}
						
					})
				})
				
				if(this.chooseList.length == 0) {
					uni.showToast({
						icon: "none",
						title: "未选中任何联系人"
					})
				}
				this.$emit('confirm', this.chooseList);
				this.showMask = false
			},
			cancel() {
				this.$emit('cancel')
				this.showMask = false
			},
			chooseItem(item) {
				if(this.mode == "single") {	// 单选模式
					if(item.choose == false) { // 选中
						this.lists.forEach(group => {
							group.data.forEach(one => {
								one.choose = false // 全部设为false
							})
						})
						item.choose = true // 当前项设为true
					} else { // 撤销选中
						item.choose = false
					}
				} else if(this.mode == "multi") {	// 多选模式
					item.choose = !item.choose	// 改变当前点击项
				}
			},
			
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.id;
					this.touchmoveIndex = index;
					this.indexAlert = true
				}
			},
			touchMove(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.id;
					this.touchmoveIndex = index;
					this.indexAlert = true
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.indexAlert = false
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.indexAlert = false
				this.touchmoveIndex = -1;
			}
		}
	}
</script>

<style>
	.contact-mask {
		display: block;
		position: fixed;
		right: 0;
		/* #ifdef H5 */
		top: 42px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		bottom: 0;
		align-items: center;
		width: 100%;
		z-index: 100;
	}

	.contact-box {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.page {
		flex-direction: row;
		display: block;
		position: relative
	}
	
	.scrollList {
		flex: 1;
		height: 100vh;
	}
	
	.contact-divider {
		width: 100%;
		background-color: #F0F0F0;
		padding: 10upx 20upx;
		color: #666;
	}
	
	.contact-item {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding-right: 50upx;
		margin-left: 10upx;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.contact-item text {
		padding-left: 20upx;
		font-size: 30upx;
		line-height: 80upx;
	}
	
	
	.index-bar {
		width: 50upx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
		z-index: 20;
	}
	
	.index-bar-text {
		color: #666;
		font-size: 24upx;
		text-align: center;
	}
	
	
	.index-bar-text.active,
	.index-bar.active .index-bar-text.active {
		color: #007AFF;
	}
	
	.index-alert {
		position: absolute;
		z-index: 20;
		width: 160upx;
		height: 160upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		line-height: 160upx;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.contact-button-groups {
		text-align: center;
		margin-top: 10upx;
	}

	.contact-button {
		display:inline-block ;
		width: 45%;
		margin: 0 10upx;
		font-size: 32upx;
	}

</style>
