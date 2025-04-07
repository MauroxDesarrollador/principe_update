<template>
  <div>
    <div class="text-center">
      <img class="logo my-4 w-75" :src="require('../../assets/images/logo-black.png')" alt="logo" />
    </div>
    <p>Gracias por su compra!, Su orden es la NO. {{order.id}} e incluye lo siguiente:</p>
    <div v-for="item in order.products" :key="item.id" class="text-center">
      {{ item.name }}
    </div>
    <div v-if="deliveryZone" class="text-center">
      Zona de entrega: {{ deliveryZone }}
    </div>
    <UpdateForm :order="order"></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from './Forms/UpdateForm'
import orderService from '@/services/order'
import commonServices from '@/services/general'

export default {
  name: 'OrderUpdate',
  components: { UpdateForm },
  data: () => ({
    loading: true,
    deliveryZones: [],
    deliveryZone: '',
    order: {}
  }),
  created () {
    commonServices.deliveryZones().then(response => {
      this.deliveryZones = [...response.data]
      const id = this.$route.params.id
      this.loadData(id)
    })
  },
  mounted () {
  },
  methods: {
    loadData (id) {
      orderService.getById(id)
        .then(response => {
          this.order = { ...response.data }
          const zones = this.deliveryZones.filter(x => x.id === this.order.delivery_zone_id)
          this.deliveryZone = zones[0].name
          const value = this.order.delivery_date
          this.order.delivery_date = value.slice(0, value.indexOf(' '))
        })
        .catch(error => { console.error(error) })
        .finally(() => { this.loading = false })
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
