// miniprogram/pages/index/update.js
const db = wx.cloud.database();
const cn = db.collection('cn');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
  },
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    //console.log(event)
    wx.cloud.uploadFile({
      cloudPath: "img/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
      filePath :file.path,
      success: res => {
        // 返回文件 ID
        //console.log(res.fileID);
        //更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data ,name:res.fileID});
        this.setData({ fileList });
        //console.log( fileList);
      },
      fail: console.error
    })
  },
  Ondelete(event){
     console.log(event.detail.file.name)
     wx.cloud.deleteFile({
        fileList:[event.detail.file.name],
        success(res){
          console.log(res,'删除文件')
        },
        fail(err){
        console.log(err)
         }
      })
  //更新 fileList
  const { fileList = [] } = this.data;
  fileList.pop({ url: event.detail.file.path ,name:event.detail.file.name});
  this.setData({ fileList });
  //console.log( fileList);
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  Onsubmit:function(event){
    //console.log( this.data.fileList);
    cn.add({
      data:{
        concent:event.detail.value.content,
        fileList:this.data.fileList
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '已发布',
        icon:'success'
      })
    })
  }
})