//index.js
//获取应用实例
var util = require('../../utils/util.js');
Page({  
  onLoad: function(options) {
    wx.showLoading({
      title: '登录中~~',
      mask:true
    })
    console.log("index--onload")
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (!res.authSetting['scope.userInfo']) { 
          wx.reLaunch({
            url: '/pages/index/main'
          })
        }else{
          util.login().then(function(result){
            wx.hideLoading();
            console.log(result);
            if(result.code===0){
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
            }else{
              wx.reLaunch({
                url: '/pages/index/main'
              })
            }
          }).catch(function(res){
            wx.hideLoading();
            wx.reLaunch({
              url: '/pages/index/main'
            })
          })
        }
      }
    })    
  }
})