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
   
    
    
  },
  //上传照片
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
        console.log( fileList);
      },
      fail: console.error
    })
  },
  //删除照片
  Ondelete(event){

    let this1 = this
    console.log("sdx",event)

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
  fileList.splice(event.detail.index,1);    //[].splice删除指定的数组元素
  this.setData({ fileList });
  //console.log( fileList);*/url: event.detail.file.path ,name:event.detail.file.name
  },
  onLoad: function() {
    //console.log("onLoad")

      // 检查用户授权情况
      /*wx.getSetting({

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
      })*/
  },

 //字数改变触发事件 
 bindTextAreaChange: function (e) {
   let that=this;
   let info = e.detail.value;
   that.setData({     
     value: info,     
    })
  },

  //提交发布数据，已授权直接发布

  Onsubmit:function(event){
    //不能发布空内容
    if(this.data.value != '' || this.data.fileList.length != 0){
       const app =getApp()
    if (event.detail.userInfo) {
      this.setData({
        avatarUrl: event.detail.userInfo.avatarUrl,

        userInfo: event.detail.userInfo,
      })
     // console.log("app.globalData:",app.globalData.openid)
     //第一次授权，将用户信息写进全局变量中
      if(!app.globalData.openid){
        app.globalData.avatarUrl = this.data.avatarUrl
          app.globalData.userInfo = this.data.userInfo
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user : ', res)
              //console.log('[云函数] [login] user openid: ', res.result.openid)
              app.globalData.openid = res.result.openid
            
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
          
      }

      this.add()
    }else{
      wx.showModal({
        title: '提示',
        content: '发布动态需要获取您的用户信息，您拒绝了授权，如需发布请重新进行授权发布',
        confirmText:'重新发布',
        showCancel: false,
      })
    }

    }else{
      wx.showModal({
        title: '提示',
        content: '不能发布空内容',
      })
    }
   

  
  },
  //将数据添加到数据库
  add:function(){

    const app = getApp()

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
    //数据库插入数据操作
    cn.add({
      data:{
        concent:this.data.value,
        fileList:this.data.fileList,
        date: this.data.timestamp,
        time:this.data.date,
        userInfo:this.data.userInfo
      }
    }).then(res => {      // 插入成功
      //console.log("z发布成功",res)
      app.flag=3,

      wx.showToast({
        title: '已发布',
        icon:'success'
      })
      wx.switchTab({
        url: '../index/index',
      })
    }).catch(err => {     //插入失败
        // 插入数据失败
        console.log(err)
      })  
    //清空页面
    const { fileList = [] } = [];
    this.setData({ fileList });
    this.setData({value:""})

  },
})

  
   
