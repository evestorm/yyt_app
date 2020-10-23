import app from '@/common/request.js'

// 获取客户等级信息
var GetViewPage = async (data, success, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY24/getViewPage',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

// 获取客户等级筛选
var GetMembershipLevelScreening = async (data, success, isShowLoading = true) => {
  var self = this;
  return await app.Request({
    url: '/api/services/app/CY24/GetMembershipLevelScreening',
    data: data,
    isObj: true,
    isShowLoading: isShowLoading,
    abpSuccess: success
  });
};

export default {
  GetViewPage,
  GetMembershipLevelScreening
};
