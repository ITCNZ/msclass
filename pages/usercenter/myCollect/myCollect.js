// pages/usercenter/myCollect/myCollect.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingMore: true,
    myCollect: [],
    collectData: {
      pageIndex: 1,
      pageSize: 10
    },
    pageIndex: 1,
    totalPages: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    this.getLearnRank();
  },

  /**
   * 获取排名信息
   */
  getLearnRank: function () {
    API.User.pageMyCollection(this.data.collectData)
      .then((res) => {
        this.setData({
          myCollect: this.data.myCollect.concat(res.bizData.rows),
          loadingMore: false,
          totalPages: res.bizData.total
        });
        UI.navLoading(false);
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrollBottom: function () {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'collectData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getLearnRank();
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      myCollect: [],
      pageIndex: 1,
      'collectData.pageIndex': 1
    });
    this.getLearnRank();
    wx.stopPullDownRefresh()
  }

})
