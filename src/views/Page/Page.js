import Vue from 'vue'
import Page from './Page.vue'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(Page)
}).$mount('#page-box')
