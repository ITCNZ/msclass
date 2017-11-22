var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp()

Page({
  data: {
    userInfo: '',
    studyTime: ''
  },

  onLoad: function (options) {
    UI.navLoading(true);
    this.setData({
      userInfo: Storage.getStorageSync("mingshi_userInfo")
    })
    this.getInfo();
  },
  
  /**
   * 获取用户数据
   */
  getInfo: function() {
    API.User.getMylearnCourseInfo(this.data.userInfo.userId)
      .then((res) => {
        res.bizData.totalTimes = Filter.f_studyTime(res.bizData.totalTimes)
        this.setData({ studyTime: res.bizData });
        UI.navLoading(false);
      })
  },

  /**
 * 下拉刷新
 */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      userInfo: Storage.getStorageSync("mingshi_userInfo"),
      studyTime: ''
    })
    this.getInfo();
    wx.stopPullDownRefresh()
  }
  
})