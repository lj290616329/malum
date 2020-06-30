// pages/details.js
const app = getApp();
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var that;
Page({
  data: {
    opens: [],
    tab:0
  },
  changeTab: function (e) {
    /* 左右切换*/
    const index = e.currentTarget.dataset.index;
    this.setData({
      tab: index
    })
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens[' + index + ']';
    that.setData({
      [set_val]: !opens[index]
    });
  },  
  handle:function(e){
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const set_val = 'handleResult[' + index + ']';
    that.setData({
      [set_val]: parseInt(e.detail.value)
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      "handleResult[1]": e.detail.value[0] * (e.detail.value[1]+1)
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: that.data.multiArray,
      multiIndex: that.data.multiIndex
    };
    if (e.detail.column==0){
      switch (e.detail.value) {
        case 0:         
          data.multiIndex[0] = 0;
          data.multiArray[1] = [0]
          break;
        case 1:        
          data.multiIndex[0] = 1;
          data.multiArray[1] = [1,2]
          break;
      }    
      this.setData(data);
    }
  },
  cancel: function () {
    util.back();
  },
  formSubmit:function(){    
    var data = JSON.stringify({
      id: that.data.evaluation.id,
      num1: that.data.handleResult[0],
      num2: that.data.handleResult[1],
      num3: that.data.handleResult[2],
      num4: that.data.handleResult[3],
      num5: that.data.handleResult[4],
      num6: that.data.handleResult[5],
    });        
    util.request(api.EvaluationProcess,data,"post").then(function(result){
      console.log(result);
      if (result.errcode == 0) {
        wx.showToast({
          title: result.errmsg,
        })
        that.onLoad({id:that.data.id});
      } else {
        util.prompt(that, result.errmsg);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log('doctor-evaluation_detail.js onload');
    var id = options.id;
    
    util.request(api.DoctorEvaluationDetail + id,{},"get").then(function(result){
      console.log(result);
      if (result.code == 0) {
        that.setData({
          detail:result.data
        })
      }
    })   
  },
  chat(e){
    const id = e.currentTarget.dataset.id;
    util.request(api.ChatByDid+id,{},"get").then(function(result){
      if(result.code==0){
        wx.navigateTo({
          url: '/pages/chat/chat?id='+result.data
        })
      }else{
        util.warn(that,result.msg);
      }
    })
  },
  back: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})