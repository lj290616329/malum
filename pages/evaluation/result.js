const app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    colorList:['#98e0b6','#f1cd23','#f6a63f','#eb5555','#ba6161'],
    spasiList:['完全缓解','轻度','中度','重度','极重度'],
    pestList:['不太可能','可能性小','有些可能','很有可能','非常可能'],
    psaList:['无风险','低风险','中风险','高风险','极高风险'],
    qolList:['无影响','轻微影响','相当影响','严重影响','极重影响'],
    imgheight: 200,
    headImgHeight: '190rpx',
    topMargin: '80rpx',
    top: 350,
    height: '200px',
    nickName: '',
    headImg: '/images/headimg.png',
    show:false,
    modalheight: '30%',
    codeHeight:'100%'
  },
  onLoad: function (options) {
    that = this;
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      codeHeight: width * 0.8 * 0.8 + "px",
    })
    console.log(width);
    var userInfo = app.globalData.userInfo;
    that.setData({
      imgheight: width * 0.62,
      nickName: userInfo.nickname ? userInfo.nickname : "",
      headImg: userInfo.headimgurl ? userInfo.headimgurl : "/images/headimg.png",
      headImgHeight: width * 0.24,
      topMargin: width * 0.12,
    });
    var id = options.id;
    util.request(api.EvaluationResult+id,{},"get").then(function(result){
      log.info(result);
      wx.hideLoading();
      if (result.errcode == 0) {
        let data = result.data;
        that.setData({
          result:data,
          id:id
        })
      } else{
        util.error(that, result.errmsg);
      }
    });
  },
  reply:function(){
    wx.navigateTo({
      url: '/pages/evaluation/additional?id='+that.data.id
    })
  },
  share_result:function(){
    console.log(app.globalData.evaluationResult);    
    //未提交个人信息需要先提交个人信息
    if (app.globalData.if_information){
      this.setData({
        show1: true,
        base64ImgUrl: "data:image/png;base64," + that.data.result.code.replace(/[\r\n]/g, "")
      })
      wx.getSetting({
        withSubscriptions:true,
        success(res) {
          if (res.subscriptionsSetting == undefined || res.subscriptionsSetting.itemSettings == undefined || res.subscriptionsSetting.itemSettings['tJwa2CVRB9mK-15715bcHafW80iIakTLqBHDY4tVYVM'] !== 'accept'){
            if (wx.requestSubscribeMessage) {
              wx.requestSubscribeMessage({
                tmplIds: ['tJwa2CVRB9mK-15715bcHafW80iIakTLqBHDY4tVYVM'],
                success(res) {
                  if (res['tJwa2CVRB9mK-15715bcHafW80iIakTLqBHDY4tVYVM'] === 'accept') {
                    wx.showToast({
                      title: '订阅成功!'
                    })
                  }
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
              })
            }  
          }
        }
      })
    }else{
      this.setData({
        show: true
      })      
    }   
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/personal/info'
    })
  },
  cancel:function(){
    this.setData({
      show:false
    })
  },
  onUnload:function(){
    wx.removeStorageSync('treat');
    wx.reLaunch({
      url: '/pages/personal/index'
    })
  },
  cancel1:function(){
    this.setData({
      show1:false
    })
  },
  home:function(){
    wx.removeStorageSync('treat');
    wx.reLaunch({
      url: '/pages/personal/index'
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})