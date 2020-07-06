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
    if(/^[\u4e00-\u9fa5]+$/i.test(val)){
      this.getlist({name:val});
    }    
  },
  getlist: function (options){
    var name = options.name||'';
    util.sendAjax(that,api.MyPatient,name,"POST",function(result){
      if(result.data.length>0){
        that.setData({
          lists:result.data,
          noData:false
        })
      }else{
        that.setData({
          noData:true
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
  back:function(){
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }
})
