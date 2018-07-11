// pages/usercenter/mustCourse/courseList/courseList.js
var API = require('../../../../api/api');
var { Storage, Filter, UI } = require('../../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mustData: {
      userId: '', 
      pageIndex: 1, 
      pageSize: 10
    },
    mustCourse: [],
    loadingMore: true,
    pageIndex: 1,
    totalPages: '' // 总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    let Info = Storage.getStorageSync("mingshi_userInfo");
    this.setData({
      'mustData.userId': Info.userId
    })
    this.getMustCourse();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 分页列表
   */
  getMustCourse: function () {
    API.Course.getCoursePlanListByUserId(this.data.mustData)
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          loadingMore: false,
          mustCourse: this.data.mustCourse.concat(res.bizData.rows),
          totalPages: res.bizData.total
        });
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'mustData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getMustCourse();
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      mustCourse: [],
      'mustData.pageIndex': 1,
      loadingMore: true
    });
    this.getMustCourse();
    wx.stopPullDownRefresh()
  }

})