import DefaultTheme from 'vitepress/theme'
import ServerStatus from '../components/ServerStatus.vue'
import vdiv from '../components/vdiv.vue'
import Layout from '../components/Layout.vue'
import donate from '../components/donate.vue'
import './index.css'

export default {
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ServerStatus', ServerStatus)
    app.component('vdiv', vdiv)
    app.component('donate', donate)
  }
  
}
