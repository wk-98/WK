// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wk-26412',
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  console.log(wxContext.OPENID)
  let openid = wxContext.OPENID
  let userInfo = ''

  await db.collection('user').where({
    openid:openid
  })
  .get()
  .then(res => {
    console.log("用户表",res)
    if(res.data.length != 0){
      userInfo = res.data[0].userInfo
    }
 
  }).catch(err=>{
    console.log(err)
  })
  // {
  //   success :res =>{
  //        console.log("用户表",res)
  //   if(res.data.length != 0){
  //       event = res.data[0].userInfo
  //   }
  //   },
  //   fail: err=>{
  //     console.error('[数据库] [查询记录] 失败：', err)
  //   }
  // }
  return {
    userInfo:userInfo,
    openid: openid,
    avatarUrl:userInfo.avatarUrl
  }


}