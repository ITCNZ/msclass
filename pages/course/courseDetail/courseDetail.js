// pages/course/courseDetail/courseDetail.js
var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');

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
      'courseId': '',
      'learnSource': 3
    },
    initPoint: 0, // 上次播放位置
    isWifi: false,
    loadMask: true,
    videoTime: 0, // 视频时长

    // 去除暂停时长
    pauseTime: 0,
    restartTime: 0,
    trueTime: [],
    isOnHide: false, // 是否退出
    isPause: false, // 是否暂停
    isPlayEnd: false, // 是否播放到末尾
    initStartTime: 0, // 初始startTime
    isCollect: 1,
    collectData: {
      action: '',
      courseId: ''
    },
    isFirstPlay: true,
    free: false // 免费课程
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    let userInfo = Storage.getStorageSync("mingshi_userInfo");
    this.setData({ 
      courseId: options.id,
      userId: userInfo ? userInfo.userId : '',
      'learnRecord.courseId': options.id,
      'collectData.courseId': options.id,
      free: options.free ? options.free : false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
    this.getCourse(this.data.courseId);
  },
  onShow: function() {
    this.setData({
      pauseTime: 0,
      restartTime: 0,
      trueTime: []
    });
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
            this.data.videoTime = res.bizData.duration;
            resBiz.description = resBiz.description.replace(/(^\s*)|(\s*$)/g, "");

            // resBiz.sourceLd = 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400';
            this.setData({ detailData: resBiz, isCollect: resBiz.collect, 'collectData.action': resBiz.collect});
    
            wx.setNavigationBarTitle({
              title: resBiz.courseName
            })
            UI.navLoading(false);
            lastTime > skip ? this.setData({ initPoint: lastTime }) : this.setData({ initPoint: skip });
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
      loadMask: true,
      pauseTime: 0,
      restartTime: 0,
      trueTime: [],
      free: false
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
    console.log('退出...', this.data.isPause)
    if (this.data.isOnHide || this.data.isPlayEnd) return;
    if (this.data.isPause) {
      let gooutTime = (new Date()).valueOf() - this.data.pauseTime;
      this.data.trueTime.push(gooutTime)
    }
    if (!this.data.isPause && this.data.trueTime.length >= 1) {
      this.data.trueTime[this.data.trueTime.length -1] = 0;
    }
    this.setData({ isOnHide: true });
    this.learnRecord();
  },

  /**
   * 暂停上传记录
   */
  pauseFn: function() {
    console.log('暂停啦...')
    this.setData({ 
      pauseTime: (new Date()).valueOf(),
      isPause: true
    });
  },

  /**
   * 监听页面卸载
   */
  onUnload: function () {
    if (this.data.isOnHide || this.data.isPlayEnd) return;
    if (this.data.isPause) {
        let gooutTime = (new Date()).valueOf() - this.data.pauseTime;
        this.data.trueTime.push(gooutTime)
    }
    this.learnRecord();
    console.log('卸载....')
  },

  /**
   * 上传播放记录
   */
  learnRecord: function() {
    console.log('this.data.userId', this.data.userId)
    if (!this.data.userId) return;
    var startTime = 0;
    // console.log('真实数组', this.data.trueTime);
    this.data.trueTime.forEach((e) => {
      startTime += e;
      // console.log('q', this.data.initStartTime + startTime)
      this.setData({ 'learnRecord.startTime': this.data.initStartTime + startTime });
    })
    if (this.data.learnRecord.startTime && this.data.learnRecord.timePoint >= 1) {
      // console.log('当前时间戳：', (new Date()).valueOf());
      // console.log('初始值：', this.data.initStartTime)
      // console.log('这也是真实数组啊', this.data.trueTime);
      if ((new Date()).valueOf() - this.data.learnRecord.startTime < 0) {
        this.setData({ 'learnRecord.startTime': this.data.initStartTime + this.data.trueTime[0] });
      }
      // console.log('这是传的参数:', this.data.learnRecord)
      API.Course.learnRecord(this.data.learnRecord)
        .then((res) => {
          console.log('learnRecord22:', this.data.learnRecord)
        }, (res) => {
          console.log('错误啦！！')
        });
    }
  },

  /**
   * 开始播放
   */
  playFn: function() {
    if (this.data.isFirstPlay) {
      if (!this.data.isWifi) {
        this.videoContext.play();
        this.videoContext.seek(this.data.initPoint);
      }

      // 记录首次播放的时间戳
      API.Course.viewRecord(this.data.courseId)
        .then((res) => {
          this.setData({
            'learnRecord.startTime': res.ts,
            initStartTime: res.ts,
            isFirstPlay: false
          });
          console.log('res.ts', res.ts)
        }, (err) => {
          console.log('接口viewRecord错误...')
        });
    } else {
      this.setData({
        restartTime: (new Date()).valueOf(),
        isOnHide: false,
        isPause: false,
        isPlayEnd: false
      });
      if (this.data.pauseTime != 0) {
        let pointTime = this.data.restartTime - this.data.pauseTime;
        this.data.trueTime.push(pointTime);
      }
      // console.log('this.trueTime', this.data.trueTime)
    }
  },

  /**
   * 播放到结尾
   */
  playEnd: function() {
    this.setData({isPlayEnd: true})
    this.learnRecord();
    console.log('播放完毕....')
  },

  /**
   * 点击非wifi播放
   */
  bindplayFn: function (e) {
    // status=1 未登录；status=2 登录未购买； status=3 登录wifi状态
    let status = e.currentTarget.dataset.status;
    if (status == 1) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
    } else if (status == 3) {
      this.setData({ isWifi: false });
      this.playFn()
    }
  },

  /**
   * 收藏
   */
  collectFn: function() {
    if (!this.data.userId) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
    } else {
      API.Course.collect(this.data.collectData)
        .then((res) => {
          if (this.data.collectData.action == 1) {
            UI.alert('收藏成功');
            this.setData({
              'collectData.action': 2,
              isCollect: 2
            });
          } else {
            UI.alert('取消收藏');
            this.setData({
              'collectData.action': 1,
              isCollect: 1
            });
          }
        });
    }
  }

})
