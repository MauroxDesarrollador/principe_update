<template>
  <div></div>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'VectorMaps',
  mounted () {
    vito.index()
  }
}
</script>
