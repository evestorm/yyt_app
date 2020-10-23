// 作者:杨亮

//------------------------------mock数据引入---------------------------
import yytUploadImg from './yyt-upload-img_mock.js';

// 用一张特殊的图片来检测当前浏览器是否对带 EXIF 信息的图片进行回正
// 方法来源: https://github.com/blueimp/JavaScript-Load-Image
// 一张 2x1 的 JPEG 图片, EXIF Orientation: 6
const testAutoOrientationImageURL =
    'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
    'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
    'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
    'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/x' +
    'ABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAA' +
    'AAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==';
let isImageAutomaticRotation;

export default {
	name: 'yyt-upload-img',
	// 注册属性
	props: {
		// 图片最大Size(兆M)
		maxSize: {
			type: Number,
			default: 9,
			required: false
		},
		// 图片最大宽度(px)
		maxWidth: {
			type: Number,
			default: uni.upx2px(500),
			required: false,
		},
		getImgUrl: {
			type: Function,
			default: function() {},
			// required: true
		}
	},
	created() {},
	data() {
		return {
			// 图片信息
			picInfo: {
				imgSize: '', // 图片大小M
				picName: '', // 图片名称
				url: '', // 图片地址
			},
			isNeedFix: null, // iOS版本是否大于13.4
		};
	},
	methods: {
		// 开始选择图片
		async _startChoose() {
			// 选择图片
			let [error, imgRes] = await uni.chooseImage({
				count: 1,
			});

			// 验证大小
			let size = imgRes.tempFiles[0].size;
			if (size / 1024000 > this.maxSize) {
				this.$cw.showError(`图片不能大于${this.maxSize}M`);
				return;
			}

			//文件路径
			let filePath = imgRes.tempFiles[0].name;
			// 临时文件列表
			const tempFilePaths = imgRes.tempFiles;
			// 获取最后一个.的位置
			let index = filePath.lastIndexOf('.');
			// 文件大小
			this.picInfo.imgSize = (tempFilePaths[0].size / 1048576).toFixed(2);
			this.picInfo.picName = tempFilePaths[0].name; //上传人文件描述 名字
			//获取后缀
			let ext = filePath.substr(index + 1);
			if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].indexOf(ext) == -1) {
				uni.showToast({
					title: '图片格式不正确',
					icon: 'none',
				});
				return;
			}

			let baseStr = await this.uploadImg({
				url: imgRes.tempFiles[0].path,
			});
			console.log({
				baseStr
			});
			if (baseStr) {
				let [error2, res] = await uni.uploadFile({
					url: getApp().globalData.PicDomain,
					fileType: 'image',
					filePath: baseStr,
					name: 'file',
				});
				let fileData = JSON.parse(res.data);
				this.picInfo.url = `${getApp().globalData.PicDomain}${fileData.path}`;
				// 通知已拿到数据
				this.$emit('getImgUrl', this.picInfo);
			} else {
				this.$cw.showError('上传失败，请重试');
				this.$emit('getImgUrl', null);
			}
		},
		// 图片上传
		async uploadImg(opt) {
			let maxWidth = uni.upx2px(this.maxWidth);
			opt = opt || {};
			opt.url = opt.url || '';
			let Orientation = 1;
			//获取图片META信息  
			let res = await this.getImageTag(opt.url, 'Orientation', function(e) {
				console.log(e);
				if (e != undefined) Orientation = e;
			});
			var img = null;
			var canvas = null;
			let obj = await this.loadingImage(opt.url);
			if (obj) {
				img = obj.img;
				canvas = obj.canvas;
				
				// 检查iOS版本是否会自动旋转照片
				let isNeedFix = await this.detectImageAutomaticRotation2();

				console.log(Orientation);
				let baseStr = '';
				//如果方向角不为1，都需要进行旋转
				switch (Orientation) {
					case 6: //需要顺时针（向右）90度旋转
						if (isNeedFix) {
						// if (this.isNeedFix) { // ios13.4+不需要旋转
							baseStr = this.rotateImg(img, '', canvas);
						} else { // ios13.4- 需要
							console.log('（向右）90度旋转');
							baseStr = this.rotateImg(img, 'right', canvas);
						}
						break;
					case 8: //需要逆时针（向左）90度旋转  
						console.log('向左）90度旋转');
						baseStr = this.rotateImg(img, 'left', canvas);
						break;
					case 3: //需要180度旋转 转两次  
						console.log('需要180度旋转');
						baseStr = this.rotateImg(img, 'right', canvas, 2);
						break;
					default:
						baseStr = this.rotateImg(img, '', canvas);
						break;
				}
				return baseStr;
			} else {
				return null;
			}
		},
		/**
		 * @description 加载图片
		 * @param {Object} imgSrc 图片地址
		 */
		async loadingImage(imgSrc) {
			if (!imgSrc) return 0;
			let [err, res] = await uni.getImageInfo({
				src: imgSrc,
			});
			return new Promise((resolve, reject) => {
				if (res) {
					let img = new Image();
					img.style.opacity = 1;
					img.style.backgroundColor = "#FFFFFF";
					img.src = res.path;
					img.width = res.width;
					img.height = res.height;

					img.onload = function() {
						let canvas = document.createElement('canvas');
						let obj = new Object();
						obj.img = img;
						obj.canvas = canvas;
						resolve(obj);
					}
				} else {
					that.$cw.showError('加载图片失败，请重试！');
					reject(null);
				}
			});
		},
		/**  
		 * @desc 获取图片信息，使用exif.js库，具体用法请在github中搜索  
		 * @param {Object} file 上传的图片文件  
		 * @param {String} tag 需要获取的信息 例如：'Orientation'旋转信息  
		 * @return {Promise<Any>} 读取是个异步操作，返回指定的图片信息  
		 */
		async getImageTag(file, tag, cb) {
			if (!file) return 0;
			let that = this;
			return new Promise((resolve, reject) => {
				let imgObj = new Image()
				imgObj.src = file;

				uni.getImageInfo({
					src: file,
					success(res) {
						console.log({
							res
						});
						// ------------------- 判断ios系统版本是否大于 iOS13.4+ ----------------
						// that.isNeedFix = that.detectImageAutomaticRotation(file, this);
						// ------------------- 判断ios系统版本是否大于 iOS13.4+ ----------------
						
						EXIF.getData(imgObj, function() {
							console.log(this);
							EXIF.getAllTags(this);
							let or = EXIF.getTag(this, 'Orientation'); //这个Orientation 就是我们判断需不需要旋转的值了，有1、3、6、8  
							resolve(cb(or));
						});
					},
					fail(e) {
						that.$cw.showError('加载图片失败，请换张图片重试！');
						reject(null);
					}
				})
			});
		},
		//网上提供的旋转function  
		rotateImg(img, direction, canvas, times = 1) {
			console.log('开始旋转')
			//最小与最大旋转方向，图片旋转4次后回到原方向    
			var min_step = 0;
			var max_step = 3;
			if (img == null) return;
			//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
			var height = img.height;
			var width = img.width;
			// debugger
			let maxWidth = this.maxWidth;
			let canvasWidth = width; //图片原始长宽  
			let canvasHeight = height;
			let base = canvasWidth / canvasHeight;
			if (canvasWidth > maxWidth) {
				canvasWidth = maxWidth;
				canvasHeight = Math.floor(canvasWidth / base);
			}
			width = canvasWidth;
			height = canvasHeight;
			var step = 0;

			if (step == null) {
				step = min_step;
			}

			if (direction == 'right') {
				step += times;
				//旋转到原位置，即超过最大值    
				step > max_step && (step = min_step);
			} else if (direction == 'left') {
				step -= times;
				step < min_step && (step = max_step);
			} else { //不旋转  
				step = 0;
			}

			//旋转角度以弧度值为参数    
			var degree = step * 90 * Math.PI / 180;
			var ctx = canvas.getContext('2d');
			// 在canvas绘制前填充白色背景
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, this.maxWidth, this.maxWidth);

			console.log(degree)
			console.log(step)
			switch (step) {
				case 1:
					console.log('右旋转 90度')
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, 0, -height, width, height);
					break;
				case 2:
					console.log('旋转 180度')
					canvas.width = width;
					canvas.height = height;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, -height, width, height);
					break;
				case 3:
					console.log('左旋转 90度')
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, 0, width, height);
					break;
				default: //不旋转  
					canvas.width = width;
					canvas.height = height;
					console.log({
						ctx,
						canvas
					});
					ctx.drawImage(img, 0, 0, width, height);
					break;
			}

			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imgData.data;
			for (var i = 0; i < data.length; i += 4) {
				if (data[i + 3] < 255) {
					data[i] = 255 - data[i];
					data[i + 1] = 255 - data[i + 1];
					data[i + 2] = 255 - data[i + 2];
					data[i + 3] = 255 - data[i + 3];
				}
			}
			ctx.putImageData(imgData, 0, 0);

			let baseStr = canvas.toDataURL("image/png", 1);
			return baseStr;
		},
		// 判断是IOS13.4以上的系统 13.4以上返回true
		/**
		 * @param {Object} file 文件资源
		 */
		detectImageAutomaticRotation(file) {
			let u = navigator.userAgent,
				app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
			var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if (isIOS) {
				let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				let ver1 = parseInt(ver[1])
				let ver2 = parseInt(ver[2])
				if (ver1 >= 13 && ver2 >= 4) {
					// if (file.name == 'image.jpg') { //判断是拍照上传的还是相册选取的，IOS拍完照还没有确定的时候，图片的名字统一都是image.jpg
					// 	return true
					// }
					return true
				} else {
					return false
				}
			} else {
				return false;
			}
		},
		/**
		 * 判断图片是否会自动旋转
		 */
		detectImageAutomaticRotation2() {
			return new Promise((resolve) => {
			    if (isImageAutomaticRotation === undefined) {
			      const img = new Image();
			
			      img.onload = () => {
			        // 如果图片变成 1x2，说明浏览器对图片进行了回正
			        isImageAutomaticRotation = img.width === 1 && img.height === 2;
			
			        resolve(isImageAutomaticRotation);
			      };
			
			      img.src = testAutoOrientationImageURL;
			    } else {
			      resolve(isImageAutomaticRotation);
			    }
			  });
		}
	},
	computed: {},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {
		//        }
		//    }
		// }
	},
};
