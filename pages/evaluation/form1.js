// pages/EvaluationForm1.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    checkvalue1: '',
    time1: '',
    checkvalue2: '',
    time2: '',
    disabled1:false,
    disabled2: false,
    setDate1:false,
    setDate2: false,
    prompt:false,
    promptMsg:''
  },
  onLoad: function (option) {
    let basic = wx.getStorageSync('basic')||{};
    console.log(basic)
    this.setData({
      height:basic.height,
      weight:basic.weight,
      incidenceTime:basic.incidenceTime||'',
      checkvalue1: app.globalData.data.checkvalue1,
      time1: app.globalData.data.time1,
      checkvalue2: app.globalData.data.checkvalue2,
      time2: app.globalData.data.time2,
    });
    if(this.data.checkvalue1=="0"){
      this.setData({
        disabled1:true
      })
    }
    if (this.data.checkvalue2 == "0") {
      this.setData({
        disabled2: true
      })
    }
  },
  bindKeyInput(e){
    let basic = wx.getStorageSync('basic')||{};
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;
    basic[type] = val;
    console.log(basic);
    wx.setStorageSync('basic', basic);
    this.setData({
      [type]: val,      
    })
  },
  radioChoose1: function (e) {
    console.log('picker1发送选择改变，携带值为', e.detail.value)
    app.globalData.data.checkvalue1 = e.detail.value
    this.setData({
      checkvalue1: e.detail.value
    })
    if (e.detail.value==0){
      app.globalData.data.time1 = '';
      this.setData({
        time1: '',
        disabled1: true,
        setDate1:false
      })      
    }else{      
      this.setData({
        disabled1: false
      })
    }
  },
  radioChoose2: function (e) {
    console.log('picker发送选择改变，携带值为2', e.detail.value)
    app.globalData.data.checkvalue2 = e.detail.value
    this.setData({
      checkvalue2: e.detail.value,      
    })
    if (e.detail.value == 0) {
      app.globalData.data.time2 = '';
      this.setData({
        time2: '',
        disabled2: true,
        setDate2: false
      })      
    }else{
      this.setData({
        disabled2: false,        
      })
    }
  },
  chooseIncidenceTime:function(e){
    console.log('picker发送选择改变，携带值为3', e.detail.value)
    let basic = wx.getStorageSync('basic')||{};
    basic.incidenceTime = e.detail.value;
    wx.setStorageSync('basic', basic);
    this.setData({
      incidenceTime: e.detail.value,
    })
  },  
  chooseTime1: function(e) {
    console.log('picker发送选择改变，携带值为3', e.detail.value)
    app.globalData.data.time1 = e.detail.value
    this.setData({
      time1: e.detail.value,
      setDate1:true
    })
  },
  chooseTime2: function (e) {
    console.log('picker发送选择改变，携带值为4', e.detail.value)
    app.globalData.data.time2 = e.detail.value
    this.setData({
      time2: e.detail.value,
      setDate2: true
    })
  },
  formSubmit: function () {
    if(this.data.height == ''){
      util.prompt(this,"请输入您的身高！");
      return;
    }
    if(this.data.weight == ''){
      util.prompt(this,"请输入您的体重！");
      return;
    }
    if(this.data.incidenceTime == ''){
      util.prompt(this,"请选择首次发病日期！");
      return;
    }
    if (this.data.checkvalue1 == '') {
      util.prompt(this,"请选择是否已经由皮肤科医生诊断为银屑病！");
      return;
    } else if (this.data.checkvalue1 == 1 && this.data.time1 == ''){
      util.prompt(this,"请选择诊断银屑病时间！");    
      return;
    }
    if (this.data.checkvalue2 == '') {
      util.prompt(this,'请选择是否已经由皮肤科或风湿免疫科医生诊断为银屑病性关节炎（或关节型银屑病）!');    
      return;
    } else if (this.data.checkvalue2 == 1 && this.data.time2 == ''){
      util.prompt(this,'诊断银屑病性关节炎（或关节型银屑病）的时间！');
      return;
    } 
    wx.navigateTo({
      url: '/pages/evaluation/form2'
    })    
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})