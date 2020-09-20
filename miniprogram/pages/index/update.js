// miniprogram/pages/index/update.js
const db = wx.cloud.database();
const cn = db.collection('cn');
const app = getApp();
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
    if(app.logged){
      this.setData({
        avatarUrl:app.globalData.avatarUrl
      })
    }else(
      this.setData({
        avatarUrl:"./user-unlogin.png"
      })
      
    )
    
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
    if(app.logged){
      this.setData({
        avatarUrl:app.globalData.avatarUrl
      })
    }else(
      this.setData({
        avatarUrl:"./user-unlogin.png"
      })
      
    )
  
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
    if(app.logged){
      if(this.data.value != '' || this.data.fileList.length != 0){
        this.add()
      }else{
        wx.showModal({
          title: '提示',
          content: '不能发布空内容',
          confirmText:'重新发布',
          showCancel: false,
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '发布动态需要获取您的用户信息，请先登录',
        confirmText:'登录',
        showCancel: false,
      })
    }
  },
  nothing:function(){
    wx.showModal({
      title: '提示',
      content: '不能发布空内容',
      confirmText:'重新发布',
      showCancel: false,
    })
  },
  //将数据添加到数据库
  add:function(){
    let this1 = this
    wx.cloud.callFunction({
      name:'time',
      data:{
      },
      success : res =>{
        console.log(res)
          this1.data.timestamp = res.result.timestamp,
          this1.data.date = res.result.date
    cn.add({
      data:{
        concent:this.data.value,
        fileList:this.data.fileList,
        date: this.data.timestamp,
        time:this.data.date,
        userInfo:app.globalData.userInfo,
        Bnum:0,
        Dnum:0
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
    }
    })
  }
})

  
   
