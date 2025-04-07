<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row class="py-5 d-flex justify-content-center">
              <b-col md="12" v-if="orders.length === 0">
                <div class="text-center mt-5 mb-5">
                  <img class="logo w-25" :src="require('@/assets/images/logo-black.png')" alt="logo" />
                  <h2 class="mt-5">No hay envíos disponibles</h2>
                </div>
              </b-col>
              <b-col md="12" v-else>
                <div class="text-center mt-5 mb-5">
                  <img
                    class="logo w-25"
                    :src="require('@/assets/images/logo-black.png')"
                    alt="logo"
                  />
                </div>
              </b-col>
              <b-col md="12" class="my-3">
                <b-row class="justify-content-center" style="padding-left:9%">
                  <b-col md="2" class="d-flex flex-column justify-content-center">
                    <label for="in1">Fecha de Inicio</label>
                    <input type="date" name="" id="in1"  v-model="formUpdate.delivery_init_date" class="form-control">
                  </b-col>
                  <b-col md="2" class="d-flex flex-column justify-content-center">
                    <label for="in2">Fecha Final</label>
                    <input type="date" name="" id="in2"  v-model="formUpdate.delivery_end_date" class="form-control">
                  </b-col>
                  <b-col md="2" class="justify-content-center mt-4" style="align-self: center;">
                    <button @click="SearchData()" class="btn btn-primary">Buscar</button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="4">
                <draggable v-model="orders">
                  <div v-for="order in orders" :key="order.id" class="mb-4">
                    <DeliveryCard
                      :order="order"
                      :statuses="statuses"
                      @status-change="updateStatus($event)">
                    </DeliveryCard>
                  </div>
                </draggable>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'
import DeliveryCard from '@/views/Dashboards/OrderCard/DeliveryCard'
import moment from 'moment'
import draggable from 'vuedraggable'

export default {
  name: 'Deliveries',
  props: {
    mode: { type: String }
  },
  components: {
    DeliveryCard,
    draggable
  },
  mounted () {
    vito.index()
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          if (iterator !== 'Entregado') {
            status.disabled = true
          }
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })
      .catch(error => { console.error(error) })

    const date = new Date()
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.formUpdate.delivery_init_date = formatDate
    this.formUpdate.delivery_end_date = formatDate
    this.loadData(`delivery_init_date=${formatDate}&delivery_end_date=${formatDate}&excludeStatus=entregado&mode=${this.mode}&includes=products.product,products.additionals.product`)
  },
  data () {
    return {
      orders: [],
      loading: false,
      statuses: [],
      formUpdate: {
        delivery_init_date: '',
        delivery_end_date: ''
      }
    }
  },
  methods: {
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params).then(response => {
        this.orders = [...response.data]
      })
        .catch(() => {})
        .finally(() => { this.loading = false })
    },
    updateStatus ($event) {
      this.loading = true
      orderService.updateSatus($event.id, $event.status)
        .then(() => { })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    SearchData (){
      this.loading = true
      let init = moment(String(this.formUpdate.delivery_init_date)).format('YYYY-MM-DD')
      let end = moment(String(this.formUpdate.delivery_end_date)).format('YYYY-MM-DD')
      this.loadData(`delivery_init_date=${init}&delivery_end_date=${end}&excludeStatus=entregado&mode=${this.mode}&includes=products.product,products.additionals.product`)
    }
  }
}
</script>

<style>
.iq-footer {
  margin-left: 0px !important;
}

.altura {
  height: 98vh;
}
</style>
