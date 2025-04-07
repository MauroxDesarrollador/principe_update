<template>
  <div class="container-fluid p-0">
    <div class="row no-gutters">
      <div class="col-sm-12 text-center">
        <div class="iq-error" :class="$route.params.code !== '404' ? 'error-500' : ''">
          <img :src="image404" class="img-fluid iq-error-img" alt="404" v-if="$route.params.code === '404'">
          <img :src="image500" class="img-fluid iq-error-img" alt="500" v-else>
          <h2 class="mb-0">Oops! Página no encontrada.</h2>
          <p>La página solicitada no existe.</p>
          <button @click="$router.go(-1)" class="btn btn-primary mt-3"><i class="ri-home-4-line"></i>Volver</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'ErrorPage',
  mounted () {
    vito.index()
  },
  data () {
    return {
      image404: require('../../assets/images/error/error-01.png'),
      image500: require('../../assets/images/error/error-.png')
    }
  }
}
</script>
