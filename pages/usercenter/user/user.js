var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({
  data: {
    userInfo: '',
    studyTime: '',
    redCircle1: true,
    redCircle2: true
  },

  onLoad: function (options) {
    let Info = Storage.getStorageSync("mingshi_userInfo");
    if (Info) {
      this.setData({ userInfo: Info });
      UI.navLoading(true);
    }
    this.getInfo();
  },
  
  onShow: function () {
    console.log('onShow....')
    if (Storage.getStorageSync("redCircle1")) this.setData({ redCircle1: false });
    if (Storage.getStorageSync("redCircle2")) this.setData({ redCircle2: false });
  },
  
  /**
   * 获取用户数据
   */
  getInfo: function() {
    if (!this.data.userInfo) return;
    API.User.getMylearnCourseInfo(this.data.userInfo.userId)
      .then((res) => {
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
      studyTime: ''
    })
    this.getInfo();
    wx.stopPullDownRefresh()
  },

  /**
   * 去登陆
   */

  loginFn: function(e) {
    let typeId = e.currentTarget.dataset.typeid;
    if (!this.data.userInfo) {
      wx.navigateTo({ url: '../../auth/login/login' })
    } else {
      if (typeId == 1) { // 点击头像
        wx.navigateTo({ url: '../userInfo/userInfo' });
      } else { // 点击我的收藏
        wx.navigateTo({ url: '../myCollect/myCollect' });
      }
    }
  },


  /**
   * 历史\排名课程跳转
   */
  goHistory: function (e) {
    let status = e.currentTarget.dataset.status;
    if (status == 1) {
      wx.navigateTo({ url: '/pages/usercenter/historyCourse/historyCourse' });
      Storage.setStorageSync("redCircle1", true);
    } else {
      wx.navigateTo({ url: '/pages/usercenter/myrank/myrank' });
      Storage.setStorageSync("redCircle2", true);
    }
  }

})
