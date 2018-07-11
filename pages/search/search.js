// pages/search/search.js
var API = require('../../api/api');
var { Storage, UI } = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    keywords: [],
    searchData: {
      key: '',
      pageIndex: 1,
      pageSize: 10,
      userId: ''
    },
    searchList: [],
    nocourse: false,
    loadingMore: false,
    pageIndex: 1,
    totalPages: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Info = Storage.getStorageSync("mingshi_userInfo");
    if (Info) this.setData({ 'searchData.userId': Info.userId });
    UI.navLoading(true);
    this.getSearchKeyWord();
  },

  /**
   * 获取关键词
   */
  getSearchKeyWord: function () {
    API.Course.getSearchKeyWord()
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          keywords: res.bizData
        })
      });
  },

  /**
   * 搜索事件
   */
  getSearchKeyCourseList: function () {
    this.setData({loadingMore: true})
    API.Course.getSearchKeyCourseList(this.data.searchData)
      .then((res) => {
        UI.navLoading(false);
        this.setData({
          searchList: this.data.searchList.concat(res.bizData.rows),
          nocourse: true,
          loadingMore: false,
          totalPages: res.bizData.total
        })
      });
  },
  
  /**
   * 输入框搜索
   */
  searchFn: function(e) {
    UI.navLoading(true);
    this.setData({
      searchList: [],
      pageIndex: 1,
      'searchData.key': e.detail.inputValue,
      'courseData.pageIndex': 1,
      loadingMore: true
    });
    this.getSearchKeyCourseList();
  },

  /**
   * 已有关键词搜索
   */
  keywordFn: function (e) {
    this.setData({
      inputValue: e.currentTarget.dataset.keyword,
      'searchData.key': e.currentTarget.dataset.keyword
    })
    
    this.getSearchKeyCourseList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrollBottom: function () {
    console.log('触底...')
    if (this.data.pageIndex == this.data.totalPages) return;
    this.data.pageIndex++;
    this.setData({
      'searchData.pageIndex': this.data.pageIndex,
      loadingMore: true
    });
    this.getSearchKeyCourseList();
  },
  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    UI.navLoading(true);
    this.setData({
      searchList: [],
      pageIndex: 1,
      'courseData.pageIndex': 1
    });
    this.getSearchKeyCourseList();
    wx.stopPullDownRefresh()
  }


})
