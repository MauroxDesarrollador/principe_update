<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />

    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1
        :items="verticalMenu"
        :horizontal="horizontal"
        :logo="logo"
        @toggle="sidebarMini"
        :toggleButton="false"
      />
      <!-- TOP Nav Bar -->
      <NavBarStyle1
        title="Dashboard"
        :homeURL="{ name: 'dashboard1.home' }"
        @toggle="sidebarMini"
        :logo="logo"
        :horizontal="horizontal"
        :items="horizontalMenu"
      >
        <template slot="responsiveRight">
          <ul class="navbar-nav ml-auto navbar-list">
            <li class="nav-item">
              <a class="search-toggle iq-waves-effect language-title" href="#">
                <img
                  :src="selectedLang.image"
                  alt="img-flaf"
                  class="img-fluid mr-1"
                  style="height: 16px; width: 16px;"
                />
                {{ selectedLang.title }}
                <i class="ri-arrow-down-s-line"></i>
              </a>
              <div class="iq-sub-dropdown">
                <a
                  class="iq-sub-card"
                  href="javascript:void(0)"
                  v-for="(lang, i) in langsOptions"
                  :key="`Lang${i}`"
                  @click="langChange(lang)"
                >
                  <img :src="lang.image" alt="img-flaf" class="img-fluid mr-2" />
                  {{ lang.title }}
                </a>
              </div>
            </li>
            <li class="nav-item">
              <a
                href="javascript:void(0)"
                class="iq-waves-effect"
                :class="cartCount > 0 ? 'search-toggle' : ''"
              >
                <i class="ri-shopping-cart-2-line" />
                <span class="menu-tag ml-2">{{ cartCount }}</span>
              </a>
              <div class="iq-sub-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white">{{ $t('nav.allCarts') }}</h5>
                    </div>
                    <div class="iq-sub-card" v-for="(item, index) in cartItems" :key="index">
                      <div class="media align-items-center">
                        <div class="w-20 text-center d-none justify-content-center d-md-block">
                          <img
                            :src="item.image"
                            :alt="item.name"
                            class="w-100 align-self-center mr-3"
                          />
                        </div>
                        <div class="media-body ml-3">
                          <b-button
                            variant=" iq-bg-danger mt-3"
                            size="sm"
                            class="float-right"
                            @click="removeToCart(item)"
                          >X</b-button>
                          <h6 class="mb-0">{{ item.name.substring(0,20) + '...' }}</h6>
                          <p
                            class="mb-0 font-size-12"
                          >{{ item.description.substring(0,20) + '...' }}</p>
                          <p class="mb-0">
                            <b>$ {{ item.price }}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                    <router-link :to="{ name: 'app.e-commerce.cart'}">
                      <b-button variant=" iq-bg-primary" block>
                        <i class="fas fa-cart-plus" />
                        {{ $t('nav.viewCarts') }}
                      </b-button>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a href="#" class="search-toggle iq-waves-effect">
                <lottie :option="require('../assets/images/small/lottie-bell')" id="lottie-beil" />
                <span class="bg-danger dots"></span>
              </a>
              <div class="iq-sub-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white">
                        {{ $t('nav.allNotifications') }}
                        <small class="badge badge-light float-right pt-1">4</small>
                      </h5>
                    </div>
                    <a
                      href="#"
                      class="iq-sub-card"
                      v-for="(item, index) in notification"
                      :key="index"
                    >
                      <div class="media align-items-center">
                        <div class>
                          <img class="avatar-40 rounded" :src="item.image" alt="img" />
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0">{{ item.name }}</h6>
                          <small class="float-right font-size-12">{{ item.date }}</small>
                          <p class="mb-0">{{ item.description.substring(0,40) + '...' }}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a href="#" class="search-toggle iq-waves-effect">
                <lottie :option="require('../assets/images/small/lottie-mail')" id="lottie-mail" />
                <span class="bg-primary count-mail"></span>
              </a>
              <div class="iq-sub-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white">
                        {{ $t('nav.allMessages') }}
                        <small class="badge badge-light float-right pt-1">5</small>
                      </h5>
                    </div>
                    <a href="#" class="iq-sub-card" v-for="(item,index) in message" :key="index">
                      <div class="media align-items-center">
                        <div class>
                          <img class="avatar-40 rounded" :src="item.image" alt="img" />
                        </div>
                        <div class="media-body ml-3">
                          <h6 class="mb-0">{{ item.name }}</h6>
                          <small class="float-left font-size-12">{{ item.date }}</small>
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
            <li class="bg-primary rounded">
              <a href="#" class="search-toggle iq-waves-effect d-flex align-items-center">
                <img :src="userProfile" class="img-fluid rounded mr-3" alt="user" />
                <div class="caption">
                  <h6 class="mb-0 line-height text-white">Nik jon</h6>
                  <span class="font-size-12 text-white">{{ $t('nav.user.available') }}</span>
                </div>
              </a>
              <div class="iq-sub-dropdown iq-user-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0">
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
                          <h6 class="mb-0">{{ $t('nav.user.profileTitle') }}</h6>
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
                          <h6 class="mb-0">{{ $t('nav.user.profileEditTitle') }}</h6>
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
                          <h6 class="mb-0">{{ $t('nav.user.accountSettingTitle') }}</h6>
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
                          <h6 class="mb-0">{{ $t('nav.user.privacySettingTitle') }}</h6>
                          <p class="mb-0 font-size-12">{{ $t('nav.user.privacySettingSub')}}</p>
                        </div>
                      </div>
                    </a>
                    <div class="d-inline-block w-100 text-center p-3">
                      <a
                        class="iq-bg-danger iq-sign-btn"
                        href="javascript:void(0)"
                        @click="logout"
                        role="button"
                      >
                        {{ $t('nav.user.signout') }}
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
        <b-container fluid v-if="$route.name !== 'mini.dashboard.home-1'">
          <b-row>
            <BreadCrumb />
          </b-row>
        </b-container>
        <transition
          name="router-anim"
          :enter-active-class="`animated ${animated.enter}`"
          mode="out-in"
          :leave-active-class="`animated ${animated.exit}`"
        >
          <router-view />
        </transition>
      </div>
      <div class="iq-right-fixed">
        <iq-card class-name="overflow-hidden">
          <template v-slot:headerTitle>
            <h4 class="card-title">{{ $t('rightSide.customerDistribution') }}</h4>
          </template>
          <template v-slot:headerAction></template>
          <AmChart element="chartdiv" type="dashboard-map" :height="150" />
        </iq-card>
        <iq-card body-class="pb-0">
          <template v-slot:headerTitle>
            <h4 class="card-title">{{ $t('rightSide.projectStatistic') }}</h4>
          </template>
          <template v-slot:body>
            <ul class="suggestions-lists m-0 p-0">
              <li
                v-for="(list,index) in projectList"
                :key="index"
                class="d-flex mb-4 align-items-center"
              >
                <div :class="'profile-icon iq-bg-' + list.color">
                  <span>{{ list.code }}</span>
                </div>
                <div class="media-support-info ml-3">
                  <h6>{{ list.title }}</h6>
                  <p class="mb-0">{{ list.subtitle }}</p>
                </div>
                <div class="iq-card-header-toolbar d-flex align-items-center">
                  <b-dropdown id="dropdownMenuButton41" right variant="none" data-toggle="dropdown">
                    <template v-slot:button-content>
                      <span class="text-primary">
                        <i class="ri-more-fill"></i>
                      </span>
                    </template>
                    <b-dropdown-item href="#">
                      <i class="ri-user-unfollow-line mr-2"></i>
                      {{ $t('dropdown.unfollow') }}
                    </b-dropdown-item>
                    <b-dropdown-item href="#">
                      <i class="ri-close-circle-line mr-2"></i>
                      {{ $t('dropdown.follow') }}
                    </b-dropdown-item>
                    <b-dropdown-item href="#">
                      <i class="ri-lock-line mr-2"></i>
                      {{ $t('dropdown.block') }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
        <iq-card class-name="wow fadeInUp">
          <template v-slot:headerTitle>
            <h4 class="card-title">{{ $t('rightSide.countries') }}</h4>
          </template>
          <template v-slot:headerAction></template>
          <template v-slot:body>
            <b-row>
              <b-col lg="12">
                <div
                  v-for="(list,index) in country"
                  :key="index"
                  class="iq-details"
                  :class="{ 'mt-4': index != 0 }"
                >
                  <span class="title text-dark">{{ list.title }}</span>
                  <div class="percentage float-right text-primary">
                    {{ list.percentage }}
                    <span>%</span>
                  </div>
                  <div class="iq-progress-bar-linear d-inline-block w-100">
                    <b-progress
                      :value="list.percentage"
                      :variant="list.color"
                      max="100"
                      class="iq-progress-bar"
                    ></b-progress>
                  </div>
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </div>
    </div>
    <FooterStyle1>
      <template v-slot:left>
        <li class="list-inline-item">
          <a href="#">Privacy Policy</a>
        </li>
        <li class="list-inline-item">
          <a href="#">Terms of Use</a>
        </li>
      </template>
      <template v-slot:right>
        Copyright 2020
        <a href="#">Vito</a> All Rights Reserved.
      </template>
    </FooterStyle1>
  </div>
</template>
<script>
import Loader from '../components/vito/loader/Loader'
import SideBarStyle1 from '../components/vito/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/vito/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profile from '../assets/images/user/user-1.jpeg'
import loader from '../assets/images/loader.gif'
import { vito } from '../config/pluginInit'
import { Users } from '../FackApi/api/chat'
import { mapGetters, mapActions } from 'vuex'
import Lottie from '../components/vito/lottie/Lottie'
import AmChart from '../components/vito/charts/AmChart'
import darkLoader from '../assets/images/darkMode/dark-logo.gif'
let body = document.querySelector('body')
export default {
  name: 'Layout2',
  components: {
    AmChart,
    Lottie,
    Loader,
    SideBarStyle1,
    NavBarStyle1
  },
  mounted () {
    body.classList.add('sidebar-main-active')
    body.classList.add('right-column-fixed')
    this.updateRadio()
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
      mini: true,
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
      ],
      projectList: [
        { title: 'Adding Item', subtitle: 'Development', color: 'danger', code: 'G' },
        { title: 'Admin Panel', subtitle: 'Development', color: 'warning', code: 'B' }
      ],
      country: [
        { title: 'USA', percentage: '95', color: 'primary' },
        { title: 'India', percentage: '75', color: 'success' },
        { title: 'Australia', percentage: '55', color: 'warning' }
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
    langChange (lang) {
      this.langChangeState(lang)
      this.$i18n.locale = lang.value
      document.getElementsByClassName('iq-show')[0].classList.remove('iq-show')
      if (lang.value === 'ar') {
        this.rtlAdd(lang)
      } else {
        this.rtlRemove(lang)
      }
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
