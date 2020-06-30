App({
  onLaunch() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              wx.setStorageSync('userInfo', res.userInfo);
            },
            fail: function (err) {
              console.log(err);              
            }
          })
        }
      }
    })
  },
  globalData: {
    newsLists:{},
    shareMessage: {
      title: '胆囊息肉慢病智慧管理系统',
      imageUrl: '/images/share_img.png',
      path: '/pages/index/index',
    } 
  }
})