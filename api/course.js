var { Net, Config } = require('../utils/util');

module.exports = {

  /**
   * 首页推荐课程
   * @param userId
   */
  getRecommendCourse: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getRecommendCourse", {}, { 'userId': userId });
  },

  /**
   * 首页本周必修课
   * @param data
   */
  getMyCoursePlanByWeek: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getMyCoursePlanByWeek", {}, data);
  },

  /**
   * 课程分类信息
   * @param data
   */
  getCourseTypeSearchInfo: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getCourseTypeSearchInfo", {}, data);
  },

  /**
   * 课程分页列表
   * @param data
   */
  getCoursePageByTypeId: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getMiniCourse4PageByTypeId", {}, data);
  },

  /**
 * 视频播放页
 * @param courseId
 */
  getPlayCourseDetailInfo: function (courseId, userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getPlayCourseDetailInfo", {}, { 'courseId': courseId, 'userId': userId});
  },

  /**
   * 点击开始观看时，请求服务端
   * 这个接口主要是服务端要记录每一个视频的播放次数）
   * @param courseId
   */
  viewRecord: function(courseId) {
    return Net.postRequest(Config.url.teacher + "/course/viewRecord", {}, { 'courseId': courseId });
  },

  /**
   * 学习记录
   * @param data
   */
  learnRecord: function(data) {
    return Net.postRequest(Config.url.teacher + "/course/learnRecord", {}, data);
  },

  /**
 * 获取视频上次播放的时间点
 * @param courseId
 */
  getLastLearnTime: function (courseId) {
    return Net.postRequest(Config.url.teacher + "/course/getLastLearnTime", {}, { 'courseId': courseId });
  },

  /**
   * 搜索页关键词
   */
  getSearchKeyWord: function () {
    return Net.postRequest(Config.url.mini + "/courseProgram/getSearchKeyWord", {}, {});
  },

  /**
  * 搜索结果
  * @param data
  */
  getSearchKeyCourseList: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getSearchKeyCourseList", {}, data);
  },

  /**
  * 课程目录
  * @param courseId
  */
  getCourseCatalog: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getCourseCatalog", {}, { 'userId': userId});
  },

  /**
  * 我的必修课列表
  * @param data
  */
  getCoursePlanListByUserId: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getCoursePlanListByUserId", {}, data);
  },

  /**
  * 我的必修课详情
  * @param data
  */
  getCoursePlanDetail: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getCoursePlanDetail", {}, data);
  },

  /**
  * 收藏课程
  * @param data
  */
  collect: function (data) {
    return Net.postRequest(Config.url.teacher + "/collect/collect", {}, data);
  },


}
