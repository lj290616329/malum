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
    util.request(api.DoctorInfo,{},"get").then(function(result){
      if (result.code == 0) {
        var doctor = result.data;
        that.setData({
          doctor:doctor
        })
      } else {
        util.prompt(that, result.errmsg);
      }
    });   
  },
  back: function () {
    util.back();
  },   
  
  submitForm(e) {
    let data = e.detail.value;    
    console.log(data)
    util.request(api.DoctorInfoEdit,data,"post").then(function(result){
      console.log(result);
      if (result.code == 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            util.back();
          }
        })
      } else {
        util.prompt(that, result.data.errmsg);
      }
    }).catch(function(err){
      console.log(err);
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})
