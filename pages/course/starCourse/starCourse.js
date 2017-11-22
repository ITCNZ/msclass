// pages/course/starCourse/starCourse.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    courses: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    this.setData({ userInfo: Storage.getStorageSync("mingshi_userInfo") });
    this.getCatalist(this.data.userInfo.userId)
  },

  /**
   * 获取数据
   */
  getCatalist: function (userId) {
    API.Course.getSuperTypeCourse(userId)
      .then((res) => {
        this.setData({ courses: res.bizData });
        UI.navLoading(false);
      });
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({ courses: ''});
    this.getCatalist(this.data.userInfo.userId)
    wx.stopPullDownRefresh()
  }

})