import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/music'
  },
  {
    path: '/music',
    component: () => import('pages/music'),
    redirect: '/music/video',
    children: [
      {
        path: '/music/video', // 摄像头
        component: () => import('pages/video/video'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/music/playlist', // 正在播放列表
        component: () => import('pages/playList/playList'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/music/userlist', // 我的歌单
        component: () => import('pages/userList/userList'),
        meta: {
          title: '我的歌单',
          keepAlive: true
        }
      },
      {
        path: '/music/toplist', // 排行榜列表
        component: () => import('pages/topList/topList'),
        meta: {
          title: '排行榜',
          keepAlive: true
        }
      },
      {
        path: '/music/details/:id', // 音乐详情列表
        component: () => import('pages/details/details')
      },
      {
        path: '/music/historylist', // 我听过的列表
        component: () => import('pages/historyList/historyList'),
        meta: {
          title: '我听过的'
        }
      },
      {
        path: '/music/likelist', // 喜欢歌曲列表
        component: () => import('pages/likeList/likeList'),
        meta: {
          title: '我听过的'
        }
      },
      {
        path: '/music/search', // 搜索
        component: () => import('pages/search/search'),
        meta: {
          title: '搜索',
          keepAlive: true
        }
      },
      {
        path: '/music/comment/:id', // 音乐评论
        component: () => import('pages/comment/comment'),
        meta: {
          title: '评论详情'
        }
      }
    ]
  }
]

export default new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
})
