// pages/course/courseList/courseList.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData: {// 体验课程
      "typeId": '',
      "pageIndex": 1,
      "pageSize": 10
    },
    cataName: '',
    coursesDb:[],
    pageIndex: 1,
    totalRecord: 1,// 总数据
    totalPages: '', // 总页数
    loadingMore: true //是否正在加载更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    this.setData({
      'courseData.typeId': options.courseId,
      cataName: options.coursename
    });
    this.getCourse();
  },

  /**
   * 请求数据
   */
  getCourse: function() {
    if (this.data.courseData.typeId == 1) {// 体验课程
      API.Course.getExperiencecourse(this.data.courseData)
        .then((res) => {
          this.setData({
            loadingMore: false,
            totalRecord: res.bizData.records,
            totalPages: res.bizData.total
          });
          UI.navLoading(false);
          res.bizData.rows.forEach((n) => {
            n.duration = Filter.f_min(n.duration)
          })
          this.setData({coursesDb: this.data.coursesDb.concat(res.bizData.rows)});
        });
    } else {// 明星课程

      API.Course.getSuperCourseInfoList(this.data.courseData)
        .then((res) => {
          this.setData({
            loadingMore: false,
            totalRecord: res.bizData.records,
            totalPages: res.bizData.total
          });
          UI.navLoading(false);
          res.bizData.rows.forEach((n) => {
            n.duration = Filter.f_min(n.duration)
          })
          this.setData({coursesDb: this.data.coursesDb.concat(res.bizData.rows)});
        });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex ++;
    this.setData({
      'courseData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getCourse()
  },

  /**
 * 下拉刷新
 */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      pageIndex: 1,
      'courseData.pageIndex': 1,
      coursesDb: []
    });
    this.getCourse();
    wx.stopPullDownRefresh()
  }

})