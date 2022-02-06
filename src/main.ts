import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import Moralis from "moralis/dist/moralis.min.js";

Vue.config.productionTip = false

const serverUrl = process.env.VUE_APP_MORALIS_SERVER_URL;
const appId = process.env.VUE_APP_MORALIS_APPLICATION_ID;

Moralis.start({ serverUrl, appId });
// Moralis.settings.setAPIRateLimit({ anonymous: 150, authenticated: 150, windowMs:60000 })

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount(`#app`)
