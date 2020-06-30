var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var that;
Page({
  data: {    
    tags:[],
    newsLists:{},
    sTop:0
  },
  onLoad: function(options) {
    that = this;
    console.log(options)
    let id = options.id;    
    util.request(api.NewsDetail+id,{},"get").then(res=>{
      console.log(res);

      let article = res.data;
      article.content = article.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:0 auto;"')

      that.setData({
        article:article
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      })
    })
  }
})