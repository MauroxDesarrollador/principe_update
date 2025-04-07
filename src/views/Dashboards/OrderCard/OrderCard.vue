<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col
        :class="{
          xpress:
            order.turn === 'Express (indicar hora exacta)' ||
            order.mode === 'pedidosya',
        }"
        md="12"
        style="box-shadow: 5px 5px 5px var(--iq-secondary-light) !important"
      >
        <iq-card
          :id="`${order.id}`"
          :class="{
            xpress:
              order.turn === 'Express (indicar hora exacta)' ||
              order.mode === 'pedidosya',
          }"
        >
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="d-flex justify-content-between">
                <h5 style="margin-right: 20px">#{{ order.id }}</h5>
                <label style="font-size: 13px">{{
                  order.delivery_date | formatWeekDate
                }}</label>
                <b-button e
                  size="sm"
                  variant="light"
                  v-print="`#${order.id}`"
                  class="hidde-print"
                >
                  <b-icon icon="printer" style="color: #7952b3"></b-icon>
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                  <label style="font-size: 13px">{{
                  order.turn
                }}</label>
              </b-col>
            </b-row>
            <b-row
              cols-md="4"
              class="my-4"
              v-for="product in order.products"
              v-if="!isNotes(order.products)"
              :key="product.id"
            >
              <b-col v-if="product.product">

                <ImageOverlay 
                  :textoPersonalizado="product.personalized_text"
                  :notaTaller="product.note"
                  :motivo="order.reason"
                  :imageSrc="
                    product.product.image
                      ? product.product.image
                      : require(`@/assets/images/no-image.png`)
                  "
                  :title="product.product.name"
                  :description="product.product.description"
                  :buttonText="'Salir'"
                  @buttonClick="showModalRecipe(product.product_id, product.additionals)"
                ></ImageOverlay>
              </b-col>
              <b-col md="4" v-if="!product.product">
                <b-img
                  v-viewer="{ movable: false }"
                  center
                  rounded="circle"
                  :src="require(`@/assets/images/no-image.png`)"
                  class="image"
                >
                </b-img>
              </b-col>
              <b-col md="8">
                <b-container>
                  <b-row>
                    <b-col md="12">
                      <h5>{{ product.name }}</h5>
                      <b-button
                        class="mx-2 hidde-print"
                        size="sm"
                        variant="light"
                        @click="
                          showModalRecipe(
                            product.product_id,
                            product.additionals
                          )
                        "
                      >
                        Receta
                        <b-icon icon="search" style="color: #7952b3"></b-icon>
                      </b-button>
                    </b-col>
                    <b-col md="12" class="hidde-print additionals">
                      <label
                        v-for="a in product.additionals"
                        :key="a.id"
                        class="text-muted text-capitalize mr-3"
                      >
                        <h6 class="mx-1">
                          <b-badge variant="primary" class="px-2"
                            >{{ a.name }} x {{ a.quantity }}</b-badge
                          >
                        </h6>
                      </label>
                    </b-col>

                  </b-row>
                </b-container>
              </b-col>
              <b-col md="12" v-if="product.personalized_text">
                <div><strong class="custom-text-title">Texto personalizado:</strong></div>
                <div class="custom-text" v-html="product.personalized_text"></div>
              </b-col>
              <b-col md="12" v-if="product.note" >
                <div><strong class="custom-text-title">Nota de taller:</strong></div>
                <div class="custom-text-note" v-html="product.note"></div>
              </b-col>

            </b-row>
            <b-row>
              <b-col md="12">
                <div v-if="isNotes(order.products)" style="padding:5em;text-align:center">
                  <b-button
                        class="mx-2 hidde-print"
                        size="sm"
                        variant="light"
                        @click="
                          verModal()
                        "
                      >
                        Ver detalle
                        <b-icon icon="search" style="color: #7952b3"></b-icon>
                      </b-button>
                </div>
                <div v-for="(item, index) in order.products" :key="item.id">
<!--                   <h6 v-if="item.note">
                    Nota de taller {{ index + 1 }}:
                    <label class="text-muted" style="font-style: italic"
                      ><strong>{{ item.note }}</strong></label
                    >
                  </h6> -->
                  <h6 v-if="item.note_design">
                    Nota de diseño {{ index + 1 }}:
                    <div v-html="item.note_design"></div>
                  </h6>
                </div>
<!--                 <div v-if="order.dedication">
                  <strong>Dedicatoria :</strong>
                  <div class="custom-dedication" v-html="order.dedication"></div>
                </div> -->
                                <p v-if="order.reason">
                  Motivo :
                  <label
                    class="text-muted text-capitalize"
                    style="font-style: italic"
                    >{{ order.reason }}</label
                  >
                </p>
              </b-col>
            </b-row>
            <b-container>
              <b-row
                class="mt-5 mb-0 d-flex justify-content-between align-items-center"
              >
                <b-col sm="12" md="6">
                  <b-form-select
                    v-model="order.status"
                    :options="statuses"
                    @change="onStatusChange(order.id, $event)"
                  >
                  </b-form-select>
                </b-col>
                <b-col sm="12" md="6">
                  <b-badge
                    variant="primary"
                    class="px-3"
                    v-if="order.personalizedRequired"
                  >
                    Personalizado
                  </b-badge>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </iq-card>
      </b-col>
    </b-row>

    <b-modal id="detalle_modal" centered ref="detalle_modal" title="Detalle de orden" size="lg" style="color:black !important">
     <div style="margin-top:1em">
      <b-row>
        <b-col md="12">
          <h5>Orden ID: #{{ order.id }}</h5>
          <p v-if="order.reason"><strong>Motivo:</strong> {{ order.reason }}</p>
          <div v-for="(item, index) in order.products" :key="item.id">
            <h6 v-if="item.note_design">
              Nota de diseño {{ index + 1 }}:
              <div v-html="item.note_design"></div>
            </h6>
          </div>
        </b-col>
      </b-row>
      <b-row v-for="product in order.products" :key="product.id">
        <b-col md="4" style="padding-top:2em">
           <ImageOverlay 
                  :textoPersonalizado="product.personalized_text"
                  :notaTaller="product.note"
                  :motivo="order.reason"
                  :imageSrc="getImageURL(product)"
                  :title="product.product.name"
                  :description="product.product.description"
                  :buttonText="'Salir'"
                  @buttonClick="showModalRecipe(product.product_id, product.additionals)"
                ></ImageOverlay>
        </b-col>
        <b-col md="8">
          <h5>{{ product.name }}</h5>
          <br>
          <p style="" v-if="product.personalized_text"><strong style="">Texto personalizado:</strong> <div style="color:black;font-weight:bold;font-family:arial" v-html="product.personalized_text"></div></p>
          <p style="" v-if="product.note"><strong style="">Nota de taller:</strong> <div style="color:#EC0609;font-weight:bold;font-family:arial;font-size:20px" v-html="product.note"></div></p>
          <div style="text-align:center;margin-bottom:1em">
            <b-button
              class="mx-2 hidde-print"
              size="sm"
              variant="light"
              @click="
                showModalRecipe(
                  product.product_id,
                  product.additionals
                )
              "
            >
              Receta
              <b-icon icon="search" style="color: #7952b3"></b-icon>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
     <template v-slot:modal-footer>
      <b-button variant=" iq-bg-primary" @click="$bvModal.hide('detalle_modal')">Salir</b-button>
    </template>
    </b-modal>

  </b-container>
</template>

<script>
import { vito } from '../../../config/pluginInit'
import noImage from '@/assets/images/no-image.png'
import ImageOverlay from '@/views/Dashboards/OrderCard/ImageOverlay.vue'

export default {
  name: 'OrderCard',
  components: {
    ImageOverlay
  },
  props: {
    order: { type: Object },
    statuses: { type: Array }
  },
  mounted () {
    vito.index()
  },
  methods: {
    onStatusChange (id, $event) {
      const status = $event
      this.$emit('status-change', { id, status })
    },
    showModalRecipe (productID, additionals) {
      this.$emit('modal-recipes', { productID, additionals })
    },
    isNotes (products){
      return products.some(product => product.note !== null)
    },
    verModal (){
      this.$refs['detalle_modal'].show()
    },
    getImageURL (product){
      return (product && product.product) ? product.product.image : noImage
    }
  }
}
</script>

<style scoped>
.card-order {
  height: 400px;
  overflow: auto;
  overflow: -x;
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}

.iq-card {
  margin-top: 10px;
  margin-bottom: 0px !important;
}

.footer {
  position: absolute;
  bottom: 10px;
  width: 90%;
}
.additionals {
  display: none;
}

.xpress {
  background-color: #ffdedd !important;
}

@media print {
  .custom-select {
    border-color: transparent;
    font-weight: bold;
  }
  .hidde-print {
    display: none;
  }
  .footer {
    position: inherit;
    width: 30%;
  }
}

.custom-dedication {
  border-style: solid;
  border-width: 0.5px;
  border-radius: 5px;
  padding: 1.2%;
  border-color: var(--iq-primary) !important;
}

.custom-text {
  border-style: dotted;
  border-width: 0.5px;
  border-radius: 5px;
  padding: 1.2%;
  border-color: var(--iq-primary) !important;
}

.custom-text-title {
  font-size: 0.7rem;
}

.custom-text-note {
  border-style: solid;
  border-width: 0.8px;
  border-radius: 5px;
  padding: 1.2%;
  border-color: #0630e4 !important;
}
</style>
