var { Net, Config } = require('../utils/util');

module.exports = {

  /**
   * 我的课程页
   * @param userId
   */
  getbuyCoursePackage: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getbuyCoursePackage", {}, { 'userId': userId });
  },

  /**
   * 本周必修课
   * @param userId
   */
  getMycourseInfo: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getMycourseInfo", {}, data);
  },

  /**
   * 体验课程
   * @param data
   */
  getExperiencecourse: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getExperiencecourse", {}, data);
  },

  /**
   * 明星课程分类
   */
  getSuperTypeCourse: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getSuperTypeCourse", {}, { 'userId': userId});
  },

  /**
   * 明星课程列表
   * @param data
   */
  getSuperCourseInfoList: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getSuperCourseInfoList", {}, data);
  },

  /**
   * 全员课程类型
   */
  getAllCourseInfoList: function () {
    return Net.postRequest(Config.url.mini + "/courseProgram/getAllCourseInfoList", {}, {});
  },

  /**
   * 全员课程列表
   */
  getAllCourseDetailInfo: function (data) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getAllCourseDetailInfo", {}, data);
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
  getLastLearnTime: function(courseId) {
    return Net.postRequest(Config.url.teacher + "/course/getLastLearnTime", {}, { 'courseId': courseId });
  }

}
