<template>
  <router-view/>
</template>
<script>
import { vito } from './config/pluginInit'

export default {
  name: 'App',
  components: {
  },
  mounted () {
    vito.mainIndex()
  }
}
</script>
<style lang="scss">
  @import "assets/scss/style.scss";
</style>
