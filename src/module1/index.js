import Vue from 'vue'
import router from './router'
import App from './App.vue'

import './common/style/base.css'

new Vue({
  el: '#root',
  router,
  render: h => h(App)
})

// 热加载配置，请无视
if (module.hot) module.hot.accept()
