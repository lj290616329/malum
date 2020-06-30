//index.js
//获取应用实例
import websocket from '../../utils/websocket.js';
var API = require('../../config/api.js');
var Util = require('../../utils/util.js');
var that;
Page({
  data: {    
  },
  onLoad: function (options) {
    that = this;    
    that.chatInitData(options.id);
  },
  chatInitData(toid){
    Util.request(API.ChatInitData+toid,{},"get").then(function(result){
      console.log(result)
      if(result.code==0){
        console.log(result.data);
        let chatLogs = result.data.history['friend'+result.data.to.id]||[];
        that.setData({
          Mine:result.data.mine,
          To:result.data.to,
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length
        });
        wx.setNavigationBarTitle({
          title: '与'+ result.data.to.username+'的对话'
        });        
        that.websocket(result.data.mine);
      }else{
        wx.showModal({
          content:result.msg,
          showCancel:false,
          success(res){
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }).catch(function(err){
      console.log(err);
      wx.showModal({
        content:"出错了",
        showCancel:false,
        success(res){
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    });   
  },
  //点击发送
  send(e){
    if(e.detail.value){
      that.sendWebSocketMsg(e.detail.value);
      that.setData({
        inputVal:""
      })
    }
  },
  onShow(){   
    if(that.data.Mine!=undefined){
      that.linkWebsocket();
    }
  },
  onHide(){
    //程序后台后的操作--关闭websocket连接
    that.websocket.closeWebSocket();
  },
  addPic(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        const tempFilePaths = res.tempFiles;
        that.uploadFilebase64(tempFilePaths[0]);
      }
    })
  },
  uploadFilebase64: function (filePath){
    console.log(filePath)    
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: API.UploadPic,
      filePath: filePath.path, 
      name: 'file',
      header: {"Content-Type": "multipart/form-data" },
      success: function (res) {
        console.log(res);
        if (res.statusCode != 200) { 
          wx.showModal({
            title: '提示',
            content: '发送失败',
            showCancel: false
          })
          return;
        }
        var data = JSON.parse(res.data);
        if(data.code==0){
          that.sendWebSocketMsg("img["+data.data.src+"]");
        }        
      },
      fail: function (e) {
        console.log(e);
        Util.warn(that,"发送失败");
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },
  preview(e){
    console.log(e);
    wx.previewImage({
      urls: [e.target.dataset.src],
    })
  },
  onUnload(){
    that.websocket.closeWebSocket();
  },
  websocket(Mine){
    wx.showLoading({
      title: '正在连接中...',
    }); 
    //创建websocket对象
    that.websocket = new websocket({
      //true代表启用心跳检测和断线重连
      heartCheck: true,
      isReconnection: true
    });
    // 监听websocket状态
    that.websocket.onSocketClosed({
      url: API.Websocket+Mine.id,
      success(res) {        
        console.log("state:"+res);
      },
      fail(err) { 
        console.log(err);
      }
    });
    // 监听网络变化
    that.websocket.onNetworkChange({
      url: API.Websocket+Mine.id,
      success(res) { console.log(res) },
      fail(err) { console.log(err) }
    });
    // 监听服务器返回
    that.websocket.onReceivedMsg(result => {
      console.log('app.js收到服务器内容：' + result.data);
      // 要进行的操作
      let chatMessage = JSON.parse(result.data);      
      if(chatMessage.type==="chatMessage"){
        let chatLogs = that.data.chatLogs;
        let chatLog = chatMessage.data;
        chatLog.timestamp = Util.newTime();
        chatLogs.push(chatLog);
        that.setData({
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length
        })
      }
    });
    that.linkWebsocket();
  },
  linkWebsocket() {
    // 建立连接
    that.websocket.initWebSocket({
      url: API.Websocket+that.data.Mine.id,
      success(res) { console.log(res);
        wx.showToast({
          title: '连接成功!',
        });
        wx.hideLoading(); },
      fail(err) {
        console.log(err); 
        wx.showToast({
          title: '连接失败,重连中~~',
        }); 
      }
    })
  },  
  sendWebSocketMsg(msg){
    let data = JSON.stringify({"type":"chatMessage","data":{
      "username":that.data.Mine.username,
      "avatar":that.data.Mine.avatar,
      "id":that.data.To.id,
      "type":"friend",
      "content":msg,
      "fromid":that.data.Mine.id,
      "toid":that.data.To.id
    }});
    console.log(data);
    //发送消息
    that.websocket.sendWebSocketMsg({
      data:data,
      success(res){
        let chatLogs = that.data.chatLogs;
        let chatLog = JSON.parse(data).data;
        chatLog.mine = true;
        chatLog.timestamp = Util.newTime();
        chatLogs.push(chatLog);
        that.setData({
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length
        })
      },
      fail(res){
        Util.warn(that,"发送失败");
        that.linkWebsocket();
        console.log("失败");
        console.log(res);
      }
    })
  }
});