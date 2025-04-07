<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1 :items="verticalMenu" :horizontal="horizontal" :logo="logo" @toggle="sidebarMini" />
      <!-- TOP Nav Bar -->
      <NavBarStyle1 title="Dashboard" :homeURL="{ name: 'dashboard1.home' }" @toggle="sidebarMini" :logo="logo" :horizontal="horizontal" :items="horizontalMenu">
        <template slot="responsiveRight">
          <ul class="navbar-nav ml-auto navbar-list">
            <li class="nav-item">
              <a href="javascript:void(0)" class="iq-waves-effect" :class="cartCount > 0 ? 'search-toggle' : ''">
              </a>
            </li>
            <li class="nav-item">
              <div class="iq-sub-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0 ">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white">{{ $t('nav.allNotifications') }}<small class="badge  badge-light float-right pt-1">4</small></h5>
                    </div>
                    <a href="#" class="iq-sub-card" v-for="(item, index) in notification" :key="index">
                      <div class="media align-items-center">
                        <div class="">
                          <img class="avatar-40 rounded" :src="item.image" alt="img">
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0 ">{{ item.name }}</h6>
                          <small class="float-right font-size-12">{{ item.date }}</small>
                          <p class="mb-0">{{ item.description.substring(0,40) + '...' }}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
        <template slot="right">
          <ul class="navbar-list">
            <li>
              <a href="#" class="search-toggle iq-waves-effect d-flex align-items-center">
                <img :src="userProfile" class="img-fluid rounded mr-3" alt="user">
                <div class="caption">
                  <h6 class="mb-0 line-height">Nik jone</h6>
                  <span class="font-size-12">{{ $t('nav.user.available') }}</span>
                </div>
              </a>
              <div class="iq-sub-dropdown iq-user-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0 ">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white line-height">Hello Nik jone</h5>
                      <span class="text-white font-size-12">{{ $t('nav.user.available') }}</span>
                    </div>
                    <a href="#" class="iq-sub-card iq-bg-primary-hover">
                      <div class="media align-items-center">
                        <div class="rounded iq-card-icon iq-bg-primary">
                          <i class="ri-file-user-line"></i>
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0 ">{{ $t('nav.user.profileTitle') }}</h6>
                          <p class="mb-0 font-size-12">{{ $t('nav.user.profileSub') }}</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" class="iq-sub-card iq-bg-primary-success-hover">
                      <div class="media align-items-center">
                        <div class="rounded iq-card-icon iq-bg-success">
                          <i class="ri-profile-line"></i>
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0 ">{{ $t('nav.user.profileEditTitle') }}</h6>
                          <p class="mb-0 font-size-12">{{ $t('nav.user.profileEditSub') }}</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" class="iq-sub-card iq-bg-primary-danger-hover">
                      <div class="media align-items-center">
                        <div class="rounded iq-card-icon iq-bg-danger">
                          <i class="ri-account-box-line"></i>
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0 ">{{ $t('nav.user.accountSettingTitle') }}</h6>
                          <p class="mb-0 font-size-12">{{ $t('nav.user.accountSettingSub') }}</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" class="iq-sub-card iq-bg-primary-secondary-hover">
                      <div class="media align-items-center">
                        <div class="rounded iq-card-icon iq-bg-secondary">
                          <i class="ri-lock-line"></i>
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0 ">{{ $t('nav.user.privacySettingTitle') }}</h6>
                          <p class="mb-0 font-size-12">{{ $t('nav.user.privacySettingSub')}}</p>
                        </div>
                      </div>
                    </a>
                    <div class="d-inline-block w-100 text-center p-3">
                      <a class="iq-bg-danger iq-sign-btn" href="javascript:void(0)" @click="logout" role="button">{{ $t('nav.user.signout') }}
                        <i class="ri-login-box-line ml-2"></i>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </NavBarStyle1>
      <!-- TOP Nav Bar END -->
      <div id="content-page" class="content-page" :class="horizontal ? 'ml-0' : ''">
        <b-container fluid="" v-if="$route.name !== 'dashboard.home-2'">
          <b-row>
            <BreadCrumb />
          </b-row>
        </b-container>
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
import SideBarStyle1 from '../components/vito/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/vito/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
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
  name: 'Layout1',
  components: {
    Loader,
    SideBarStyle1,
    NavBarStyle1
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
      verticalMenu: SideBarItems,
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
</style>
