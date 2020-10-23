import storage from '@/common/unistorage/index.js'

import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex'

import CY17 from '@/service/CY/CY17AppService.js'

export default {
	data() {
		return {
			changeImgUrlnotserver: '',
			changeImgUrl: '', // 更换的头像临时地址
			userinfo: {
				headImgUrl: '', // 头像地址 imgUrl
				email: '',
				desc: '', // 签名
			},
		}
	},
	onLoad(option) {
		if (option) {
			this.userinfo.headImgUrl = option.imgUrl
			this.userinfo.email = option.email
			if (this.userinfo.desc != null) {
				this.userinfo.desc = option.desc
			}
		}
	},
	methods: {
		...mapMutations(['setUserInfo']),
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1,
			})
		},
		// 保存个人资料
		async save() {
			const {
				desc,
				email
			} = this.userinfo

			const data = {
				id: storage.getAppUserInfo().marketerId,
				email,
				desc,
			}
			if (this.changeImgUrl != '') {
				data.imgUrl = this.changeImgUrl
			}

			let result = await CY17.UpdateByDto(data)
			//缓存图片
			let userInfo = storage.getAppUserInfo()
			userInfo.email = this.userinfo.email
			userInfo.desc = this.userinfo.desc
			if (this.changeImgUrl != '') {
				userInfo.imgUrl_ImgServer = this.changeImgUrl
			}
			storage.setAppUserInfo(userInfo)
			uni.switchTab({
				url: '/pages/my/my',
			})
		},
		// 实时获取textarea文字
		bindTextAreaBlur(e) {
			this.userinfo.desc = e.detail.value
		},
		// 添加图片
		addPhoto() {
			this.$refs.uploadImg._startChoose()
		},
		// 获取上传后的http图片地址
		getImgUrl(picInfo) {
			console.log(picInfo)
			if (picInfo) {
				this.changeImgUrl = picInfo.url
			}
		},
	},
}
