<template>
	<view class="body-view">
		<view class="uploads">
			<!-- 图片上传 -->
			<view class="upload-image-view">
				<!-- 标题已经省略 -->
				<!-- <view class='title'>上传xxxx图片</view> -->
				<block v-for="(image, index) in imageList" :key="index">
					<view class="image-view">
						<image :src="image" :data-src="image" @tap="previewImage" mode="aspectFill"></image>
						<view class="del-btn" :data-index="index" @tap="deleteImage"><view class="baicha"></view></view>
					</view>
				</block>
				<view class="add-view" v-if="imageList.length < imageLength" @tap="addPhoto">
					<!--style="{backgroundImage:'../../static/sfz.jpg'}"-->
					<view class="xiangji">
						<view class="tixing"></view>
						<view class="changfx">
							<view class="yuan1"><view class="yuan2"></view></view>
						</view>
					</view>
					<yyt-upload-img ref="uploadImg" @getImgUrl="getImgUrl"></yyt-upload-img>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var sourceType = [
	['camera'], //拍照
	['album'], //相册
	['camera', 'album'] //拍照或相册
];
var sizeType = [
	['compressed'], //压缩
	['original'], //原图
	['compressed', 'original'] //压缩或原图
];
export default {
	// props:["bgImg"],
	data() {
		return {
			imageList: [], //保存图片路径集合
			imageLength: 3, //限制图片张数
			sourceTypeIndex: 2, //添加方式限制
			sizeTypeIndex: 2 //图片尺寸限制
		};
	},
	onUnload() {},
	methods: {
		//选择图片
		// chooseImage: async function() {
		// 	uni.chooseImage({
		// 			sourceType: sourceType[this.sourceTypeIndex],
		// 			// #ifdef MP-WEIXIN
		// 			sizeType: sizeType[this.sizeTypeIndex],
		// 			// #endif
		// 			count: this.imageLength - this.imageList.length,
		// 			success: (res) => {
		// 				this.imageList = this.imageList.concat(res.tempFilePaths);
		// 				this.$emit("loadImagesrc",this.imageList)
		// 			}
		// 		})
		// },
		//选择图片
		// 添加图片
		addPhoto() {
			this.$refs.uploadImg._startChoose();
		},
		// 获取上传后的http图片地址
		getImgUrl(picInfo) {
			if (picInfo) {
				let changeImgUrl = picInfo.url;
				this.imageList.push(changeImgUrl);
				this.$emit('loadImagesrc', this.imageList);
			}
		},
		//预览图片
		previewImage: function(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList,
				indicator: 'default'
			});
		},
		//删除图片
		deleteImage: function(e) {
			var index = e.currentTarget.dataset.index || e.target.dataset.index;
			var that = this;
			var images = that.imageList;
			images.splice(index, 1);
			that.imageList = images;
			this.$emit('loadImagesrc', this.imageList);
		}
	}
};
</script>

<style>
@import './yyt-loadimg.css';

page {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
	background-color: #ffffff;
}

.body-view {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
}

.uploads {
	width: 92%;
}
</style>
