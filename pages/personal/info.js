var app = getApp()
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate';
Page({
  data:{
    information:{},
    marryList:["请选择您的婚姻状态",'已婚','未婚','离异','丧偶']
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;
    util.request(api.InformationDetail,{},"get").then(function(result){
      console.log(result)
      if(result.code==0){
        let information = result.data||{};
        let domicile = information.domicile||"";
        information.domicileList = domicile.split(",")
        that.setData({
          information :information
        })
      }
    })
    that.initValidate();
  },
  initValidate(){
    const rules = {
      name: {
        required: true,
        minlength:2
      },
      phone:{
        required:true,
        tel:true
      },
      sex: {
        required: true
      },
      birthday:{
        required: true,
        date:true
      },
      marry:{
        required: true,
        min:1
      },
      profession:{
        required: true
      },
      domicile:{
        required: true
      },
      address:{
        required: true
      }
      
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength:'请输入正确的名称'
      },
      phone:{
        required:'请填写手机号',
        tel:'请填写正确的手机号'
      },
      sex:{
        required:'请选择您的性别'
      },
      birthday:{
        required: '请选择您的出生日期',
        date:'请选择您的出生日期'
      },
      marry:{
        required: '请选择您的婚姻状态',
        min:'请选择您的婚姻状态'
      },
      required:{
        required:'请输入您的职业'
      },
      domicile:{
        required: '请选择您的籍贯'
      },
      address:{
        required:'请输入您的常驻地址'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  back(){
    util.back();
  },
  pickerChange: function (e) {
    console.log("bindPickerBirthday");
    console.log(e);
    let val = e.detail.value;
    let type = e.currentTarget.dataset.type;
    var set_vals = 'information.'+type+''
    if(type=='domicile'){
      that.setData({
        ['information.domicileList']:val
      })
      val = val.join(",");
    }
    this.setData({
      [set_vals]:val
    });
  },
  submitForm: function (e) {
    console.log(e);
    const params = e.detail.value;
    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0];
      console.log(error);
      util.warn(that,error.msg);
      return;
    }
    params.domicile = params.domicile.join(",");
    util.request(api.InformationForm,JSON.stringify(params),"POST").then(function(result){
      console.log(result);
      if (result.code == 0) {
        var pages = getCurrentPages();//当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
          beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
            ifAuth: false
          })
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
        util.warn(that, result.errmsg);        
      }
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }  
})
