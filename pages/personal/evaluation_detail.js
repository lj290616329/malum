// pages/details.js
const app = getApp();
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    opens:[],
    code:'',
    show:false,
    tab:0,
    codeHeight:'100%',
  },
  changeTab:function(e){
    const index = e.currentTarget.dataset.index;
    that.setData({
      tab:index
    })    
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens['+index+']';
    that.setData({
      [set_val]:!opens[index]
    });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      codeHeight: width * 0.8 * 0.8 + "px"
    })
    console.log('evaluation_detail.js onload');
    var id = options.id;
    util.sendAjax(that,api.PersonalEvaluationDetail+id,{},"get",function(result){    
      that.setData({
        detail:result.data,
        code:"data:image/png;base64," + result.data.src.replace(/[\r\n]/g, "")
      })      
    });   
  },
  chat(e){
    const id = e.currentTarget.dataset.id;
    util.sendAjax(that,api.ChatByDid+id,{},"get",function(result){
      wx.navigateTo({
        url: '/pages/chat/chat?id='+result.data
      })
    })
  },
  share_result:function(){
    that.setData({
      show: true,      
    })
  },
  cancle:function(){
    that.setData({
      show: false,
    })
  },
  home:function(){
    wx.navigateTo({
      url: '/pages/personal/index'
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})