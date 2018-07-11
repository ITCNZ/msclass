// pages/course/allCourse/allCourse.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData: {// 分页接口参数
      typeId: '', 
      grade: '', 
      shapeId: '', 
      pageIndex: 1, 
      pageSize: 10
    },
    navData: { // 类型接口参数
      userId: '',
      typeId: ''
    },
    courseType: { // 类型数据
      courseName: '',
      rootId: '',
      courseCata: [{ name: '全部', id: ''}],
      grade: ['', '小班', '中班', '大班', '混龄'],
      courseShape: [{ courseShape: '全部', id: ''}]
    },
    coursesDb: [], // 分页数据
    pageIndex: 1,
    totalRecord: 1,// 总数据数
    loadingMore: true, //是否正在加载更多
    loadingNav: true,
    currentCata: '',
    currentGrade: '',
    currentShape: '',
    totalPages: '',
    isIos: false, // 是否为苹果
    isbuy: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Info = Storage.getStorageSync("mingshi_userInfo");
    if (Info) this.setData({ 'navData.userId': Info.userId });
    this.setData({
      'courseData.typeId': options.id,
      'navData.typeId': options.id,
      'courseType.courseName': options.typename,
      'courseType.rootId': options.rootid
    })
    UI.navLoading(true);
    this.getNav();
    this.getCourse();
  },

  /**
   * 用以判断是否IOS
   */
  isIosBottom: function() {
    app.globalData.systemInfo.system.indexOf('iOS') > -1 && this.data.totalRecord > 6 ? this.setData({ isIos: true }) : this.setData({ isIos: false });
  },

  /**
   * 获取分类信息
   */
  getNav: function () {
    API.Course.getCourseTypeSearchInfo(this.data.navData)
      .then((res) => {
        this.setData({
          'courseType.courseCata': this.data.courseType.courseCata.concat(res.bizData.secondCourseTypeList),
          'courseType.courseShape': this.data.courseType.courseShape.concat(res.bizData.courseShapeList),
          loadingNav: false,
          isbuy: res.bizData.isbuy
        });
      });
  },

  /**
   * 获取分页列表
   */
  getCourse: function () {
    API.Course.getCoursePageByTypeId(this.data.courseData)
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          loadingMore: false,
          totalRecord: res.bizData.records,
          totalPages: res.bizData.total,
          coursesDb: this.data.coursesDb.concat(res.bizData.rows)
        });
        this.isIosBottom();
      });
  },

  /**
   * 点击获取数据
   */
  clickCourse: function(e) {
    if (e.target.dataset.gradeid != null) {
      var gradeid = e.target.dataset.gradeid;
      this.setData({ 'courseData.grade': gradeid, currentGrade: gradeid})
    } else if (e.target.dataset.shapeid != null) {
      var shapeid = e.target.dataset.shapeid;
      this.setData({ 'courseData.shapeId': shapeid, currentShape: shapeid})
    } else {
      e.target.dataset.typeid ? this.setData({ 'courseData.typeId': e.target.dataset.typeid, currentCata: e.target.dataset.typeid }) : this.setData({ 'courseData.typeId': this.data.navData.typeId, currentCata: '' })
    }
    
    this.setData({ 
      coursesDb: [],
      loadingMore: true,
      pageIndex: 1,
      'courseData.pageIndex': 1,
      totalPages: ''
    });
    this.getCourse();
  },

  /**
   * 点击列表跳转
   */
  goDetail: function(info) {
    let courseId = info.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../../course/courseDetail/courseDetail?id=' + courseId
    })
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
      'courseType.courseCata': [{ name: '全部', id: '' }],
      'courseType.courseShape': [{ courseShape: '全部', id: '' }],
      coursesDb: [],
      pageIndex: 1,
      'courseData.pageIndex': 1,
      loadingNav: true,
      loadingMore: true
    });
    this.getNav();
    this.getCourse();
    wx.stopPullDownRefresh()
  }

})
