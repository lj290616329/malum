//index.js
//获取应用实例
import websocket from '../../utils/websocket.js';
var API = require('../../config/api.js');
var util = require('../../utils/util.js');
var that;
Page({
  data: {    
  },
  onLoad: function (options) {
    that = this;    
    console.log(options)
    that.chatInitData(options.id);
  },
  chatInitData(toid){
    util.sendAjax(that,API.ChatInitData+toid,{},"get",function(result){
      let chatLogs = result.data.chatlog['friend'+result.data.to.id]||[];
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
  /* 下载文件,发现bug 返回时会微信崩溃
  down(e){
    console.log(e);
    wx.getSavedFileList({  // 获取文件列表
      success(res) {
        res.fileList.forEach((val, key) => { // 遍历文件列表里的数据
          // 删除存储的垃圾数据
          wx.removeSavedFile({
            filePath: val.filePath
          });
        })
      }
    })
    wx.downloadFile({
      url: e.target.dataset.src,
      success (res) {
        console.log(res);
        console.log("success");
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          let filePath = res.tempFilePath;
          console.log(filePath);
          wx.saveFile({
            tempFilePath: filePath,
            success(res) {
              console.log("save success");
              console.log(res);

              const savedFilePath = res.savedFilePath;
              // 打开文件
              wx.openDocument({
                filePath: savedFilePath,
                showMenu:true,
                success: function (res) {
                  console.log(res)
                  console.log('打开文档成功')
                },
                fail(fail){
                  console.log(fail)
                  console.log("open fail")
                }
              })

              
            },
            fail(fail){
              console.log("downfail");
              console.log(fail);
            }
          })
        }
      },
      fail:function(fail){
        console.log(fail)
        console.log("fail")
      },
      complete:function(result){
        console.log("jieshu")
      }
    })
  },*/
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
        util.warn(that,"发送失败");
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
      url: API.Websocket+Mine.id+"/1",
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
        chatLog.timestamp = util.newTime();
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
      url: API.Websocket+that.data.Mine.id+"/1",
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
        chatLog.timestamp = util.newTime();
        chatLogs.push(chatLog);
        that.setData({
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length
        })
      },
      fail(res){
        util.warn(that,"发送失败");
        that.linkWebsocket();
        console.log("失败");
        console.log(res);
      }
    })
  }
});