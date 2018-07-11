// pages/usercenter/myrank/myrank.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips: true,
    userInfo: '',
    loadingMore: true,
    myRank: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Info = Storage.getStorageSync("mingshi_userInfo");
    let rankStatus = Storage.getStorageSync("myrank");
    if (rankStatus) this.setData({ showTips: false });
    if (Info) this.setData({ userInfo: Info });
    UI.navLoading(true);
    this.getLearnRank()
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
   * 关闭排名说明框
   */
  closeFn: function() {
    this.setData({
      showTips: false
    })
    Storage.setStorageSync("myrank", 'ok');
  },

  /**
   * 获取排名信息
   */
  getLearnRank: function () {
    API.User.getLearnRank(this.data.userInfo.userId)
      .then((res) => {
        this.setData({ 
          myRank: res.bizData,
          loadingMore: false
        });
        UI.navLoading(false);
      })
  }

})