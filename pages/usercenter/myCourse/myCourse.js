var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp()

Page({
  data: {
    buyCourse: '', // 已购课程
    compulsoryCourse: [],
    mustData: {
      "userId": '',
      "pageIndex": 1,
      "pageSize": 3
    },
    pageIndex: 1,
    totalRecord: 1,// 总数据
    totalPages: '', // 总页数
    loadingMore: true //是否正在加载更多
  },
  onLoad: function () {
    UI.navLoading(true);
    let userInfo = Storage.getStorageSync("mingshi_userInfo");
    this.setData({ 'mustData.userId': userInfo.userId});
    this.buyCourse(userInfo.userId)
  },

  /**
   * 已购课程
   */
  buyCourse: function (userId) {
    API.Course.getbuyCoursePackage(userId)
      .then((res) => {
        this.setData({ buyCourse: res.bizData });
      })
      .then(() => {
        this.getCourse();
      });
  },

  /**
   * 必修课数据
   */
  getCourse: function() {
    API.Course.getMycourseInfo(this.data.mustData)
      .then((res) => {
        res.bizData.rows.forEach((n) => {
          n.duration = Filter.f_min(n.duration)
        })
        this.setData({
          loadingMore: false,
          compulsoryCourse: this.data.compulsoryCourse.concat(res.bizData.rows),
          totalRecord: res.bizData.records,
          totalPages: res.bizData.total
        });
        
        UI.navLoading(false);
      });
  },

  /**
   * 已购课程跳列表
   */
  gocourse: function (id) {
    let courseId = id.currentTarget.dataset.courseid
    if (courseId == 1) { // 体验课程
      wx.navigateTo({
        url: "../../course/courseList/courseList?courseId=1&coursename=体验课程"
      })
    } else if (courseId == 3) { // 明星课程
      wx.navigateTo({
        url: '../../course/starCourse/starCourse'
      })
    } else { // 全员
      wx.navigateTo({
        url: '../../course/allCourse/allCourse'
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
    this.data.pageIndex++;
    this.setData({
      'mustData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getCourse()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
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
