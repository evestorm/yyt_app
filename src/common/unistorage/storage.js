class StorageCell {
	constructor(data, timeout) {
		this.data = data
		this.timeout = timeout // 超时时间，单位秒
		this.createTime = Date.now() // 创建时间
	}
}

class UniStorage {
	constructor() {}
	get(name) {
		let cachecell = null
		try {
			cachecell = uni.getStorageSync(name)
			if (!cachecell) return null
			const currentTime = Date.now()
			const overTime = (currentTime - cachecell.createTime) / 1000
			// 手动设置了缓存且超时再清除
			if (cachecell.timeout !== 0 && overTime > cachecell.timeout) {
				this.remove(name)
				cachecell.data = null
			}
		} catch (e) {
			console.error('storage get fail', e);
		}
		if (cachecell.data) {
			return cachecell.data;
		} else {
			return null;
		}
	}
	// 默认永久缓存(0)
	set(name, data, timeout = 0) {
		const cachecell = new StorageCell(data, timeout)
		try {
			uni.setStorageSync(name, cachecell)
			return true
		} catch (e) {
			return false
		}
	}
	remove(key) {
		try {
			uni.removeStorageSync(key)
			return true
		} catch (e) {
			return false
		}
	}
	has(key) {
		let value = null
		let self = this
		try {
			const res = uni.getStorageInfoSync()
			return res.keys.includes(key)
		} catch (e) {
			console.err(e)
		}
	}
	clear() {
		try {
			uni.clearStorageSync()
			return true
		} catch (e) {
			return false
		}
	}
}

export default new UniStorage()
