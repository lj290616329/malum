var app = getApp();
var that;
Page({
  data: {
    imgheight:150,
    nickName: '',
    headImg: '/images/headimg.png',
    headImgHeight:'190rpx',
    topMargin:'80rpx',
    show:false,
    if_doctor:false,
    know:false,
  },
  onLoad: function () {
    that = this;
    let know = wx.getStorageSync('know')||false;
    console.log(know);
    var width = wx.getSystemInfoSync().windowWidth;
    console.log(width);
    var userInfo = wx.getStorageSync('userInfo')||{};
    this.setData({
      know:know,
      imgheight: width * 0.62,
      nickName: userInfo.nickName || "",
      headImg: userInfo.avatarUrl || "/images/headimg.png",
      headImgHeight: width * 0.24,
      topMargin: width*0.12,
      if_doctor:wx.getStorageSync('type')==2?true:false
    });
  },
  i_know(){
    wx.setStorageSync('know', true);
    that.setData({
      know:true
    })
  },
  see_next(){
    that.setData({
      know:true
    })
  },
  know(){
    that.setData({
      know:false
    })
  },
  go:function(){
    if(this.data.if_doctor){
      wx.reLaunch({
        url: '/pages/doctor/index'
      })
    }else{
      this.setData({
        if_doctor: false
      })
    }
  },
  info:function(){    
    wx.navigateTo({
      url: '/pages/personal/info'
    })
  },
  history:function(){
    let ifAuth = wx.getStorageSync('ifAuth')||false;
    if (ifAuth) {
      wx.navigateTo({
        url: '/pages/personal/history'
      })
    } else {
      //弹出信息
      this.setData({
        show: true
      })
    }    
  },
  chatList(){
    wx.navigateTo({
      url: '/pages/chat/list?type=mobile'
    })
  },
  go_test:function(){   
    wx.navigateTo({
      url: '/pages/evaluation/form'
    })      
  },
  cancel(){
    //弹出信息
    this.setData({
      show: false
    })
  },
  news(){
    wx.navigateTo({
      url: '/pages/news/index'
    })  
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }  
})