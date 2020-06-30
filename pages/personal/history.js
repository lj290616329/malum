var app = getApp()
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: {}
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;
    util.request(api.PersonalEvaluationList,{},"get").then(function(result){
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
    });       
  },  
  detail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/personal/evaluation_detail?id='+id
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/personal/info'
    })
  },
  back: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})
