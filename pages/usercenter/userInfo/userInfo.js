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
  getInfo: function () {
    API.User.getMylearnCourseInfo(this.data.userInfo.userId)
      .then((res) => {
        res.bizData.totalTimes = Filter.f_studyTime(res.bizData.totalTimes)
        this.setData({ studyTime: res.bizData });
        UI.navLoading(false);
      })
  },

  /**
   * 退出登录
   */
  logout: function () {
    wx.removeStorageSync('mingshi_token');
    wx.removeStorageSync('mingshi_devtag');
    wx.removeStorageSync('mingshi_userInfo');
    wx.removeStorageSync('myrank');
    wx.removeStorageSync("redCircle1");
    wx.removeStorageSync("redCircle2");
    wx.reLaunch({
      url: '/pages/usercenter/user/user'
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