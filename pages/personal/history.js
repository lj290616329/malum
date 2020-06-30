var app = getApp()
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: [],
    show:false,
    pro: false
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;
    
    //获取历史记录判断是否填写个人信息    
    util.request(api.PersonalEvaluationList,{},"get").then(function(result){
      console.log(result);
    });
       
  },  
  detail:function(e){
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/personal/evaluation_detail?id='+id
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/personal/info'
    })
  },
  cancel: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})
