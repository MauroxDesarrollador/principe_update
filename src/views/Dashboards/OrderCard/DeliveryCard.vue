<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col
        md="12"
        style="box-shadow: 5px 5px 5px var(--iq-secondary-light) !important"
      >
        <div class="text-center" id="spinner" v-show="loading">
          <b-spinner
            variant="primary"
            type="grow"
            label="Spinning"
            style="width: 5rem; height: 5rem"
          ></b-spinner>
        </div>
        <iq-card
          :class="{
            xpress:
              order.turn === 'Express (indicar hora exacta)' ||
              order.mode === 'pedidosya',
          }"
        >
          <template v-slot:headerTitle>
            <b-row>
              <b-col sm="2" md="6">
                <h3>#{{ order.id }}</h3>
              </b-col>
              <b-col sm="8" md="6">
                <img
                  class="logo"
                  :src="require('../../../assets/images/logo-black.png')"
                  alt="logo"
                />
              </b-col>
            </b-row>
          </template>
          <template v-slot:body>
            <b-row v-for="product in order.products" :key="product.id">
              <b-col md="4" v-if="product.product">
                <b-img
                  v-viewer="{ movable: false }"
                  center
                  rounded="circle"
                  :src="
                    product.product.image
                      ? product.product.image
                      : require(`@/assets/images/no-image.png`)
                  "
                  class="image"
                ></b-img>
              </b-col>
              <b-col md="4" v-if="!product.product">
                <b-img
                  v-viewer="{ movable: false }"
                  center
                  rounded="circle"
                  :src="require(`@/assets/images/no-image.png`)"
                  class="image"
                ></b-img>
              </b-col>
              <b-col md="8">
                <b-row>
                  <b-col md="12">
                    <h5>{{ product.name }}</h5>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12">
                    <label
                      class="text-muted"
                      style="
                        max-width: 200px;
                        font-style: italic;
                        font-size: 11px;
                      "
                      for
                      v-if="product.note"
                      >"{{ product.note | capitalize }}"</label
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col md="12">
                <p>
                  Día de entrega: {{ order.delivery_date | formatSinHHDate }}
                </p>
                <div v-for="product in order.products" :key="product.id">
                  <p>Producto: {{ product.name }}</p>
                  <p>Cantidad: {{ product.quantity }}</p>
                </div>
                <p>Turno: {{ order.turn }}</p>
                <p>Persona que recibe: {{ order.addressee }}</p>
                <p>Teléfono: {{ order.phone }}</p>
                <p v-if="order.client.phone">
                  Teléfono: {{ order.client.phone }}
                </p>
                <p>Dirección: {{ order.delivery_address }}</p>
                <div class="form-group">
                  <label class="mr-2" for="destinatarioInput"
                    >Persona que recibió:</label
                  >
                  <input
                    type="text"
                    id="destinatarioInput"
                    v-model="order.order_receiver"
                    placeholder="Persona que recibió"
                  />
                  <b-button
                    v-b-tooltip.right="'Actualizar'"
                    size="sm"
                    class="ml-1"
                    variant="light"
                    @click="updateOrder(order)"
                    hidden
                  >
                    <i class="ri-refresh-line"></i>
                  </b-button>
                  <b-alert
                    :show="isUpdated"
                    variant=" "
                    dismissible
                    fade
                    class="text-white bg-info"
                  >
                    <div class="iq-alert-text">
                      Datos actualizados con <b>éxito</b>!
                    </div>
                  </b-alert>
                  <b-alert
                    :show="updtadeError"
                    variant=" "
                    dismissible
                    fade
                    class="text-white bg-info"
                  >
                    <div class="iq-alert-text">Ha ocurrido un error!</div>
                  </b-alert>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-3 mb-0 d-flex justify-content-between">
              <b-col md="6">
                <b-form-select
                  :disabled="!order.order_receiver"
                  v-model="order.status"
                  :options="statuses"
                  @change="onStatusChange(order.id, $event, order)"
                ></b-form-select>
              </b-col>
              <b-col lg="4" md="12" sm="12" style="padding: 0px">
                <b-badge
                  variant="primary"
                  class="px-3"
                  v-if="order.personalizedRequired"
                  >Personalizado</b-badge
                >
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../../config/pluginInit'
import orderService from '@/services/order'

export default {
  name: 'DeliveryCard',
  props: {
    order: { type: Object },
    statuses: { type: Array }
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      loading: false,
      isUpdated: false,
      updtadeError: null
    }
  },
  methods: {
    onStatusChange (id, $event, order) {
      const status = $event
      this.updateOrder(order)
      this.$emit('status-change', { id, status })
    },
    updateOrder (order) {
      this.loading = true
      orderService.update(this.order.id, this.order)
        .then(() => {
          this.isUpdated = true
          setTimeout(() => {
            this.isUpdated = false
          }, 3000)
        })
        .catch(error => { this.updtadeError = error })
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style>
.xpress {
  background-color: yellow !important;
}

.card-order {
  height: auto;
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}
.iq-card-body {
  padding: 10px !important;
}
.iq-card {
  margin-top: 10px;
  margin-bottom: 0px !important;
}

p {
  font-size: 13px;
  margin-bottom: 0.5rem !important;
}

.logo {
  max-width: 100%;
}
</style>
