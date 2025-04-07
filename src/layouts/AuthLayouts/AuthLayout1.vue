<template>
  <div>
    <Loader />
    <section class="sign-in-page">
      <b-container class="bg-white mt-5 p-0">
        <div class="row no-gutters">
          <div class="col-sm-6 align-self-center">
            <div class="sign-in-from">
              <router-view></router-view>
            </div>
          </div>
          <div class="col-sm-6 text-center">
            <div class="sign-in-detail text-white" :style="'background: url('+bgImageURL+') no-repeat 0 0; background-size: cover;'">
              <a class="sign-in-logo mb-5 logomau" href="#"><img :src="logo" class="img-fluid" alt="logo"></a>
              <Slick :option="slickOptions">
                <div class="item">
                  <img :src="require('../../assets/images/login/login-1.png')" class="img-fluid mb-4" alt="logo">
                  <h4 class="mb-1 text-white">Sistema de El Príncipe Azul</h4>
                  <p>Manejo de órdenes, inventario y clientes</p>
                </div>
              </Slick>
            </div>
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>
<style>
.sign-in-logo img {
    height: 150px !important
}
</style>
<script>
import Loader from '../../components/vito/loader/Loader'
import logo from '../../assets/images/logo-white.png'
import { vito } from '../../config/pluginInit'
import bgImage from '../../assets/images/login/login-2.jpg'
export default {
  name: 'AuthLayout1',
  components: {
    Loader
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      slickOptions: {
        slidesToShow: 1,
        arrows: false
      },
      logo: logo,
      bgImageURL: bgImage
    }
  }
}
</script>
