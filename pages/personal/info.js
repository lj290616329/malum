var app = getApp()
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({  
  data:{
    arrayeducation: ['文盲', '小学','初中','高中','大学','研究生以上'],
    show: false,
    warnmsg:'', 
    id:'',
    /*需要提交的数据*/
    vals:['','','','',''],
    tipsMsg: ["请输入您的真实姓名", "请选择您的性别", "请输入您的微信号","请选择您的出生日期","请选择您的教育程度"],//, "请输入您的身高",'请输入您的体重',"请选择您的发病日期"
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;
    if (app.globalData.if_information){
      util.request(api.InformationDetail,{},"get").then(function(result){
        log.info(result);
        if (result.errcode == 0) {
          var information = result.data;            
          that.setData({
            id: information.id,
            vals: [information.name, information.sex, information.wx,  information.birthday, information.education]
          })            
        } else {
          util.error(that, result.errmsg);
        }
      })
    }    
  },
  cancel:function(){
    util.back();
  },
  radioChoose: function (e) {
    console.log("radioChoose");
    var index = e.currentTarget.dataset.index;
    var val = e.detail.value;
    var set_vals = 'vals['+index+']'
    this.setData({
      [set_vals]:val
    });
  },
  bindKeyInput: function (e) {
    console.log("bindKeyInput");
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;    
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']'
    this.setData({     
      [set_vals]: val
    })
    console.log(this.data);
    console.log(e);
  },
  bindPickerBirthday: function (e) {
    console.log("bindPickerBirthday");
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']';
    this.setData({
      [set_vals]: e.detail.value
    })
  },
  bindPickerIncidenceTime: function (e) {
    console.log("bindPickerIncidenceTime");
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']';
    this.setData({
      [set_vals]: e.detail.value
    })
  },
  bindPickerEducation: function (e) {
    console.log("bindPickerEducation");
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']';
    this.setData({
      [set_vals]: e.detail.value
    });
    console.log(this.data)
  }, 
  formSubmit: function () {
    var vals = this.data.vals;
    console.log()
    for(var i=0;i<vals.length;i++){
      if (vals[i] == '' || vals[i] == null){
        util.prompt(this, this.data.tipsMsg[i]);
        return;
      }
    }
    var data = JSON.stringify({
      id: this.data.id,
      name: this.data.vals[0],
      sex: this.data.vals[1],
      wx: this.data.vals[2],
      birthday: this.data.vals[3],
      education: this.data.vals[4],
      //height: this.data.vals[5],
      //weight: this.data.vals[6],
      //incidenceTime: this.data.vals[7],
    })
    console.log(data)
    util.request(api.InformationForm,data,"POST").then(function(result){
      log.info(result);
      if (result.errcode == 0) {
        app.globalData.if_information = true;
        var pages = getCurrentPages();//当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
          beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
            show: false
          })
          beforePage.onLoad();//触发父页面中的方法
        }
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            util.back();
          }
        })
      } else {
        util.error(that, result.errmsg);        
      }
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }  
})
