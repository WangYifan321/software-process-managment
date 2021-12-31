// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
axios.defaults.baseURL = 'http://127.0.0.1:1337/';

import './style/theme.css'
import './style/characters.css'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

Vue.use(ElementUI)

Vue.prototype.$axios = axios;
import QS from 'qs'
Vue.prototype.qs = QS;

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      let sign = 0
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
