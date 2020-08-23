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
    timestamp:'',
    date:'',
    
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
    //console.log("onLoad")
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

 //字数改变触发事件 
 bindTextAreaChange: function (e) {
   let that=this;
   let info = e.detail.value;
   that.setData({     
     value: info,     
    })
  },

  Onsubmit:function(event){
    if (!this.data.logged && event.detail.userInfo) {
      this.setData({
        avatarUrl: event.detail.userInfo.avatarUrl,
        userInfo: event.detail.userInfo
      })
    }
   this.add()
  },

  
  //将数据添加到数据库
  add:function(){
      let this2 = this;
      //上传动态的时间
      this.data.timestamp = Date.parse(new Date());
      this.data.timestamp =this.data.timestamp / 1000;
      //获取当前时间   存储形式（string）年+"-"+月+"-"+日+" "+时+":"+分
      var n = this.data.timestamp * 1000;
      this.data.date = new Date(n);
      //年
      var Y =  this.data.date.getFullYear();
      //月
      var M = ( this.data.date.getMonth() + 1 < 10 ? '0' + ( this.data.date.getMonth() + 1) :  this.data.date.getMonth() + 1);
      //日
      var D =  this.data.date.getDate() < 10 ? '0' +  this.data.date.getDate() :  this.data.date.getDate();
      //时
      var h =  this.data.date.getHours();
      //分
      var m =  this.data.date.getMinutes();
      //console.log("当前时间：" +Y+"-"+M+"-"+D+" "+h+":"+m);
      this.data.timestamp=Y+"-"+M+"-"+D+" "+h+":"+m
    cn.add({
      data:{
        concent:this2.data.value,
        fileList:this2.data.fileList,
        date: this2.data.timestamp,
        time:this2.data.date,
        userInfo:this2.data.userInfo
      }
    }).then(res => {
      console.log("zheli",res)
      wx.showToast({
        title: '已发布',
        icon:'success'
      })  
    })
    //清空页面
    const { fileList = [] } = [];
    this2.setData({ fileList });
    this2.setData({value:""})
    wx.switchTab({
      url: '../index/index',
    })
       console.log("结束发布",this2.data.userInfo)
       }

    })
  
   
