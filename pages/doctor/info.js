var app = getApp();
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var that;
Page({
  data: {
     doctor:{}
  },
  onLoad: function (option) {
    that = this;
    util.sendAjax(that,api.DoctorInfo,{},"get",function(res){
      var doctor = res.data;
      that.setData({
        doctor:doctor
      })
    });
  },
  back: function () {
    util.back();
  },   
  
  submitForm(e) {
    let data = e.detail.value;    
    console.log(data)
    util.sendAjax(that,api.DoctorInfoEdit,data,"post",function(res){
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          util.back();
        }
      })
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})
