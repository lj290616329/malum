var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var that;
Page({
  data: {
    imgheight: 150,
    nickName: '',
    headImg: '/images/headimg.png',
    headImgHeight: '190rpx',
    topMargin: '80rpx',
    error: false,
    errmsg: '', prompt: false,
    promptMsg: ''        
  },  
  onLoad: function () {
    that = this;
    console.log("doctor-index.js----onload");
    var width = wx.getSystemInfoSync().windowWidth;
    console.log(width);
    var userInfo = wx.getStorageSync('userInfo')||{};
    this.setData({
      imgheight: width * 0.64,
      nickName: userInfo.nickName || "",
      headImg: userInfo.avatarUrl|| "/images/headimg.png",
      headImgHeight: width * 0.24,
      topMargin: width * 0.12,
    })
  },
  go(){
    wx.reLaunch({
      url: '/pages/personal/index'
    })
  },
  chatList(){
    wx.navigateTo({
      url: '/pages/chat/list?type=pc'
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/doctor/info'
    })
  },
  my_patient: function () {
    wx.navigateTo({
      url: '/pages/doctor/patient'
    })
  },
  my_list: function () {
    wx.navigateTo({
      url: '/pages/doctor/list?ifEnd=true'
    })
  },
  geren:function(){
    app.globalData.if_information =true;
    wx.navigateTo({
      url: '/pages/personal/index'
    })
  },
  news(){
    wx.navigateTo({
      url: '/pages/news/index'
    })
  },
  scan: function () {
    
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        console.log(result)
        var token = result;
        util.sendAjax(that,api.EvaluationBind,token,"post",function(result){
            wx.navigateTo({
              url: '/pages/doctor/evaluation_detail?id=' + result.data,
            })        
        })
      }
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})