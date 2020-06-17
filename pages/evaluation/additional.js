const app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    tab:0,
    opens:[false,false,false],
    treat:{}
  },
  onLoad: function (options) {
    that = this;
    console.log(options)
    let vals = wx.getStorageSync('treat')||{};
    that.setData({
      treat:vals,
      id:options.id
    })
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
  other(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let title = e.target.dataset.title;
    let level = e.target.dataset.level;
    let val = e.detail.value;
    console.log(level===1)
    if(level==1){
      if(vals['其他生物制剂'] == undefined){
        vals['其他生物制剂'] = {};
      }
      vals['其他生物制剂'].check = [val];
    }else{
      if(vals[title]==undefined){
        vals[title] = {};
      }
      vals[title].other = val
    }    
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },
  treat(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let title = e.target.dataset.title;
    console.log(title)
    let val = e.detail.value;
    if(vals[title]==undefined){
      vals[title] = {};
    }
    vals[title].check = val
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },
  textarea(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let type = e.target.dataset.type;
    vals[type] = e.detail.value;
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },  
  submit: function () {   
    let treat = wx.getStorageSync('treat')||{};
    let datas = {
      treat : JSON.stringify(treat)
    };    
    console.log(datas);
    wx.showLoading({
      title: '提交中',
      mask:true
    });
    util.request(api.EvaluationReply+that.data.id,JSON.stringify(datas),"POST").then(function(result){
      log.info(result);
      wx.hideLoading();
      if (result.errcode == 0) {
        //wx.navigateBack
        wx.navigateBack({
          delta: 1
        })
      } else{
        wx.hideLoading();
        util.error(that, result.errmsg);
      }
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})