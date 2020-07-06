var app = getApp()
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: {}
  },
  onLoad: function (options) {
    console.log('info.js onload');
    that = this;
    let type = options.type;
    util.sendAjax(that,api.ChatFriends+type,{},"get",function(result){
      if(result.data.length>0){
        that.setData({
          lists: result.data[0].list
        })
      }else{
        that.setData({
          noData:true
        })
      }
    });       
  },  
  chat:function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let set_key = 'lists['+index+'].unRead'
    that.setData({
      [set_key]:0
    })
    console.log(id);
    console.log(index)
    wx.navigateTo({
      url: '/pages/chat/chat?id='+id
    })
  },
  back: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})
