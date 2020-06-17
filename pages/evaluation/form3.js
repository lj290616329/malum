const app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    result:['','','','','','',''],
    tipsMsg: ['', '', '', '', '', '', ''],
    lable_box: [
      '您曾经有过一个或多个关节肿胀?',
      '有医生告诉过您您有关节炎?',
      '您的指(趾)甲上有凹点?',
      '您的足后跟疼?',
      '您有一个手指(足趾)不明原因肿痛?',
      '口服阿维A、他扎罗汀等维A酸类药物?',
      '患有虹膜炎、睫状体炎或脉络膜炎?'
    ],
    prompt: false,
    promptMsg: '',
    show:false
  },
  onLoad: function (options) {
    that = this;
    console.log(app.globalData.data.result2);
    this.setData({
      result: app.globalData.data.result2
    })
  },
  radioChoose:function(e){
    var globalData = app.globalData.data;    
    var index = e.currentTarget.dataset.index;
    var val = e.detail.value;    
    var result1 = 'result[' + index + ']';
    this.setData({
      [result1]: parseInt(val)
    })      
    globalData.result2[index] = parseInt(val);
  },
  pre(){
    that.setData({
      show:true
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/evaluation/additional'
    })
  },
  submit: function () { 
    var result = that.data.result;
    for (let i = 0; i < result.length; i++) {
      if (result[i] === '') {
        util.prompt(that, "请选择" + that.data.lable_box[i]);
        return;
      }
    };  
    var globalData = app.globalData;
    var if_test = app.globalData.if_test;
    if (if_test){
      wx.navigateTo({
        url: '/pages/test/result'
      })
      wx.removeStorageSync('treat');
    }else{
      let basic = wx.getStorageSync('basic');
      let treat = wx.getStorageSync('treat')||{};
      //组装数据
      var datas = {
        'height':basic.height,
        'weight':basic.weight,
        'incidenceTime':basic.incidenceTime,
        'datet1': globalData.data.result1[0],//面积
        'datet2': globalData.data.result1[1],//红斑
        'datet3': globalData.data.result1[2],//鳞屑
        'datet4': globalData.data.result1[3],//厚度
        'level': globalData.data.level,//生活质量评分
        'if_1': globalData.data.result2[0],//关节炎相关情况1
        'if_2': globalData.data.result2[1],//2
        'if_3': globalData.data.result2[2],//3
        'if_4': globalData.data.result2[3],//4
        'if_5': globalData.data.result2[4],//5
        'if_6': globalData.data.result2[5],//6
        'if_7': globalData.data.result2[6],//7
        //新表
        'checkvalue1': globalData.data.checkvalue1,//是否诊断银屑病
        'time1': globalData.data.time1,//诊断银屑病时间
        'checkvalue2': globalData.data.checkvalue2,//是否诊断银屑病关节炎
        'time2': globalData.data.time2,//诊断银屑病关节炎时间
      };
      datas.treat = ""+JSON.stringify({})+"";
      console.log(datas);
      wx.showLoading({
        title: '提交中',
        mask:true
      })
      util.request(api.EvaluationForm,JSON.stringify(datas),"POST").then(function(result){
        log.info(result);
        wx.hideLoading();
        if (result.errcode == 0) {
          wx.removeStorageSync('treat');
          wx.navigateTo({
            url: '/pages/evaluation/result?id='+result.data
          })
        } else{
          wx.hideLoading();
          util.error(that, result.errmsg);
        }
      })
    }
  },
  back(){
    that.setData({
      error: false,
      errmsg: ''
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }   
})