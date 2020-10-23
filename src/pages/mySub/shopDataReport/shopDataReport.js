// 作者:杨亮

//------------------------------mock数据引入---------------------------
import shopDataReportMock from './shopDataReport_mock.js';

//------------------------------组件引入-------------------------------


//-------------------------Service引入----------------------------------
import CY17 from '@/service/CY/CY17AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入


// 常量
let PageConstData = {
    // 缓存数据
    //cacheData: {
    //    userInfo: storage.getUserInfo()
    //},
    // 页面常量
}

export default {
    // 组件放在data前面
    components: {
        
    },
    // 职责: 程序中需要进行set的数据 (尽量少去定义data里面的属性 多用computed或者组件进行处理)
    data() {
        return {
            //---------------------常量------------------------
            PageConstData,

            //---------------------接口输入输出 接口名称+in/out 命名 列如接口名称是getStudentList----------------------
            //getStudentListIn: {
            //    pageIndex: 1, // 第几页
            //    pageSize: 5, // 每页多少条
            //    sarchValue: '', // 查询条件  目前是根据学生姓名和班级姓名查找
            //    isAppend: true // 控制是滚动底部刷新 还是上拉加载
            //},
            //// 列表数据参数 对应 demoIndexMock.getStudentListOut
            //getStudentListOut: {
            //    dataList: [], // 返回的data数据
            //    pageCount: 0, // 多少页
            //    rowCount: 0 // 总共多少数据
            //},

            // --------------------------------------页面参数---------------------------
            urlOption: {}, // url参数
        };
    },
    // 页面加载事件
    async onLoad(options) {
        this.urlOption = options;
    },
    // 页面显示事件
    onShow() {
    },
    // 页面触底事件
    onReachBottom() {
    },
    // 页面下拉事件
    onPullDownRefresh() {
    },
    // 职责:页面事件进行交互
    methods: {
        // 测试ajax发送
        async testAjax() {
            const data = {
                pageIndex: 1,
                pageSize: 10,
                order: 'StoreID desc'
            };

            let result = await CY17AppService.GetViewPage(data);
        }
    },
    // 职责:不要set的data 统一用computed实现(能用computed实现的尽量用他实现 不要用data和method处理)
    computed: {
        // 查询条件变化用于监控 命名方式以 calc加data的接口in
        //calcGetStudentListIn() {
        //    return this._.cloneDeep(this.getStudentListIn);
        //},
        // 接口返回值处理 calc加data的接口out
        //calcGetStudentListOut() {
        //    let dataList = this._.cloneDeep(this.getStudentListOut.dataList);
        //    dataList.forEach((item, index) => {
        //        // 有初始化选中的Id 那么选中
        //        if (this.selctId == item.id) {
        //            this.$set(item, 'selected', true);
        //        } else {
        //            // 设置属性需要通过这种方式设置 如之前没有绑定这个属性 需要这种方式设置 不然没办法双向绑定  其他设置为false
        //            this.$set(item, 'selected', false);
        //        }
        //    });

        //    // 尽量用lodash链式语法进行数据处理
        //    const page = 1; // 第几页
        //    const limit = 5; // 每页多少条
        //    const dealList = this._(dataList).chain()
        //        .drop((page - 1) * limit) // 跳过前面数据
        //        .take(limit) // 取几个
        //        .filter(x => x.age <= 10) // 过滤
        //        .map(x => ({
        //            stuName: x.stuName,
        //            age: x.age
        //        })) // 映射数据
        //        .orderBy(['stuName', 'age'], ['desc', 'asc']) // 排序
        //        .uniqBy(x => x.stuName) // 去重
        //        .value();

        //    return dealList;
        //},
    },
    // 职责:格式化数据
    filters: {
        // parseScene(value) {
        // return value+'123';
        // }
    },
    // 职责:数据变化后需要和接口交互
    watch: {
        // 监控查询条件的变化 自动请求数据
        //'calcGetStudentListIn': {
        //    handler(val, oldval) {
        //        if (this.$util.isChgForWatch(val, oldval, ['pageIndex', 'sarchValue'])) {
        //            this.getPageList();
        //        }
        //    },
        //    deep: true,
        //    immediate: true,
        //}
    }
};
