<template>
  <b-container fluid>
    <OrderDetailComponent :dataId="$route.params.id" :idList="ids"></OrderDetailComponent>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'

export default {
  name: 'OrderDetail',
  components: { OrderDetailComponent },
  created () { },
  mounted () {
    vito.index()
    this.id = this.$route.params.id
  },
  data () {
    return {
      id: '',
      ids: [],
      loading: true
    }
  }
}
</script>
