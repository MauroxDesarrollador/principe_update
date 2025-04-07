<template>
  <b-container fluid>
    <b-row style="display:none !important;"><!--Aqui iba el dashboard anterior-->
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <div class="d-flex align-items-center justify-content-between">
              <iframe
                :src="iframeUrl"
                frameborder="0"
                width="100%"
                height="350"
                allowtransparency
              ></iframe>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-row align-h="start" align-v="center">
              <b-col md="4">
                <!-- Fiiltro texto -->
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0 pt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Escriba para buscar"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''"
                        >Limpiar</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- Filtro Tipo de orden -->
              <b-col md="2">
                <b-form-group class="mb-0 pt-3">
                  <b-form-select
                    v-model="selectedPersonalize"
                    id="types"
                    size="sm"
                    :options="perOptions"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- Fecha de entrega | Fecha de creación -->
              <b-col md="2">
                <b-form-group class="mb-0 pt-3">
                  <b-form-select
                    v-model="selectedType"
                    id="types"
                    size="sm"
                    :options="typeOptions"
                  ></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row align-h="start" align-v="center">
              <b-col md="1"></b-col>
              <!-- Filtro Fecha Inicial -->
              <b-col md="3">
                <b-form-group label="Fecha inicial:" label-for="date">
                  <b-form-input v-model="initDate" type="date"></b-form-input>
                </b-form-group>
              </b-col>
              <!-- Filtro Fecha Final -->
              <b-col md="3">
                <b-form-group label="Fecha final:" label-for="date">
                  <b-form-input v-model="endDate" type="date"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-button
                  class="mr-3"
                  size="md"
                  variant="outline-primary"
                  @click="filterData"
                >
                  Buscar
                </b-button>
                <b-button size="sm" variant="light" v-print="'#printOrders'">
                  <b-icon icon="printer" style="color: #7952b3"></b-icon>
                </b-button>
              </b-col>
            </b-row>
            <b-container>
              <b-row cols-lg="3" cols-md="2" cols-sm="2" id="printOrders">
                <b-col v-for="order in orders" :key="order.id" class="position-relative">
                  <OrderCard
                    :order="order"
                    :statuses="statuses"
                    @status-change="updateStatus($event)"
                    @modal-recipes="showModalRecipes($event)"
                  ></OrderCard>
                  <b-button
                    size="sm"
                    variant="primary"
                    class="position-absolute"
                    style="top: -10px;left: 5px;display:none !important;"
                    @click="maximizeCard(order)"
                  >
                    <b-icon icon="fullscreen" style="color: #fff"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </b-container>
            <b-modal
              ref="fullscreenModal"
              size="xl"
              title="Detalles de la Orden"
              hide-footer
              fullscreen
            >
              <div v-if="selectedOrder" class="todo1_5em">
                <h5>Detalles de la Orden</h5>
                <p><strong>ID:</strong> {{ selectedOrder.id }}</p>
                <p><strong>Estado:</strong> {{ selectedOrder.status }}</p>
                <hr />
                <h5>Productos</h5>
                <div v-for="product in selectedOrder.products" :key="product.id" class="d-flex mb-3">
                  <img
                    :src="product.product.image || 'https://placehold.co/100x100'"
                    alt="Product Image"
                    class="img-thumbnail"
                    style="width: 50%; height: 100%; object-fit: cover;"
                    @error="handleImageError"
                  />
                  <div class="ml-3">
                    <p style='font-size:1.5em'><strong>Nombre:</strong> {{ product.name }}</p>
                    <p style='font-size:1.5em'><strong>Cantidad:</strong> {{ product.quantity }}</p>
                    <p style='font-size:1.5em'><strong>Descripción:</strong> {{ product.description || 'N/A' }}</p>
                    <p style='font-size:1.5em'><strong>Texto personalizado: </strong></p>
                    <div v-html="product.personalized_text || '<em>N/A</em>'"></div>
                    
                  </div>
                </div>
              </div>
            </b-modal>
            <b-modal ok-only ref="modal-recipes" title="Receta de producto">
              <b-col md="12">
                <h5>Receta</h5>
                <label
                  v-for="recipe in recipes"
                  :key="recipe.id"
                  class="text-muted text-capitalize mr-3"
                >
                  <h6 class="mx-1">
                    <b-badge variant="primary" class="px-2"
                      >{{ recipe.name }} x {{ recipe.pivot.quantity }}</b-badge
                    >
                  </h6>
                </label>
                <hr />
                <h5>Adicionales</h5>
                <label
                  v-for="additional in additionals"
                  :key="additional.id"
                  class="text-muted text-capitalize mr-3"
                >
                  <h6 class="mx-1">
                    <b-badge variant="primary" class="px-2"
                      >{{ additional.name }} x
                      {{ additional.quantity }}</b-badge
                    >
                  </h6>
                </label>
              </b-col>
            </b-modal>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import OrderCard from '@/views/Dashboards/OrderCard/OrderCard'
import orderService from '@/services/order'
import productService from '@/services/product'
import moment from 'moment'

export default {
  name: 'DasboardTaller',
  components: {
    OrderCard
  },
  created () {
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })
  },
  mounted () {
    vito.index()
    this.role = localStorage.getItem('role')
    if (this.role === 'design') {
      this.selectedPersonalize = 1
    }
    const date = new Date()
    date.setDate(date.getDate())
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.initDate = formatDate
    this.endDate = formatDate
    this.filterData()
    let jwt = require('jsonwebtoken')

    const METABASE_SITE_URL = 'http://64.225.42.188:3000'
    const METABASE_SECRET_KEY =
      '0156c408fdcb44a1d69051733b6b982a9a6bd4dbd0678c5c274fa654f1ea1fb7'
    const payload = {
      resource: { dashboard: 6 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60 // 10 minute expiration
    }
    const token = jwt.sign(payload, METABASE_SECRET_KEY)
    this.iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`
  },
  data () {
    return {
      role: '',
      params: '',
      additionals: [],
      recipes: [],
      selectedType: 1,
      selectedPersonalize: 2,
      loading: false,
      orders: [],
      filter: null,
      iframeUrl: '',
      initDate: '',
      endDate: '',
      statuses: [],
      selectedOrder: null,
      typeOptions: [
        { value: 1, text: 'Fecha de entrega' },
        { value: 2, text: 'Fecha de creación' }
      ],
      perOptions: [
        { value: 0, text: 'Standard' },
        { value: 1, text: 'Personalizada' },
        { value: 2, text: 'Todos' } // se elimina de la url
      ]
    }
  },
  methods: {
    filterData () {
      if (this.selectedPersonalize !== 2 && this.selectedType === 1) {
        this.loadData(`required_personalized=${this.selectedPersonalize}&delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&excludeStatus=entregado&prioritizeType=pedidosya&includes=products.product,products.additionals.product`)
        return
      }
      if (this.selectedPersonalize === 2 && this.selectedType === 1) {
        this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&excludeStatus=entregado&prioritizeType=pedidosya&includes=products.product,products.additionals.product`)
        return
      }
      if (this.selectedPersonalize !== 2 && this.selectedType === 2) {
        this.loadData(`required_personalized=${this.selectedPersonalize}&init_date=${this.initDate}&end_date=${this.endDate}&excludeStatus=entregado&prioritizeType=pedidosya&includes=products.product,products.additionals.product`)
        return
      }
      if (this.selectedPersonalize === 2 && this.selectedType === 2) {
        this.loadData(`init_date=${this.initDate}&end_date=${this.endDate}&excludeStatus=entregado&prioritizeType=pedidosya&includes=products.product,products.additionals.product`)
      }
    },
    updateStatus ($event) {
      this.loading = true
      orderService.updateSatus($event.id, $event.status)
        .then(() => {})
        .catch(() => { })
        .finally(() => {
          this.filterData()
          this.loading = false
        })
    },
    showModalRecipes ($event) {
      this.additionals = []
      $event.additionals.map(additional => {
        if (additional.type === 'extra') { this.additionals.push(additional) }
      })
      productService.getById($event.productID)
        .then(response => {
          this.recipes = [...response.data.additionals]
          this.$refs['modal-recipes'].show()
        })
    },
    maximizeCard(order) {
      this.selectedOrder = {
        ...order,
        personalizedTexts: order.personalizedTexts || []
      };
      this.$refs.fullscreenModal.show();
    },
    handleImageError(event) {
      event.target.src = 'https://placehold.co/600x400'; // Use a placeholder image
    },
    loadData (params = '') {
      this.params = params
      this.loading = true
      orderService.getAll(params)
        .then(response => {
          let list = []
          // if (this.role === 'design') {
          //   for (const d of response.data) {
          //     if (d.status !== 'Confeccionado' && d.personalizedRequired) {
          //       list.push(d)
          //     }
          //   }
          // } else {
          //   for (const d of response.data) {
          //     if (d.status !== 'Confeccionado') {
          //       list.push(d)
          //     }
          //   }
          // }

          for (const d of response.data) {
            if (d.status !== 'Confeccionado') {
              list.push(d)
            }
          }

          this.orders = [...list]
          // this.orders = [...response.data]
        })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style>
@media print {
  #printOrders {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
}
.todo1_5em * {
  font-size: 1em !important;
}	
</style>
