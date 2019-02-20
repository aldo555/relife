import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import '@/assets/css/tailwind.css'
import EvaIcons from 'vue-eva-icons'
import { createProvider } from './vue-apollo'

Vue.use(EvaIcons)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
