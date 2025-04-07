<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <div id="content-page" class="content-public-page" :class="horizontal ? 'ml-0' : ''">
        <transition name="router-anim" :enter-active-class="`animated ${animated.enter}`" mode="out-in"
                    :leave-active-class="`animated ${animated.exit}`">
          <router-view/>
        </transition>
      </div>
    </div>
    <FooterStyle1>
      <template v-slot:left>
      </template>
      <template v-slot:right>
        Copyright 2021 <a href="#">El Príncipe Azul</a> All Rights Reserved.
      </template>
    </FooterStyle1>
  </div>
</template>
<script>
import Loader from '../components/vito/loader/Loader'
// import NavBarStyle1 from '../components/vito/navbars/NavBarStyle1'
import MenuTaller from '../FackApi/json/SideBarTaller'
import MenuVentas from '../FackApi/json/SideBarVentas'
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profile from '../assets/images/user/user-1.jpeg'
import loader from '../assets/images/loader.gif'
import darkLoader from '../assets/images/darkMode/dark-logo.gif'
import { vito } from '../config/pluginInit'
import { Users } from '../FackApi/api/chat'
import { mapGetters, mapActions } from 'vuex'
let body = document.querySelector('body')
export default {
  name: 'PublicLayout',
  components: {
    Loader
    // NavBarStyle1
  },
  mounted () {
    const role = localStorage.getItem('role')
    this.$i18n.locale = 'sp'
    this.updateRadio()
    body.classList.remove('sidebar-main-active')
    body.classList.remove('right-column-fixed')
    if (role === 'taller' || role === 'design') {
      this.verticalMenu = MenuTaller
    }
    if (role === 'ventas') {
      this.verticalMenu = MenuVentas
    }
    if (this.$route.meta.dark) {
      body.classList.add('dark')
      body.classList.remove('light')
      this.logo = darkLoader
    } else {
      body.classList.add('light')
      body.classList.remove('dark')
      this.logo = loader
    }
  },
  computed: {
    ...mapGetters({
      cartCount: 'Ecommerce/cartCountState',
      cartItems: 'Ecommerce/cartState',
      selectedLang: 'Setting/langState',
      langsOptions: 'Setting/langOptionState',
      darkMode: 'Setting/darkModeState',
      colors: 'Setting/colorState'
    })
  },
  watch: {
  },
  // sidebarTicket
  data () {
    return {
      horizontal: false,
      mini: false,
      animated: { enter: 'zoomIn', exit: 'zoomOut' },
      animateClass: [
        { value: { enter: 'zoomIn', exit: 'zoomOut' }, text: 'Zoom' },
        { value: { enter: 'fadeInUp', exit: 'fadeOutDown' }, text: 'Fade' },
        { value: { enter: 'slideInLeft', exit: 'slideOutRight' }, text: 'Slide' },
        { value: { enter: 'rotateInDownLeft', exit: 'rotateOutDownLeft' }, text: 'Roll' }
      ],
      horizontalMenu: HorizontalItems,
      userProfile: profile,
      logo: loader,
      usersList: Users,
      rtl: false,
      message: [
        { image: require('../assets/images/user/user-01.jpg'), name: 'Nik Emma Watson', date: '13 jan' },
        { image: require('../assets/images/user/user-02.jpg'), name: 'Greta Life', date: '14 Jun' },
        { image: require('../assets/images/user/user-03.jpg'), name: 'Barb Ackue', date: '16 Aug' },
        { image: require('../assets/images/user/user-04.jpg'), name: 'Anna Sthesia', date: '21 Sept' },
        { image: require('../assets/images/user/user-05.jpg'), name: 'Bob Frapples', date: '29 Sept' }
      ],
      notification: [
        { image: require('../assets/images/user/user-01.jpg'), name: 'Nik Emma Watson', date: '23 hour ago', description: 'Enjoy smart access to videos, games' },
        { image: require('../assets/images/user/user-02.jpg'), name: 'Greta Life', date: '14 hour ago', description: 'Google Chromecast: Enjoy a world of entertainment' },
        { image: require('../assets/images/user/user-03.jpg'), name: 'Barb Ackue', date: '16 hour ago', description: 'Dell Inspiron Laptop: Get speed and performance from' },
        { image: require('../assets/images/user/user-04.jpg'), name: 'Anna Sthesia', date: '21 hour ago', description: 'Deliver your favorite playlist anywhere in your home ' },
        { image: require('../assets/images/user/user-05.jpg'), name: 'Bob Frapples', date: '11 hour ago', description: 'MacBook Air features up to 8GB of memory, a fifth-generation' }
      ]
    }
  },
  methods: {
    dark () {
      body.classList.remove('light')
      body.classList.add('dark')
      this.modeChange(true)
      this.logo = darkLoader
    },
    light () {
      body.classList.remove('dark')
      body.classList.add('light')
      this.modeChange(false)
      this.logo = loader
    },
    updateRadio () {
      this.horizontal = this.$store.getters['Setting/horizontalMenuState']
      this.mini = this.$store.getters['Setting/miniSidebarState']
    },
    sidebarHorizontal () {
      this.$store.dispatch('Setting/horizontalMenuAction')
      this.updateRadio()
    },
    sidebarMini () {
      vito.triggerSet()
      this.$store.dispatch('Setting/miniSidebarAction')
      this.updateRadio()
    },
    rtlChange (mode) {
      this.rtl = mode
      if (this.rtl) {
        this.rtlRemove()
      } else {
        this.rtlAdd()
      }
      if (this.darkMode) {
        body.classList.add('dark')
        body.classList.remove('light')
        this.logo = darkLoader
      } else {
        body.classList.add('light')
        body.classList.remove('dark')
        this.logo = loader
      }
    },
    changeColor (code) {
      document.documentElement.style.setProperty('--iq-primary', code.primary)
      document.documentElement.style.setProperty('--iq-primary-light', code.primaryLight)
      if (this.darkMode) {
        document.documentElement.style.setProperty('--iq-bg-dark-color', code.bodyBgDark)
      } else {
        document.documentElement.style.setProperty('--iq-bg-light-color', code.bodyBgLight)
      }
    },
    reset () {
      this.changeColor({ primary: '#827af3', primaryLight: '#b47af3', bodyBgLight: '#efeefd', bodyBgDark: '#1d203f' })
      this.animated = { enter: 'zoomIn', exit: 'zoomOut' }
      this.light()
    },
    logout () {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      this.$router.push({ name: 'auth1.sign-in1' })
    },
    ...mapActions({
      removeToCart: 'Ecommerce/removeToCartAction',
      langChangeState: 'Setting/setLangAction',
      rtlAdd: 'Setting/setRtlAction',
      rtlRemove: 'Setting/removeRtlAction',
      modeChange: 'Setting/darkModeAction'
    })
  }
}
</script>
<style>
  @import url("../assets/css/custom.css");
  @import url("../assets/css/PriceSlider.css");
  .content-public-page {
    margin-left: 0px;
    overflow: hidden;
    padding: 0;
    min-height: 100vh;
    -webkit-transition: all 0.3s ease-out 0s;
  }
</style>
