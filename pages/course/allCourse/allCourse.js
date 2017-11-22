// pages/course/allCourse/allCourse.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseType:'',
    courseData: {// 体验课程
      "typeId": '',
      "pageIndex": 1,
      "pageSize": 10
    },
    coursesDb: [],
    pageIndex: 1,
    totalRecord: 1,// 总数据
    loadingMore: true, //是否正在加载更多
    currentItem: '',
    totalPages: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UI.navLoading(true);
    this.getNav();
    this.getCourse();
  },

  getNav: function() {
    API.Course.getAllCourseInfoList()
      .then((res) => {
        this.setData({ courseType: res.bizData });
      });
  },

  /**
   * 获取数据
   */
  getCourse: function () {
    API.Course.getAllCourseDetailInfo(this.data.courseData)
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          loadingMore: false,
          totalRecord: res.bizData.records,
          totalPages: res.bizData.total
        });
        res.bizData.rows.forEach((n) => {
          n.duration = Filter.f_min(n.duration)
        })
        this.setData({ coursesDb: this.data.coursesDb.concat(res.bizData.rows) });
        
      });
  },

  /**
   * 点击获取数据
   */
  clickCourse: function(e) {
    let typeid = e.target.dataset.typeid
    this.setData({ 
      coursesDb: [],
      loadingMore: true,
      pageIndex: 1,
      'courseData.typeId': typeid,
      'courseData.pageIndex': 1,
      currentItem: typeid,
      totalPages: ''
    });
    this.getCourse();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrollBottom: function () {
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'courseData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getCourse();
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      coursesDb: [],
      pageIndex: 1,
      'courseData.pageIndex': 1
    });
    this.getNav();
    this.getCourse();
    wx.stopPullDownRefresh()
  }

})
