// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  db.collection('user').add({
    data:{
      openid: wxContext.OPENID,
      userInfo:event.userInfo,
    }
  }).then ( res => {
    console.log("添加成功")
  }).catch(err =>{
    console.error(err)
  })

  return {
    openid: wxContext.OPENID
  }
}