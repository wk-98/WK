// miniprogram/pages/custom-tab-bar/index.js
Component({
  data: {
    active: 0,
    list: [
      {
        "url": "index",
        "icon": "wap-home-o",
        "text": "首页"
      },
      {
        "url": "concern",
        "icon": "like-o",
        "text": "关注"
      },
      {
        "url": "update",
        "icon": "add-o",
        "text": "发布"
      },
      {
        "url": "news",
        "icon": "friends-o",
        "text": "消息"
      },
      {
        "url": "my",
        "icon": "user-circle-o",
        "text":"我的"
      }
    ]
  },
  methods: {
   onChange(e) {
     
      wx.switchTab({
        url: this.data.list[e.detail].url
      });
   },
   init() {
       const page = getCurrentPages().pop();
       this.setData({
      　  active: this.data.list.findIndex(item => item.url === `/${page.route}`)
       });
      }
       
       
      
   }
});