require('./bootstrap');
window.Vue = require('vue')
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
import common from './common'
Vue.mixin(common)
import Editor from 'vue-editor-js/src/index'
Vue.use(Editor)
import jsonToHtml from './jsonToHtml'
Vue.mixin(jsonToHtml)



Vue.component('mainapp', require('./components/mainapp.vue').default)
const app = new Vue({
    el: '#app', 
    router, 
    store
})
