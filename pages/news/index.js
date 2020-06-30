//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var that;
Page({
  data: {    
    tags:[],
    newsLists:app.globalData.newsLists,
    sTop:0
  },  
  onLoad: function(options) {
    that = this;
    util.request(api.NewsTags,{},"get").then(res=>{
      that.setData({
        tags:res.data,
        newsLists:app.globalData.newsLists
      })

      let tid = app.globalData.tid||res.data[0].id;
      that.showList(tid);
    })
  },
  getNewsList(tid){
    let set_key = 'newsLists.'+tid;
    let pageNum = 1;
    let pageSize = 15; 
    let data = {};
    console.log(!that.data.newsLists[""+tid])
    if(that.data.newsLists[""+tid]){
      data = that.data.newsLists[""+tid];
      let last = data.last||false;
      pageNum = data.pageNum+1;
      if(last){
        return;
      }
    }
    util.request(api.NewsList,{pageNum:pageNum,pageSize:pageSize,tag:tid},"POST").then(res=>{
      console.log(res);
      data.last = res.data.last;
      data.pageNum = pageNum;
      let content = data.content||[];
      data.content =  content.concat(res.data.content);
      let sTop = data.sTop||0;
      data.end = res.data.last;      
      that.setData({
        [set_key] : data,
        lists:data.content,
        sTop:sTop,
        end:data.end,
        tid:tid
      })
      let newsLists = that.data.newsLists;
      app.globalData.newsLists = newsLists;
      app.globalData.tid = tid;
    })
  },
  showList(tid){
    if(that.data.newsLists[""+tid]){
      let data = that.data.newsLists[""+tid];
      that.setData({
        lists:data.content,
        sTop:data.sTop,
        end:data.end,
        tid:tid
      })
    }else{
      that.getNewsList(tid)
    }
  },
  changeTag(e){
    console.log(e);
    let tid = e.target.dataset.id;
    that.showList(tid);
  },
  more(){
    let tid = that.data.tid;
    that.getNewsList(tid);
  },
  scroll(e){
    console.log(e);
    let tid = that.data.tid;
    let set_key = 'newsLists.'+tid+'.sTop';
    that.setData({
      [set_key]:e.detail.scrollTop
    });

    let newsLists = that.data.newsLists;
    app.globalData.newsLists = newsLists;
  },
  detail(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news/detail?id='+id
    })
  }
})