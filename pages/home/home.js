// pages/home/home.js
var API = require('../../api/api');
var { Storage, Filter, UI } = require('../../utils/util');

Page({
  data: {
    buyCourse: '', // 已购课程
    compulsoryCourse: [],
    mustData: {
      "userId": '',
      "pageIndex": 1,
      "pageSize": 5
    },
    pageIndex: 1,
    totalPages: '', // 总页数
    loadingMore: true, //是否正在加载更多
    userInfo: ''
  },
  onLoad: function () {
    let Info = Storage.getStorageSync("mingshi_userInfo");
    if (Info) this.setData({ userInfo: Info });
    UI.navLoading(true);
    this.buyCourse(this.data.userInfo.userId)
  },

  /**
   * 推荐课程
   */
  buyCourse: function (userId) {
    API.Course.getRecommendCourse(userId)
      .then((res) => {
        this.setData({ buyCourse: res.bizData });
      })
      .then((res) => {
        if (this.data.userInfo) {
          this.setData({ 'mustData.userId': this.data.userInfo.userId });
          this.getCourse();
        } else {
          UI.navLoading(false);
        }
      })
  },

  /**
   * 必修课数据
   */
  getCourse: function () {
    API.Course.getMyCoursePlanByWeek(this.data.mustData)
      .then((res) => {
        this.setData({
          loadingMore: false,
          compulsoryCourse: this.data.compulsoryCourse.concat(res.bizData.rows),
          totalPages: res.bizData.total
        });

        UI.navLoading(false);
      });
  },

  /**
   * 我的必修课
   */
  mustCourseFn: function () {
    if (this.data.userInfo) { // 我的必修课
      wx.navigateTo({
        url: "/pages/usercenter/mustCourse/courseList/courseList"
      })
    } else { // 去登陆
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
    }
  },

  /**
   * 必修课提示Tips
   */
  tipsInfo: function () {
    UI.alert("园所的教学管理者添加园所必修课并和您关联后，会同步显示您本周要学习的必修课。")
  },

  /**
   * 上拉加载
   */
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'mustData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    if (this.data.userInfo) {
      this.getCourse();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    console.log('dsdfvdsdfds')
    UI.navLoading(true);
    this.setData({
      pageIndex: 1,
      'mustData.pageIndex': 1,
      compulsoryCourse: [],
      buyCourse: ''
    });
    this.buyCourse(this.data.mustData.userId);
    wx.stopPullDownRefresh();
  }

})
