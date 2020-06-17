const app = getApp();
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    focus: false,
    lists:[],    
    searchState:false,
    placeholder:"",
    value:"",
    cancel:false,
    pro:false,
    error:false,
    errmsg:''
  },
  showInput:function(e){
    console.log(e);
    this.setData({
      searchState:true,
      focus: true,
      placeholder: '请输入姓名进行搜索',
      cancel:true,
    })
  },
  hideInput:function(e){
    this.setData({
      searchState: false,
      focus: false,
      placeholder: '',
      value:''
    })
    this.getlist({});
  },
  clearInput:function(e){
    this.setData({
      value: ''
    })
    this.getlist({});
  },
  inputChange:function(e){
    var val = e.detail.value;
    this.setData({
      value:val
    })
    this.getlist({name:val});
  },
  getlist: function (options){
    var name = options.name === undefined ? '' : options.name;

    util.request(api.MyPatient,{name:name},"get").then(function(result){
      log.info(result);
      console.log(result.errcode);
      if (result.errcode == 0) {
        var results = result.data;
        if (results != "" && results.length>0){
          that.setData({
            lists: results,
            pro: false
          })
        }else{
          that.setData({
            lists: results,
            pro: true
          })
        }          
      }else{
        that.setData({
          error:true,
          errmsg: result.errmsg
        })          
      }
    })
  },
  onLoad: function () {    
    that = this;
    this.getlist({});    
  },  
  to_list: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/doctor/list?pid='+id
    })  
  },
  onShow: function () {

  },
  back:function(){
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})
