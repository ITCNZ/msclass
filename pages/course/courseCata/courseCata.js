// pages/course/courseCata/courseCata.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseCatalog: '',
    userId: '',
    loadingMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    let Info = Storage.getStorageSync("mingshi_userInfo");
    if (Info) this.setData({ userInfo: Info, userId: Info.userId });
    this.getCourseCatalog();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCourseCatalog()
  },

  /**
   * 课程分类
   */
  getCourseCatalog: function () {
    API.Course.getCourseCatalog(this.data.userId)
      .then((res) => {
        this.setData({ 
          courseCatalog: res.bizData,
          loadingMore: false
        });
        UI.navLoading(false);
      })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      courseCatalog: '',
      loadingMore: true
    });
    this.getCourseCatalog()
    wx.stopPullDownRefresh();
  }

})