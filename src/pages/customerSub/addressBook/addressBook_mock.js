import util from '@/common/util.js';
const getContacts = () => {
	let str = {};
	str['13225209318'] = '徐女士';
	for(let i = 0; i < 3500; i++) {
		str[util.getRandomMoble()] = util.getRandomName()
	}
	return str;
}

export default {
    getContacts,
}

