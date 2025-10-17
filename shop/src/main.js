import './assets/main.css'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.config.devtools = false
app.use(router)

// ⚡ 正確建立 Pinia 實例並使用插件
const pinia = createPinia()
pinia.use(piniaPersistedState)
app.use(pinia)

app.mount('#app')
