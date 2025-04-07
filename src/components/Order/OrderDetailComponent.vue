<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card id="printMe">
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-col style="text-align:right">
              <b-button
                variant="link"
                class=" mb-3 mr-1 no-print"
                style="zoom:1.4"
                v-print="'#printMe'"
              >
                 <i class="ri-printer-fill ri-lg"></i>
              </b-button>
            <b-col md="12" class="text-center">
              <img
                class="logo my-4 w-25"
                :src="require('../../assets/images/logo-black.png')"
                alt="logo"
              />
            </b-col>
            </b-col>
            <b-col md="12">
              <div class="clearfix">
                <div class="float-left">
                 Fecha emisión:  {{ data.created_at | formatWeekDate }}
                </div>
                <div class="float-right">
                  <div>
                     <h5 class="text-uppercase font-weight-bolder" style="text-align:center;font-size:1.5em;margin-right:30px">
                         {{ data.mode }}<br>

                          #{{ data.id }}<br>
                        {{ data.turn }}
                   </h5>
                  </div>
                </div>
              </div>
            </b-col>
            <b-container v-if="!ocultar">
              <b-row>
                <b-col>
                  <p class="text-uppercase font-weight-bolder">Cliente:</p>
                  <p class="text-uppercase">Teléfono:</p>
                  <p class="text-uppercase">Tipo de compra:</p>
                  <p class="text-uppercase">Total a pagar</p>
                  <p class="text-uppercase">Pagado:</p>
                  <p class="text-uppercase">Saldo Pendiente:</p>
                  <p class="text-uppercase">Método de pago:</p>
                </b-col>
                <b-col>
                  <p class="font-weight-bolder">{{ data.client.name }}</p>
                  <p>{{ data.client.phone }}</p>
                  <p>{{ shopType }}</p>
                  <p>{{ data.total | money }}</p>
                  <p>{{ data.totalPaid | money }}</p>
                  <p v-if="!data.paymentCompleted">
                    {{ (data.total - data.totalPaid) | money }}
                  </p>
                  <p v-else>No hay pago pendiente</p>
                  <p
                    v-for="(pm, index) in paymentMethod"
                    :key="index"
                    :class="{ custome: pm === 'Crédito' }"
                  >
                    {{ pm }}
                  </p>
                </b-col>
                <b-col>
                  <b-row class="mb-5 text-center">
                  </b-row>
                  <b-row>
                    <b-col>
                      <p class="text-uppercase">Productos:</p>
                      <p class="text-uppercase">Delivery:</p>
                      <p class="text-uppercase">Descuento:</p>
                    </b-col>
                    <b-col>
                      <p class="text-uppercase">{{ productsTotal | money }}</p>
                      <p class="text-uppercase">
                        {{ data.delivery_price | money }}
                      </p>
                      <p class="text-uppercase">{{ data.discount | money }}</p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
            <hr />
            <!-- Detalle de los productos -->
            <b-container>
              <b-row>
                <b-col>
                  <p class="text-uppercase">Motivo:</p>
                  <p class="text-uppercase">
                    Mensaje para la tarjeta dedicatoria:
                  </p>
                </b-col>
                <b-col>
                  <h6>{{ data.reason }}</h6>
                 <div v-html="data.dedication"></div>
                </b-col>
              </b-row>
            </b-container>
            <b-container>
              <b-row v-for="(p, index) in data.products" :key="index">
                <b-col>
                  <h4>{{ p.name | capitalize }} {{ p.price | money }}</h4>
                  <div v-for="(a, index) in p.additionals" :key="index">
                    <h6 v-if="a.type === 'extra'" class="ml-4 text-danger">
                      {{ a.name | capitalize }} x {{ a.quantity }}
                    </h6>
                  </div>
                  <b-container>
                    <b-row class="mt-2">
                      <b-col>
                        <p class="text-uppercase">Nota de taller:</p>
                        <p class="text-uppercase">Nota de diseño:</p>
                        <!-- <p class="text-uppercase">Personalización de texto:</p> -->
                      </b-col>
                      <b-col>
                        <template v-if="p.note">
                          <h6 v-html="p.note"></h6>
                        </template>
                        <template v-else>---</template>
                        <template v-if="p.note_design">
                          <h6 v-html="p.note_design"></h6>
                        </template>
                        <template v-else>---</template>
                        <!-- <h6 :class="{ 'font-weight-bold': role === 'design' }">
                          {{ p.personalized_text }}
                        </h6> -->
                        <!-- <div class="custom-dedication" v-html="p.personalized_text"></div> -->
                      </b-col>
                      <b-col >
                         <p v-if="p.personalized_text" class="text-uppercase">Personalización de texto:</p>
                         <div v-if="p.personalized_text" class="custom-dedication" v-html="p.personalized_text"></div>
                      </b-col>
                      <b-col>
                        <b-img
                          v-viewer="{ movable: false }"
                          center
                          rounded="circle"
                          :src="
                            p.product.image
                              ? p.product.image
                              : require(`@/assets/images/no-image.png`)
                          "
                          class="image-list"
                        ></b-img>
                        <div v-for="(a, i) in p.additionals" :key="i">
                          <b-img
                            v-if="a.type === 'extra'"
                            v-viewer="{ movable: false }"
                            center
                            rounded="circle"
                            :src="
                              a.product.image
                                ? a.product.image
                                : require(`@/assets/images/no-image.png`)
                            "
                            class="image-list"
                          ></b-img>
                        </div>
                      </b-col>
                      <b-col></b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
            </b-container>
            <hr />
            <!-- Datos de la entrega -->
            <b-container v-if="!ocultar">
              <b-col>
                <div class="clearfix">
                  <div class="float-left">
                    <h5>Datos de la entrega</h5>
                  </div>
                  <div class="float-right">
                   <h5 class="text-uppercase font-weight-bolder" style="text-align:center;font-size:1.5em">
                         {{ data.mode }}<br>

                          #{{ data.id }}<br>
                        {{ data.turn }}
                   </h5>
                  </div>
                </div>
              </b-col>
            </b-container>
            <b-container v-if="!ocultar">
              <b-row>
                <b-col>
                  <p class="text-uppercase">Fecha de entrega:</p>
                  <p class="text-uppercase">Dirección de entrega:</p>
                  <p class="text-uppercase">Recibe:</p>
                  <p class="text-uppercase">Turno:</p>
                  <p class="text-uppercase">Tipo de entrega:</p>
                  <p class="text-uppercase">Teléfono:</p>
                  <p class="text-uppercase">Cantidad:</p>
                  <p class="text-uppercase">Productos:</p>
                </b-col>
                <b-col>
                  <p>
                    {{ data.delivery_date | formatSinHHDate }}
                  </p>
                  <p>{{ data.delivery_address }}</p>
                  <p v-if="data.order_receiver">{{ data.order_receiver }}</p>
                  <p v-if="!data.order_receiver">{{ data.addressee }}</p>
                  <p>{{ data.turn }}</p>
                  <p>{{ data.mode | capitalize }}</p>
                  <p>{{ data.phone }}</p>
                  <p>{{ data.products.length }}</p>
                  <p v-for="(p, i) in data.products" :key="i">
                    {{ p.name | capitalize }}
                  </p>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<style>
  span,h1,h2,h3,h4,h5,p{
    color:black
  }
</style>
<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'

export default {
  name: 'OrderDetailComponent',
  props: {
    dataId: { type: Number },
    idList: { type: Array },
    enableButtons: { type: Boolean },
    ocultar: { type: Boolean }
  },
  mounted () {
    vito.index()
    this.loadData()
    this.role = localStorage.getItem('role')
  },
  data () {
    return {
      variant: '',
      loading: true,
      showDetails: '',
      index: '',
      data: {
        products: [],
        payments: [],
        delivery_address: '',
        created_at: '',
        addressee: '',
        delivery_date: '',
        mode: '',
        type: '',
        dedication: '',
        signature: '',
        status: '',
        showDetails: false,
        client: {
          name: '',
          phone: '',
          email: ''
        }
      }
    }
  },
  computed: {
    productsTotal () {
      let total = 0
      this.data.products.forEach(element => {
        total += element.price
      })
      return total
    }, 
    shopType () {
      let type = ''
      if (this.data.type) {
        type = this.data.type
      } else {
        type = '------'
      }
      return type
    },
    paymentMethod () {
      let pm = []
      this.data.payments.forEach(element => {
        if (element.amount > 0) {
          pm.push(element.payment_method)
        }
      })
      return pm
    }
  },
  methods: {
    loadData () {
      this.loading = true
      this.index = this.idList.indexOf(this.dataId)
      orderService.getById(this.dataId)
        .then(response => {
          this.data = response.data
          for (const key in this.data.products) {
            if (this.data.products.hasOwnProperty(key)) {
              const element = this.data.products[key]
              this.$set(element, 'showDetails', false)
            }
          }
        })
        .catch(() => { this.loading = false })
        .finally(() => { this.loading = false })
    },
    prevNext (i) {
      this.index = this.idList.indexOf(this.dataId) + i
      this.dataId = this.idList[this.index]
      this.loadData()
    },
    showHideDetail (index) {
      this.data.products[index].showDetails = !this.data.products[index].showDetails
    }
  }
}
</script>

<style>
.product-info {
  border: 1px dashed #e5e8e8;
  margin-bottom: 5px;
  padding: 10px 5px;
}
.image {
  width: 64px;
  height: auto;
}
.image-list {
  width: 80px;
  height: auto;
}

.text-italic {
  font-style: italic;
}

.custome {
  font-weight: bold;
}
@media print {
  .row-data {
    display: flex;
    flex-direction: row;
  }
  p {
    text-transform: uppercase;
  }
  .image-list {
    width: 80px;
    height: auto;
  }
}

.custom-dedication {
  border-style: dotted;
  border-width: 0.5px;
  border-radius: 5px;
  padding: 1.2%;
  border-color: var(--iq-primary) !important;
}

@media print {
.no-print {
  display: none!important;
 }
}
</style>
