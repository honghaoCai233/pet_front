export default {
  pages: [
    'pages/index/index',
    'pages/pet-list/index',
    'pages/pet-detail/index',
    'pages/user-center/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarTitleText: '宠物管理',
    navigationStyle: 'custom'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      iconPath: "./assets/icons/home.png",
      selectedIconPath: "./assets/icons/home-active.png"
    },{
      pagePath: "pages/user-center/index",
      text: "我的",
      iconPath: "./assets/icons/user.png",
      selectedIconPath: "./assets/icons/user-active.png"
    }]
  }
} 