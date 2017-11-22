// pages/course/courseDetail/courseDetail.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:'',
    courseId: '',
    userId: '',
    learnRecord: {
      'startTime': '',
      'timePoint': '',
      'courseId': ''
    },
    initPoint: 0, // 上次播放位置
    isWifi: false,
    loadMask: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = Storage.getStorageSync("mingshi_userInfo");
    this.setData({ 
      courseId: options.id,
      userId: userInfo.userId,
      'learnRecord.courseId': options.id
    });
    // this.getCourse(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
    this.getCourse(this.data.courseId);
  },

  /**
   * 获取详情数据
   */
  getCourse: function(id) {
    UI.navLoading(true);
    
    //检测网络状态
    wx.getNetworkType({
      success: res => {
        res.networkType == 'wifi' ? this.setData({ isWifi: false }) : this.setData({ isWifi: true });
        API.Course.getPlayCourseDetailInfo(id, this.data.userId)
          .then((res) => {
            let resBiz = res.bizData;
            let skip = resBiz.skipopening ? resBiz.skipopening : 0; // 跳过片头
            let lastTime = resBiz.lastLearnTime; // 上次播放到
            resBiz.duration = Filter.f_min(resBiz.duration);
            resBiz.recommendCourse.forEach(n => {
              n.duration = Filter.f_min(n.duration);
            });
            resBiz.description = resBiz.description.replace(/(^\s*)|(\s*$)/g, "");

            // resBiz.sourceLd = 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400';
            this.setData({ detailData: resBiz});
    
            wx.setNavigationBarTitle({
              title: resBiz.courseName
            })
            UI.navLoading(false);
            lastTime > skip ? this.setData({ initPoint: lastTime }) : this.setData({ initPoint: skip });
            setTimeout(() => {
              console.log('跳过:', this.data.initPoint)
              if (!this.data.isWifi) {
                this.videoContext.play();
                this.videoContext.seek(this.data.initPoint);
              }
            }, 200);
            
          })
          .then(() => {
            this.setData({ loadMask: false });
          }, () => {
            console.log('接口getPlayCourseDetailInfo...')
          })
      }
    })
  },

  /**
   * 点击切换资源
   */
  clickCourse: function(e) {
    let courseid = e.currentTarget.dataset.courseid
    this.learnRecord();
    this.setData({
      courseId: courseid,
      'learnRecord.courseId': courseid,
      loadMask: true
    });
    this.getCourse(courseid);
  },

  /**
   * 实时记录播放时间
   */
  currnetimeFn: function (e) {
    this.setData({ 'learnRecord.timePoint': parseInt(e.detail.currentTime) });
  },

  /**
   * 退出小程序提交记录
   */
  onHide: function () {
    this.learnRecord();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.learnRecord();
  },

  /**
   * 上传播放记录
   */
  learnRecord: function() {
    if (this.data.learnRecord.startTime && this.data.learnRecord.timePoint >= 1) {
      console.log('退出页面了...', this.data.learnRecord)
      API.Course.learnRecord(this.data.learnRecord)
        .then((res) => {
          console.log('learnRecord22:', this.videoContext)
        });
    }
  },

  /**
   * 监控开始播放
   */
  playAuto: function() {
    API.Course.viewRecord(this.data.courseId)
      .then((res) => {
        this.setData({ 'learnRecord.startTime': res.ts});
      }, () => {
        console.log('接口viewRecord...')
      });
  },

  /**
   * 点击非wifi播放
   */
  bindplayFn: function () {
    this.setData({isWifi: false});
    setTimeout(() => {
      this.videoContext.play();
      this.videoContext.seek(this.data.initPoint);
    },500)
  }
})
