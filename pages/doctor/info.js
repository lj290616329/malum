var app = getApp();
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var that;
Page({
  data: {
    show:false,
    warnmsg: '',
    error: false,
    errmsg: '',
    /*需要提交的数据*/
    name: '',
    phone: '',
    goodAt: '',
    description: '',
    introduce: '',    
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;

    util.request(api.DoctorInfo,{},"get").then(function(result){
      console.log(result);
      console.log(result.errcode);
      if (result.errcode == 0) {
        var doctor = result.data;
        that.setData({
          name: doctor.name,
          phone: doctor.phone,
          goodAt: doctor.goodAt,
          description: doctor.description,
          introduce: doctor.introduce,
        })
      } else {
        util.prompt(that, result.errmsg);
      }
    }).catch(function(err){
      console.log(err);
      console.log(1);
    });    
  },
  cancel: function () {
    util.back();
  },
  back: function () {
    util.back();
  },   
  bindKeyInput: function (e) {
    console.log("bindKeyInput");
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;
    var set_type = '' + type + ''; 
    this.setData({
      [set_type]: val,      
    })
  },
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    this.setData({
      introduce: e.detail.value
    })
  },  
  formSubmit: function () {
    
    var data = JSON.stringify({
      name: this.data.name,
      phone: this.data.phone,
      goodAt: this.data.goodAt,
      description: this.data.description,
      introduce: this.data.introduce,
    });
    console.log(data)
    util.request(api.DoctorInfoEdit,data,"post").then(function(result){
      console.log(result);
      
      if (result.errcode == 0) {
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
