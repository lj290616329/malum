var app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: [],
    pro: false,
    error:false,
    errmsg:''
  },
  onLoad: function (options) {
    console.log(JSON.stringify(options));
    var ifEnd = options.ifEnd ? options.ifEnd : '';
    var pid = options.pid ? options.pid:"";
    console.log('doctor-list.js onload');
    that = this;
    util.request(api.DoctorList,{pid:pid,ifEnd:ifEnd},"get").then(function(result){
      log.info(result);
      console.log(result.errcode);
      if (result.errcode == 0) {
        var lists = result.data;
        if (lists != '' && lists.length>0){
          lists.forEach(item => {
            item.result_map = JSON.parse(item.result||"{}");
          });
          that.setData({
            lists: lists,
            pro: false
          })
        }else{
          that.setData({
            lists: lists,
            pro: true
          })
        }
      } else {
        that.setData({
          error: true,
          errmsg: result.errmsg
        })
      }
    })
  },
  detail: function (e) {
    const id = e.currentTarget.id;
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
