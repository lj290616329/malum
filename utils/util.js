var api = require('../config/api.js');
var log = require('log.js');
const newTime = () => {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function back() {
  wx.navigateBack({
    delta: 1
  })
};
/**
 * 微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    return getCode().then(function(res){
      wx.request({
        url: api.WxLogin,
        method: 'get',
        data:{code:res},
        dataType: 'json',
        success: function (result) {
          if(result.statusCode==200){
            resolve(result.data);
          }else{
            reject(result);
          }              
        }
      })
    });
  })
};

/**
 * wx.login
 * 获取code
 */
function getCode() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
};
/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log(res);
              if (res.errMsg === 'getUserInfo:ok') {
                resolve(res);
                wx.setStorageSync('userInfo', res.userInfo);
              } else {
                reject(res)
              }
            },
            fail: function (err) {
              console.log(err);
              reject(err);
            }
          })
        }else{
          reject({code:-1,errMsg:"用户未进行授权,无法获取权限"});
        }
      }
    })    
  });
};

/**
 * 授权
 */
function auth(){
  return new Promise(function (resolve, reject) {
    let code  = null;
    return getCode().then((res) => {
      code = res;
      return getUserInfo();
    }).then((userInfo) => {
      wx.request({
        url: api.WxAuth,
        data: JSON.stringify({
          code: code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          signature: userInfo.signature,
          rawData: userInfo.rawData
        }),
        method: 'POST',
        contentType: 'application/json;charset=UTF-8',
        header: {
          'content-type': 'application/json'
        },
        success: function (result) {
          if(result.statusCode==200){
            resolve(result.data);
          }else{
            reject(result);
          }                            
        },fail: function (err) {
          reject(err)
          console.log("failed")
        }
      })
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
};

function subscribe(){
  return new Promise(function (resolve, reject) {
    let tmpIds = [
      "iNbbQStWha87QupCzPHTmFU54qBed2aMkzB-dv0fDAo",
      "Uw13UmFttdBbvz3YDHNQ1VghuFaoUUFOa2oEH3c-nqE"
    ];
    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
        tmplIds: tmpIds,
        success (res) {
          console.log(res);
          console.log("获取success");
          let acceptTmpList = [];
          for(let i = 0; i < tmpIds.length; i++ ){
            let tmpId = tmpIds[i];
            if(res[tmpId] == "accept"){
              acceptTmpList.push(tmpId);
            }
          }
          wx.request({
            url: api.SubscribeMessage,
            data: acceptTmpList.join(","),
            method: 'POST',
            contentType: 'application/json;charset=UTF-8',
            header: {
              'content-type': 'application/json',
              'token':wx.getStorageSync('token')||""
            },
            success: function (result) {
              if(result.statusCode==200){
                resolve(result.data);
              }else{
                reject(result);
              }                            
            },fail: function (err) {
              reject(err)
              console.log("failed")
            }
          })
        },
        fail(fres){
          console.log(fres)
          console.log("fail");
          resolve("fail");
        },
        complete(cres){
          console.log(cres);
          console.log("complete")
          let acceptTmpList = [];
          for(let i = 0; i < tmpIds.length; i++ ){
            let tmpId = tmpIds[i];
            if(cres[tmpId] == "accept"){
              acceptTmpList.push(tmpId);
            }
          }
          wx.request({
            url: api.SubscribeMessage,
            data: acceptTmpList.join(","),
            method: 'POST',
            contentType: 'application/json;charset=UTF-8',
            header: {
              'content-type': 'application/json',
              'token':wx.getStorageSync('token')||""
            },
            success: function (result) {
              if(result.statusCode==200){
                resolve(result.data);
              }else{
                reject(result);
              }                            
            },fail: function (err) {
              reject(err)
              console.log("failed")
            }
          })
         }
      });
    }else{
      resolve("result.data");
    }
  })
}
/**
 * 封装微信的的request 设计版
 * 统一处理一下异常
 * token过期重新获取
 * that 页面对象
 * url url
 * data 请求参数
 * type 请求类型
 * ft 成功执行的方法
 */
let retry = 0;
function sendAjax(that,url,data,type,ft){  
  log.info({url:url,data:data,type:type});
  wx.showLoading({
    title: '请稍后',
    mask:true
  })
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: type,
      header: {
        'Content-Type': 'application/json',
        'token':wx.getStorageSync('token')||""
      },
      dataType:"json",
      success: function (res) {
        log.info(res);
        console.log(res);        
        if (res.statusCode == 200) {
          /**/
          if (res.data.code == 401) {
            console.log("重新获取token 然后在进行")
            //需要登录后才可以操作
            if(retry>2){
              resolve(res);
            }else{
              auth().then((result) => {
                retry++;  
                console.log(result);
                wx.setStorageSync('token', result.data.token);
                sendAjax(that,url,data,type,ft);  
              });
            }
          } else {
            retry = 0;
            resolve(res.data);
          }
        } else {
          reject({code:999,msg:res});
        }
      },
      fail: function (err) {
        wx.hideLoading();
        reject({code:999,msg:err});
        console.log("failed")
      }
    })
  });
  wx.hideLoading();
  promise.then(res=>{
    log.info(res);
    if(res.code==0){
      ft(res)
    }else if(res.code==-1||res.code == 400){
      warn(that,res.msg)
    }else{
      prompt(that,res.msg)
    }
  }).catch((err) => {
    console.log(err);
    prompt(that,JSON.stringify(err))
  });
};
function prompt(that,msg){
  that.setData({
    prompt:true,
    promptMsg:msg
  })
};

/**
 * 封装微信的的request
 * token过期重新获取
 */
function request(url, data = {}, method = "GET") {
  log.info(data);
  wx.showLoading({
    title: '请稍后',
    mask:true
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'token':wx.getStorageSync('token')||""
      },
      dataType:"json",
      success: function (res) {
        log.info(res);
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          /**/
          console.log()
          if (res.data.code == 401) {
            console.log("重新获取token 然后在进行")
            //需要登录后才可以操作
            return auth().then((result) => {
              console.log("auth"+result);
              wx.setStorageSync('token', result.data.token);
              request(url,data,method).then(function(res){
                resolve(res);
              });             
            }).catch(function(err){
              console.log(4);
              reject(err);
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        reject(err)
        console.log("failed")
      }
    })
  });
};
//提示
function warn(that, warnMsg) {
  that.setData({
    warn: true,
    warnMsg: warnMsg
  });
  setTimeout(function () {
    that.setData({
      warn: false,
      warnMsg: ''
    })
  }, 1500);
};

module.exports = {
  newTime,
  login,
  auth,
  getCode,
  getUserInfo,
  request,
  warn,
  back,
  subscribe,
  sendAjax
}
