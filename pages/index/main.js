//main.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var that;
Page({
  data:{
    height:'30%',
    show: false,    
  },
  onLoad: function(options) {
    that = this;
    console.log("main.js----onload");   
  },  
  showAuthorize:function (){
    this.setData ({
      show:true
    })
  },
  hiddenAuthorize:function(){
    this.setData({
      show: false
    })
  },  
  getDatas: function(e) {
    console.log(e);
    wx.showLoading({
      mask:true,
      title: '授权中~~',
    })
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.hideLoading();
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        util.prompt(that,"授权失败");
        return false;
      }
      return false;
    };
    util.getCode().then(function(res){
      wx.hideLoading();
      util.request(that,api.WxAuth,JSON.stringify({
        code: res,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        signature: e.detail.signature,
        rawData: e.detail.rawData
      }),"post",function(result){
        
        wx.setStorageSync('token', result.data.token);
        wx.setStorageSync('ifAuth', result.data.ifAuth);
        wx.setStorageSync('type', result.data.type);
        if(result.data.type==1){                
          wx.reLaunch({
            url: '/pages/personal/index'
          }) 
        }else{
          wx.reLaunch({
            url: '/pages/doctor/index'
          }) 
        }
      });
    })
  },
  cancel:function(){
    app.globalData.if_test = true;
    //拒绝直接进入自测
    this.setData({
      show: false
    });
    wx.navigateTo({
      url: '/pages/evaluation/form',
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})