// miniprogram/pages/index/update.js
const db = wx.cloud.database();
const cn = db.collection('cn');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    value:"",
    avatarUrl: '',
    //没授权没获得头像时显示的图片路径./user-unlogin.png
    userInfo: {},
    logged: false,
  },
  onShow: function () {
   
    this.getTabBar().init();
    
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
 //字数改变触发事件 
 bindTextAreaChange: function (e) {
   let that=this;
   let info = e.detail.value;
   that.setData({     
     value: info,     
    })
  },

  Onsubmit:function(event){
    //上传动态的时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间   存储形式（string）年+"-"+月+"-"+日+" "+时+":"+分
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    
    console.log("当前时间：" +Y+"-"+M+"-"+D+" "+h+":"+m);
    timestamp=Y+"-"+M+"-"+D+" "+h+":"+m
    console.log( timestamp);
    cn.add({
      data:{
        concent:this.data.value,
        fileList:this.data.fileList,
        date: timestamp
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '已发布',
        icon:'success'
      })  
    })
    //清空页面
    const { fileList = [] } = [];
    this.setData({ fileList });
    this.setData({value:""})
    wx.switchTab({
      url: '../index/index',
    })
    
  },
  
})