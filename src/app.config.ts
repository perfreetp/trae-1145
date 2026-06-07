export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/demand/index',
    'pages/product/index',
    'pages/mine/index',
    'pages/intention/index',
    'pages/compliance/index',
    'pages/progress/index',
    'pages/dataDetail/index',
    'pages/demandDetail/index',
    'pages/inquiry/index',
    'pages/collection/index',
    'pages/message/index',
    'pages/evaluation/index',
    'pages/contact/index',
    'pages/history/index',
    'pages/publishProduct/index',
    'pages/publishDemand/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2563EB',
    navigationBarTitleText: '数链通',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/demand/index',
        text: '需求'
      },
      {
        pagePath: 'pages/product/index',
        text: '产品'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
