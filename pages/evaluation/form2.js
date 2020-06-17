// pages/EvaluationForm/EvaluationForm1.js
const app = getApp();
var globalData = app.globalData;
var domain = globalData.host;
var util = require('../../utils/util.js');
Page({
  data: {
    index: '',//    
    pics: false,
    result: ['','','',''],
    arraylife: ['毫无影响', '有轻微影响', '有相当程度影响', '有十分严重的影响', '有极度影响，几乎痛不欲生'],
    imageArray: ['/images/level0.jpg', '/images/level1.jpg', '/images/level2.jpg', '/images/level3.jpg', '/images/level4.jpg'],
    imageList: [
      [['0.jpg', '完全无皮损'], ['1.jpg', '皮损面积占全身面积1~5%'], ['2.jpg', '皮损面积占全身面积6~9%'], ['3.jpg', '皮损面积占全身面积10~29%'], ['4.jpg', '皮损面积占全身面积30~49%'], ['5.jpg', '皮损面积占全身面积50~69%'], ['6.jpg', '皮损面积占全身面积70~89%'], ['7.jpg', '皮损面积占全身面积90~100%']],
      [['hb1.png', '无可见红斑'], ['hb2.png', '皮损为淡红色'], ['hb3.png', '皮损为红色'], ['hb4.png', '皮损为深红色'], ['hb5.png', '皮损为极深红色']],
      [['tx1.png', '表面无可见鳞屑'], ['tx2.png', '部分皮损表面上覆有鳞屑,以细微的鳞屑为主'], ['tx3.png', '大多数皮损表面覆有鳞屑,鳞屑呈片状'], ['tx4.png', '几乎全部皮损表面覆有鳞屑,鳞屑较厚成层'], ['tx5.png', '全部皮损表面均覆有鳞屑,鳞屑很厚成层']],
      [['jr1.png', '皮损与正常皮肤平齐'], ['jr2.png', '皮损较微高于正常皮肤表面'], ['jr3.png', '中度隆起,斑块的边缘为圆或斜坡型'], ['jr4.png', '皮损肥厚,隆起明显'], ['jr5.png', '皮损高度增厚,隆起极为明显']]
    ],
    imageBox:[],//需要展示的列表
    level: '',
    lifePic:"",
    items:['面积(A)','红斑(E)','鳞屑(S)','厚度(T)'],
    tipsMsg: ["请选择面积", "请选择红斑", "请选择鳞屑","请选择厚度"],
    prompt: false,
    promptMsg: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var life_level = globalData.data.level;
    this.setData({
      result: globalData.data.result1,
      level: life_level,
    });
    if (life_level != '') {
      this.setData({
        lifePic: this.data.imageArray[globalData.data.level],
      });
    }
  },
  showpics: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      pics: true,
      index:index,
      imageBox:this.data.imageList[index]
    })    
  },
  choosePic: function (e) {    
    var val = e.currentTarget.dataset.index;   
    var index = this.data.index;   
    var result = 'result[' + index + ']';    
    this.setData({
      [result]:val,
      pics: false
    });
    console.log(this.data)
    globalData.data.result1[index] = val;    
  },

  bindPickerlife: function (e) {
    var val = e.detail.value;    
    app.globalData.data.level = val;
    // console.log(this.data.imageArray[e.detail.value])
    this.setData({
      lifePic: this.data.imageArray[val],
      level: val
    })
  },  
  formSubmit: function () {
    var result = this.data.result;
    for (let i = 0; i < result.length; i++) {
      if (result[i]===''){
        util.prompt(this,this.data.tipsMsg[i]);
        return;
      }
    };
    if (this.data.level==''){
      util.prompt(this,'请选择生活质量评分！');
      return;
    }    
    console.log('没有表单错误，允许跳转');
    wx.navigateTo({
      url: '/pages/evaluation/form3'
    })    
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})