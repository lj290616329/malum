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
  }
})