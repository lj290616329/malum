//index.js
import WxValidate from '../../utils/WxValidate';
//获取应用实例
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var that;
Page({ 
  data:{
    questionList:[],
    pageNo:0,
    result:{  },
    needs:{},
    toIndex:"item"+11
  },
  scroller(e){
    console.log(e);
  },
  prev(){
    let pageNo = that.data.pageNo;
    that.showData(pageNo-1);
  },
  submitForm(e) {
    const params = e.detail.value
    /**
     * 存在返回上一页的情况
     * 所以验证规则在这里进行重新匹配
     **/
    let result = that.data.result;
    let needs = that.data.needs;
    let rules = that.data.rules;
    let messages = that.data.messages;
    Reflect.ownKeys(needs).forEach(function(key){
      needs[key].forEach(n=>{
        let result_val = result[""+key]||{};
        let val = result_val.value;
        if(val==n.val){
          rules[n.groupSort+""+n.sort] = {required: true};
        }else{
          delete rules[n.groupSort+""+n.sort];
          delete result[n.id];
        }
      })
    });
    that.initValidate(rules,messages);
    // 传入表单数据，调用验证方法
    if (!that.WxValidate.checkForm(params)) {
        const error = that.WxValidate.errorList[0];
        console.log(error);
        
        util.warn(that,error.msg);
        that.setData({
          toIndex:"item"+error.param
        })
        return;
    }
    let pageNo = that.data.pageNo;
    if(pageNo==that.data.questionList.length-1){
      //最后一页,可以提交
      //step1 验证是否授权//验证是否提交个人信息
      wx.getSetting({
        withSubscriptions:true,
        success: (res) => {
          console.log(res);
          //未授权,显示授权窗口          
          if (!res.authSetting['scope.userInfo']) { 
            that.setData({
              auth:true
            })
          }else{
            if(wx.getStorageSync('ifAuth')){              
              util.subscribe().then(resp=>{
                util.request(api.EvaluationForm,JSON.stringify(Object.values(that.data.result)),"post").then(res=>{
                  if(res.code==0){
                    that.setData({
                      showCode:true,
                      code:"data:image/png;base64," + res.data.replace(/[\r\n]/g, "")
                    })
                  }
                })
              }
                
              )              
            }else{
              that.setData({
                auth:true
              })
            }
          }
        }
      })   
    }else{
      that.showData(pageNo+1);
    }
  },
  radionChange(e){
    console.log(e);
    let id = e.target.dataset.id;
    let val = e.detail.value;
    let groupSort = e.target.dataset.groupsort;
    let groupName = e.target.dataset.groupname;
    let sort = e.target.dataset.sort;
    let title = e.target.dataset.title;
    let set_key = 'result.' + id;
    let set_val = {
      id:id,
      value:val,
      groupSort:groupSort,
      groupName:groupName,
      title:title,
      sort:sort
    };
    that.setData({
      [set_key]:set_val
    });    
  },
  checkboxChange(e){
    console.log(e);
    let id = e.target.dataset.id;
    let val = e.detail.value;
    let groupSort = e.target.dataset.groupsort;
    let groupName = e.target.dataset.groupname;
    let sort = e.target.dataset.sort;
    let title = e.target.dataset.title;
    let set_key = 'result.' + id;
    let set_val = {
      id:id,
      value:val.join(","),
      groupSort:groupSort,
      groupName:groupName,
      title:title,
      sort:sort
    };
    that.setData({
      [set_key]:set_val
    })
  },
  inputChange(e){
    console.log(e);
    let id = e.target.dataset.id;
    let val = e.detail.value;
    let groupSort = e.target.dataset.groupsort;
    let groupName = e.target.dataset.groupname;
    let sort = e.target.dataset.sort;
    let title = e.target.dataset.title;
    let set_key = 'result.' + id;
    let set_val = {
      id:id,
      value:val,
      groupSort:groupSort,
      groupName:groupName,
      title:title,
      sort:sort
    };
    console.log(set_val);
    that.setData({
      [set_key]:set_val
    })
  },
  pickerChange(e){
    console.log(e);
    let value = e.target.dataset.value;
    let mode = e.target.dataset.mode;
    let id = e.target.dataset.id;
    let val = e.detail.value;
    let groupSort = e.target.dataset.groupsort;
    let groupName = e.target.dataset.groupname;
    let sort = e.target.dataset.sort;
    let title = e.target.dataset.title;
    let set_key = 'result.' + id;

    if(mode=='selector'){
      val = value[val];
    }else if(mode=="region"){
      val = val.join(",");
    }else{
      val = val;
    };
    let set_val = {
      id:id,
      value:val,
      groupSort:groupSort,
      groupName:groupName,
      title:title,
      sort:sort
    };
    console.log(set_val);
    that.setData({
      [set_key]:set_val
    })
  },
  initValidate(rules,messages) {
    that.WxValidate = new WxValidate(rules, messages);
  },
  showData(index){
    let questionbox = that.data.questionList;
    let questions = questionbox[index];
    let rules = {};
    let messages = {};
    let needs = {};
    console.log(questions);
    questions.questionList.forEach(function(q){
      if(q.required){        
        rules[q.groupSort+""+q.sort] = {required: true};
        messages[q.groupSort+""+q.sort] = {required:q.title+"不能为空"}
      }
      if(q.ifNeed){
        let need = q.need.split(",");
        needs[""+need[0]] = needs[""+need[0]]||[];
        needs[""+need[0]].push({id:q.id,val:need[1],groupSort:q.groupSort,sort:q.sort});
      }
    })
    that.initValidate(rules,messages);
    that.setData({
      pageNo:index,
      needs:needs,
      rules:rules,
      messages:messages,
      toIndex:'item'+questions.questionList[0].groupSort+questions.questionList[0].sort,
    });
    wx.setNavigationBarTitle({
      title: questions.name
    })
  },
  onLoad: function(options) {
    that = this;   
    console.log("form--onload");
    var width = wx.getSystemInfoSync().windowWidth;
    util.request(api.QuestionList,{},"get").then(res => {
      let data = res.data;
      that.setData({
        questionList:data,
        codeHeight: width * 0.8 * 0.8 + "px"
      })
      that.showData(0);
    })
  },
  getDatas: function(e) {
    log.info(e);
    console.log(e);
    wx.showLoading({
      mask:true,
      title: '授权中~~',
    })
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.hideLoading();
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        util.prompt(that,"授权失败");
        return false;
      }
      return false;
    };
    util.getCode().then(function(res){
      wx.hideLoading();
      return util.request(api.WxAuth,JSON.stringify({
        code: res,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        signature: e.detail.signature,
        rawData: e.detail.rawData
      }),"post");
    }).then(function(result){
      console.log(result)
      wx.hideLoading();
      //授权成功
      if(result.code==0){
        that.setData({
          auth:false
        })
        wx.setStorageSync('token', result.data.token);
      }else{
        util.warn(that,"授权失败,请稍后再试!");
      }
    }).catch(function(err){
      console.log(2)
      util.warn(that,"授权失败,请稍后再试!");
      wx.hideLoading();
    });
  },
  cancle(){
    that.setData({
      auth:false,
      ifAuth:false
    })
  },
  back(){
    util.back();
  }
})