var app = getApp();
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: [],
  },
  onLoad: function (options) {
    var ifEnd = options.ifEnd||false;
    var pid = options.pid;
    console.log('doctor-list.js onload');
    console.log(JSON.stringify({pid:pid,ifEnd:ifEnd}))
    that = this;
    util.sendAjax(that,api.DoctorList,JSON.stringify({pid:pid,ifEnd:ifEnd}),"post",function(result){
      console.log(result);
      let data = result.data;
      let noData = false;
      if(Object.keys(data).length==0){
        noData = true;
      };
      that.setData({
        noData:noData,
        lists:data
      })      
    })
  },
  detail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/doctor/evaluation_detail?id=' + id
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})
