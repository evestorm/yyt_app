import util from '@/common/util.js';
const mockCueList = () => [{
	"clueUserName": "李女士",
	"clueUserPhone": "18579402400",
	"clueRemark": "7.24第一次来店看位置，朋友住江夏，介绍的，偏重三楼爱斐堡厅晚上举办",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 14,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-07-24 11:57 邓巧梅新增了线索",
	"name": "婚宴",
	"id": "915889d5-fa56-4120-ee65-08d82f85bb65"
}, {
	"clueUserName": "鄂先生",
	"clueUserPhone": "13517254693",
	"clueRemark": "已来看场地，日期已定，对优惠活动在商量，二楼爱琴海海厅",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 2,
	"clueStatus": 1,
	"clueTableCount": 9,
	"bakTableCount": 1,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-07-22 11:41 邓巧梅新增了线索",
	"name": "十岁宴",
	"id": "4d39edd0-276a-4cae-3557-08d82df113ee"
}, {
	"clueUserName": "朱先生",
	"clueUserPhone": "13554678990",
	"clueRemark": "已第二次来看场地，父母同新郎一起来的，比较意向爱斐堡厅，但是觉得包房联通，不是很好",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 20,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-07-09 17:34 邓巧梅新增了线索",
	"name": "婚宴",
	"id": "6566c771-94a8-47c1-9c65-08d823ea7e8d"
}, {
	"clueUserName": "张先生",
	"clueUserPhone": "15171432398",
	"clueRemark": "到喜啦平台推送，菜品意向1399，对于婚庆价格接受度不高，觉得很贵",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 18,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-07-09 17:32 邓巧梅新增了线索",
	"name": "婚宴",
	"id": "f63304f7-ef04-46a4-9c64-08d823ea7e8d"
}, {
	"clueUserName": "黄贝贝",
	"clueUserPhone": "13638650813",
	"clueRemark": "来店吃饭的时候咨询，自己家宝宝宴",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 2,
	"clueStatus": 1,
	"clueTableCount": 8,
	"bakTableCount": 1,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-07-03 11:52 邓巧梅新增了线索",
	"name": "周岁宴",
	"id": "c6e5ce46-20bb-42ca-6744-08d81f049310"
}, {
	"clueUserName": "卢先生",
	"clueUserPhone": "15623354811",
	"clueRemark": "客人添加微信后，已介绍有关事宜，邀约客人来店看场地，并根据客人要求制定合理方案",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 15,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-06-29 11:01 邓巧梅新增了线索",
	"name": "婚宴",
	"id": "b39c9e79-7ba4-437d-3d7a-08d81b1dc26a"
}, {
	"clueUserName": "李女士",
	"clueUserPhone": "13972168488",
	"clueRemark": "已来看场地，新人对婚礼策划要求比较高",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 10,
	"bakTableCount": 1,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-06-28 12:40 邓巧梅跟进了线索",
	"name": "婚宴",
	"id": "7e8b7582-6122-4542-2af9-08d80864bf6f"
}, {
	"clueUserName": "李先生",
	"clueUserPhone": "15827333849",
	"clueRemark": "男方父母出钱，拿主意的人是新娘，比较钟意爱琴海厅和罗曼园厅，6月4日已看场地，菜单拍回家",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 2,
	"clueStatus": 1,
	"clueTableCount": 15,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-06-04 16:53 邓巧梅跟进了线索",
	"name": "婚宴",
	"id": "21488a06-718f-4fe9-2af8-08d80864bf6f"
}, {
	"clueUserName": "谢女士",
	"clueUserPhone": "13296565120",
	"clueRemark": "婚期改到2021年，今年要定酒店",
	"clueSourceType": 1,
	"marketerID": "SL5116300000041",
	"clueLevel": 2,
	"clueStatus": 1,
	"clueTableCount": 15,
	"bakTableCount": 2,
	"customerID": null,
	"marketerName": "邓巧梅",
	"latestYHClueHistoryLog": "2020-06-01 14:53 王元元跟进了线索",
	"name": "婚宴",
	"id": "685b9da3-8682-484a-1a78-08d7fe1009df"
}, {
	"clueUserName": "邵女士",
	"clueUserPhone": "15107104165",
	"clueRemark": null,
	"clueSourceType": 1,
	"marketerID": "SL0376200000073",
	"clueLevel": 1,
	"clueStatus": 1,
	"clueTableCount": 28,
	"bakTableCount": 0,
	"customerID": null,
	"marketerName": "张双",
	"latestYHClueHistoryLog": "2020-05-22 13:27 王元元跟进了线索",
	"name": "婚宴",
	"id": "1e9d1e92-6b28-4280-1a76-08d7fe1009df"
}]

export {
	mockCueList,
}