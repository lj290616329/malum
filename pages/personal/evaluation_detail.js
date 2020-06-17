// pages/details.js
const app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    spasiList:['完全缓解','轻度','中度','重度','极重度'],
    pestList:['不太可能','可能性小','有些可能','很有可能','非常可能'],
    psaList:['无风险','低风险','中风险','高风险','极高风险'],
    qolList:['无影响','轻微影响','相当影响','严重影响','极重影响'],
    opens:[false,false,false,false,false],
    evaluation:null,
    code:'',
    doctor:null,
    arraylife: ['毫无影响', '有轻微影响', '有相当程度影响', '有十分严重的影响', '有极度影响，几乎痛不欲生'],
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
    console.log(app.globalData);
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      codeHeight: width * 0.8 * 0.8 + "px"
    })
    console.log('evaluation_detail.js onload');
    var id = options.id;    
    util.request(api.PersonalEvaluationDetail+id,{},"get").then(function(result){
      console.log(result)
      log.info(result);
      if (result.errcode == 0) {
        let evaluation = result.data;
        evaluation.result_map = JSON.parse(evaluation.result||"{}");
        that.setData({
          evaluation: evaluation,
          code: "data:image/png;base64," + result.code.replace(/[\r\n]/g, ""),
        })
        if (result.doctor){
          that.setData({
            doctor: result.doctor
          })
        }
      } else {
        util.error(that,result.errmsg);
      }
    });   
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