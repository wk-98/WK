// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wk-26412'
})
const db = cloud.database()
// 云函数入口函数 type:1是点赞，2是取消点赞，3是评论，4是删除评论，5是关注，6是取消关注
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event) 
  await db.collection('message').add({
    data : {
      type:event.type,
      B_openid:event.B_openid,      //被（点赞/关注/评论）人的openid
      _openid:wxContext.OPENID,     //发起点赞/关注/评论）人的openid
      status:0,                     //消息读取状态，0未读取
      DT_id:event._id,
      time:event.time
    },
    succes : res =>{
      // 在返回结果中会包含新创建的记录的 _id
      console.log("添加成功",res)
    },
    fail : err =>{
      console.error("插入失败",err)
    }
  })  
}


//消息表，发生点赞或者评论事件时，插入消息记录
