// pages/usercenter/mustCourse/courseDetail/courseDetail.js
var API = require('../../../../api/api');
var { Storage, Filter, UI } = require('../../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mustData: {
      userId: '',
      planId: '', 
      pageIndex: 1, 
      pageSize: 10
    },
    mustCourse: [],
    loadingMore: true,
    learncount: 0,
    weekcount: 0,
    pageIndex: 1,
    totalPages: '' // 总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    wx.setNavigationBarTitle({
      title: options.plantit
    })
    let Info = Storage.getStorageSync("mingshi_userInfo");
    this.setData({
      'mustData.userId': Info.userId,
      'mustData.planId': options.id
    })
    this.getMustCourse();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 分页列表
   */
  getMustCourse: function () {
    API.Course.getCoursePlanDetail(this.data.mustData)
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          loadingMore: false,
          totalPages: res.bizData.total,
          mustCourse: this.data.mustCourse.concat(res.bizData.rows),
          learncount: res.bizData.conditions.learncount,
          weekcount: res.bizData.conditions.weekcount
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
