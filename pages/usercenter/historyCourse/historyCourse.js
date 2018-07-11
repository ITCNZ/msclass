// pages/usercenter/historyCourse/historyCourse.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData: {
      pageIndex: 1, 
      pageSize: 5
    },
    historyCourse: [],
    loadingMore: true,
    pageIndex: 1,
    totalPages: '' // 总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    this.getMyLearnHistory();
  },

  /**
   * 播放历史
   */
  getMyLearnHistory: function () {
    API.User.getMyLearnHistory(this.data.historyData)
      .then((res) => {
        this.setData({ 
          historyCourse: this.data.historyCourse.concat(res.bizData.rows),
          loadingMore: false,
          totalPages: res.bizData.total
        });
        UI.navLoading(false);
      })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'historyData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getMyLearnHistory();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      pageIndex: 1,
      'historyData.pageIndex': 1,
      historyCourse: [],
      loadingMore: true
    });
    this.getMyLearnHistory();
    wx.stopPullDownRefresh();
  }

})