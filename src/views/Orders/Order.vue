<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <iq-card>
          <template v-slot:body>
            <b-row>
              <div class="text-center" id="spinner" v-show="loading">
                <b-spinner
                  variant="primary"
                  type="grow"
                  label="Spinning"
                  style="width: 3rem; height: 3rem"
                ></b-spinner>
              </div>
            </b-row>
            <form-wizard
              ref="wizard"
              @on-complete="onComplete"
              @on-change="tabChange"
              title
              :subtitle="validateMsg"
              :back-button-text="backBtn"
              :next-button-text="nextBtn"
              finish-button-text="Finalizar orden"
              color="#0630E4"
              error-color="#f35448"
            >
              <!-- Tab Ordenes -->
              <tab-content
                title="Datos de la orden"
                icon="ti-pencil-alt"
                :before-change="validateOrder"
              >
                <ValidationObserver ref="form">
                  <form @submit.prevent="onSubmit">
                    <b-row id="row">
                      <!-- Cliente -->
                      <b-form-group
                        class="col-md-6"
                        label="Cliente:"
                        label-for="cliente"
                      >
                        <ValidationProvider
                          name="Cliente"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-input-group>
                            <b-form-input
                              autocomplete="off"
                              readonly
                              v-model="client.name"
                              @click="getClient"
                              type="text"
                              placeholder="Cliente"
                              :value="client.id"
                              :class="errors.length > 0 ? ' is-invalid' : ''"
                            ></b-form-input>
                            <b-input-group-append is-text>
                              <b-button
                                size="sm"
                                variant="outline"
                                @click="showClientModal"
                              >
                                <b-icon
                                  icon="person-plus-fill"
                                  aria-label="Help"
                                ></b-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Fecha de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Fecha de entrega:"
                        label-for="date"
                      >
                        <ValidationProvider
                          name="Fecha de entrega"
                          rules="required"
                          v-slot="{ errors }"
                        >
                     <b-row>
                     <b-col>
                      <b-form-datepicker
                        v-model="order.delivery_date"
                        :class="errors.length > 0 ? ' is-invalid' : ''"
                        placeholder="Selecciona fecha"
                      ></b-form-datepicker>
                    </b-col>
                    
                     </b-row>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Tipo de compra -->
                      <b-form-group
                        class="col-md-6"
                        label="Tipo de compra:"
                        label-for="shopType"
                      >
                        <b-form-select
                          v-model="order.type"
                          :options="purchaseType"
                        ></b-form-select>
                      </b-form-group>
                      <!-- Modo de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Modo de entrega:"
                        label-for="delivery"
                      >
                        <ValidationProvider
                          name="Modo de entrega"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-form-select
                            v-model="order.mode"
                            :options="deliveryType"
                            @change="onModeChange"
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                          ></b-form-select>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Zona de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Zona de entrega:"
                        label-for="delivery"
                      >
                        <b-form-select
                          :disabled="order.mode !== 'delivery'"
                          v-model="order.delivery_zone_id"
                          :options="deliveryZones"
                          @change="deliveryCostChange"
                        ></b-form-select>
                      </b-form-group>

                      <!-- Turnos -->
                      <b-form-group
                        class="col-md-6"
                        label="Turno:"
                        label-for="turn"
                      >
                        <b-form-select
                          v-model="order.turn"
                          :options="turns"
                        ></b-form-select>
                      </b-form-group>

                      <b-form-group class="col-md-12">
                        <hr />
                      </b-form-group>

                      <!-- Direccion -->
                      <b-form-group
                        class="col-md-6"
                        label="Dirección de entrega:"
                        label-for="name"
                      >
                        <ValidationProvider
                          name="Dirección de entrega"
                          rules="max:600"
                          v-slot="{ errors }"
                        >
                          <b-form-textarea
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                            v-model="order.delivery_address"
                            placeholder="Dirección de entrega"
                            rows="3"
                            max-rows="6"
                            class="printable"
                            no-resize
                          ></b-form-textarea>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>

                      <!-- Dedicatoria -->
                      <b-form-group
                        class="col-md-6"
                        label="Dedicatoria del arreglo:"
                        label-for="dedication"
                      >
                        <ValidationProvider
                          name="Dedicatoria del arreglo"
                          v-slot="{ errors }"
                        >
                          <ckeditor :editor="editor" v-model="order.dedication"></ckeditor>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>

                      <!-- Persona quien recibe -->
                      <b-form-group
                        class="col-md-6"
                        label="Persona que recibe:"
                        label-for="name"
                      >
                        <b-form-input
                          v-model="order.addressee"
                          type="text"
                          placeholder="Persona que recibe"
                        ></b-form-input>
                      </b-form-group>

                      <!-- Motivo -->
                      <b-form-group
                        class="col-md-6"
                        label="Motivo:"
                        label-for="reasons"
                      >
                        <b-form-select
                          v-model="order.reason"
                          :options="reasons"
                        ></b-form-select>
                      </b-form-group>
                      <!-- Phone number -->
                      <b-form-group
                        class="col-md-6"
                        label="Teléfono:"
                        label-for="phone"
                      >
                        <b-form-input
                          v-model="order.phone"
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Teléfono"
                          v-mask="['###-####', '####-####']"
                        ></b-form-input>
                      </b-form-group>
                      <!-- Columna vacia -->
                      <b-form-group class="col-md-6"></b-form-group>
                      <!-- Status de la compra -->
                      <b-form-group
                        v-if="status === 'edit'"
                        class="col-md-6"
                        label="Status de la compra:"
                        label-for="statuses"
                      >
                        <b-form-select
                          :disabled="
                            order.status === 'Entregado' ||
                            order.status === 'Cancelado'
                          "
                          v-model="order.status"
                          :options="statuses"
                        ></b-form-select>
                      </b-form-group>
                    </b-row>
                  </form>
                </ValidationObserver>
              </tab-content>
              <!-- Tab Productos -->
              <tab-content
                title="Productos"
                icon="ti-package"
                :before-change="validateProducts"
              >
                <div v-for="(p, index) in orderProducts" :key="index">
                  <b-row id="row" class="mb-2">
                    <b-col class="col-md-3">
                      <b-img
                        v-if="status === 'add'"
                        v-viewer="{ movable: false }"
                        center
                        rounded="circle"
                        :src="
                          p.image
                            ? p.image
                            : require(`@/assets/images/no-image.png`)
                        "
                        id="image"
                      ></b-img>
                      <b-img
                        v-if="status === 'edit'"
                        v-viewer="{ movable: false }"
                        center
                        rounded="circle"
                        :src="
                          p.product.image
                            ? p.product.image
                            : require(`@/assets/images/no-image.png`)
                        "
                        id="image"
                      ></b-img>
                    </b-col>
                    <b-col class="col-md-6">
                      <h5 class="text-capitalize">{{ p.name }}</h5>
                      <p class="h6" id="price">{{ p.price | money }}</p>
                      <h6>
                        Nota de taller: <strong>{{ p.note }}</strong>
                      </h6>
                      <h6>
                        Nota de diseño:
                        <div v-html="p.note_design"></div>
                      </h6>
                      <h6
                        v-if="
                          p.personalized ||
                          (status === 'edit' && p.product.personalized)
                        "
                      >
                        <!-- Texto personalizado XX : {{ p.personalized_text }} -->
                      </h6>
                      <h6>Texto personalizado: </h6>
                      <div  v-html="p.personalized_text"></div>
                      <p class="mt-2">Extras</p>
                      <div
                        class="d-inline"
                        v-for="(item, indice) in p.additionals"
                        :key="indice"
                      >
                        <b-button
                          v-if="item.type === 'extra'"
                          variant="primary"
                          class="mb-3 mr-1 text-capitalize"
                          @clisck="deleteExtra(index, indice)"
                        >
                          {{ item.name }} x {{ item.quantity }}
                          <i class="ri-indeterminate-circle-line"></i>
                        </b-button>
                        <b-button
                          v-if="status === 'add'"
                          variant="primary"
                          class="mb-3 mr-1 text-capitalize"
                          @click="deleteExtra(index, indice)"
                        >
                          {{ item.name }} x {{ item.quantity }}
                          <i
                            class="ri-indeterminate-circle-line"
                            v-if="status === 'add'"
                          ></i>
                        </b-button>
                      </div>
                      <div class="d-inline">
                        <b-button
                          variant="success"
                          class="mb-3 mr-1"
                          @click="showModal('extras', index)"
                        >
                          Añadir
                          <i class="ri-add-line"></i>
                        </b-button>
                      </div>
                    </b-col>
                    <b-col class="col-md-3">
                      <b-button
                        v-b-tooltip.right="'Eliminar producto'"
                        size="sm"
                        variant="link"
                        @click="deleteProduct(index)"
                      >
                        <i class="ri-delete-back-2-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        v-b-tooltip.right="'Agregar notas'"
                        size="sm"
                        variant="outline-link"
                        @click="showModalNote(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        v-b-tooltip.right="'Agregar notas de diseño'"
                        size="sm"
                        variant="link"
                        @click="showModalDesignNote(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        class="btn-link-personlized"
                        v-if="
                          p.personalized ||
                          (status === 'edit' && p.product.personalized)
                        "
                        v-b-tooltip.right="'Añadir texto Personalizado'"
                        size="sm"
                        variant="link"
                        @click="showPersonalizedText(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                    </b-col>
                  </b-row>
                </div>
                <b-row align-h="center">
                  <b-col class="col-md-8 text-center">
                    <b-button
                      @click="showModal('lista-productos')"
                      pill
                      variant="outline-secondary"
                      class="mb-3 pr-5 pl-5"
                    >
                      <i class="ri-add-line"></i>
                      {{ buttonTitle }}
                    </b-button>
                  </b-col>
                </b-row>
              </tab-content>
              <!-- Tab Pago -->
              <tab-content
                title="Pago"
                icon="ti-credit-card"
                :before-change="validatePayment"
              >
                <b-row align-h="center" id="row">
                  <div class="col-md-6">
                    <div v-for="item in payments" :key="item.id">
                      <b-form inline class="mb-2">
                        <b-form-checkbox
                          v-model="item.checkBox"
                          :name="item.payment_method"
                          class="mb-2 mr-sm-2 mb-sm-0"
                          >{{ item.payment_method }}</b-form-checkbox
                        >
                        <b-form-input

                          v-show="item.checkBox"
                          v-model="item.amount"
                        ></b-form-input>
                      </b-form>
                    </div>
                    <b-form-group
                      class="col-md-6"
                      label="Descuento"
                      label-for="cliente"
                    >
                      <b-form-input
                        id="discount"
                        autocomplete="off"
                        v-model="order.discount"
                        type="text"
                        v-money="money"
                        placeholder="Descuento"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-md-3 text-right">
                    <div v-for="product in orderProducts" :key="product.id">
                      {{ product.name | capitalize }}:
                      <label for class="success">
                        {{ product.price | money }}
                      </label>
                      <div v-for="item in product.additionals" :key="item.id">
                        <div v-if="status === 'edit' && item.type === 'extra'">
                          {{ item.name }} x {{ item.quantity }}:
                          <label class="success">
                            {{
                              (item.salePriceWithTax * item.quantity) | money
                            }}
                          </label>
                        </div>
                        <div v-if="status === 'add'">
                          {{ item.name }} x {{ item.quantity }}:
                          <label class="success">
                            {{
                              (item.salePriceWithTax * item.quantity) | money
                            }}
                          </label>
                        </div>
                      </div>
                    </div>
                    Delivery:
                    <label for class="success">
                      {{ deliveryCost | money }}
                    </label>
                    <br />
                    Descuento:
                    <label for class="success">
                      {{ order.discount | money }}
                    </label>
                    <br />
                    ITBMS:
                    <label for class="success">{{ itbm | money }}</label>
                    <br />
                    Total a pagar:
                    <label for class="success">{{ finalPrice | money }}</label>
                    <br />
                    Pagado:
                    <label :class="payOut > finalPrice ? 'error' : 'success'">
                      {{ payOut | money }}
                    </label>
                    <br />
                    Restante:
                    <label :class="rest > 0 ? 'success' : 'error'">
                      {{ rest | money }}
                    </label>
                  </div>
                </b-row>
              </tab-content>
              <template slot="footer" slot-scope="props">
                <div class="wizard-footer-left">
                  <span v-if="tabIndex !== 0" role="button">
                    <button
                      @click="props.prevTab()"
                      type="button"
                      class="wizard-btn"
                      style="
                        background-color: rgb(6, 48, 228);
                        border-color: rgb(6, 48, 228);
                        color: white;
                      "
                    >
                      {{ backBtn }}
                    </button>
                  </span>
                </div>
                <div class="wizard-footer-right">
                  <span role="button">
                    <button
                      :disabled="loading"
                      @click="props.nextTab()"
                      type="button"
                      class="wizard-btn"
                      style="
                        background-color: rgb(6, 48, 228);
                        border-color: rgb(6, 48, 228);
                        color: white;
                      "
                    >
                      {{ tabIndex > 1 ? "Finalizar Compra" : nextBtn }}
                    </button>
                  </span>
                </div>
              </template>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>

    <!-- Modal Nota -->
    <b-modal
      ref="modal-note"
      ok-only
      id="modal-note"
      title="Añadir nota"
      @ok="addNote"
    >
      <b-form-group
        class="col-md-12"
        label="Nota de taller:"
        label-for="cliente"
      >
        <b-form-textarea v-model="note" rows="3" max-rows="6"></b-form-textarea>
      </b-form-group>
    </b-modal>
    <!-- Modal Texto Personalizado -->
    <b-modal
      ref="modal-personalized"
      ok-only
      id="modal-personalized"
      title="Texto personalizado "
      @ok="addPersonalizedNote"
    >
      <b-form-group
        class="col-md-12"
        label="Texto personalizado:"
        label-for="cliente"
      >
       <ckeditor :editor="editor" v-model="personalized_text"></ckeditor>
<!--         <b-form-textarea
          v-model="personalized_text"
          rows="3"
          max-rows="6"
        ></b-form-textarea> -->
      </b-form-group>
    </b-modal>
    <!-- Modal Nota de diseño -->
    <b-modal
      ref="modal-design-note"
      ok-only
      id="modal-design-note"
      title="Añadir nota dieño"
      @ok="addDesignNote"
    >
      <b-form-group class="col-md-12" label="Nota de diseño:">
        <ckeditor
          :editor="editor"
          v-model="note_design"
          :config="editorConfig"
        ></ckeditor>
      </b-form-group>
    </b-modal>

    <!-- Modal nuevo cliente -->
    <b-modal
      ref="modal-client"
      size="lg"
      id="modal-client"
      title="Lista de productos"
      ok-only
      ok-title="Cerrar"
      no-close-on-esc
      no-close-on-backdrop
    >
      <client is-modal @new-client="client = $event"></client>
    </b-modal>

    <!-- Modal productos Principales -->
    <b-modal
      ref="lista-productos"
      size="lg"
      id="lista-productos"
      title="Lista de productos"
      cancel-title="Cancelar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <b-form-input
      autocomplete="off"
      v-model="SearchTable2"
      type="text"
      placeholder="Buscar"
      debounce="500"
      ></b-form-input>
      <template>
        <div>
          <b-table
          striped
          hover
          :fields="pTitles"
          :items="GetAllProduct"
          :per-page="Per_PageProduct"
          :current-page="CurrentPageProduct"
          small
          primary-key="a"
          id="my-table2"
          :filter="SearchTable2">
            <template #cell(action)="row">
              <b-button
                  @click="addItem(row.item)"
                  type="button"
                  class="mr-3 btn_add_client"
                  >+</b-button
                >
            </template>
            <template #cell(image)="row">
              <b-img v-bind="{src:row.item.image != null ? row.item.image:'/img/no-image.f01e4c2a.png',width:75,height:75}" rounded alt="Producto"></b-img>
            </template>
          </b-table>
        </div>
      </template>
      <b-pagination
      align="center"
      v-model="CurrentPageProduct"
      :total-rows="TotalRowsProduct"
      :per-page="Per_PageProduct"
      aria-controls="my-table2"

      ></b-pagination>
    </b-modal>

    <!-- Modal extras  -->
    <b-modal
      ref="extras"
      size="lg"
      id="extras"
      title="Lista de extras"
      cancel-title="Cancelar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOkExtra"
      @cancel="handleCancelExtra"
    >
       <b-form-input
      autocomplete="off"
      v-model="SearchTable3"
      type="text"
      placeholder="Buscar"
      debounce="300"
      ></b-form-input>
      <template>
        <div>
          <b-table
          striped
          hover
          :fields="eTitles"
          :items="GetAllProduct"
          :per-page="Per_PageProductExtra"
          :current-page="CurrentPageProductExtra"
          small
          primary-key="a"
          id="my-table3"
          :filter="SearchTable3">
          <template #cell(action)="row">
              <!-- <b-button
                  @click="addItem(row.item)"
                  type="button"
                  class="mr-3 btn_add_client"
                  >+</b-button
                > -->
              <b-button
                v-b-tooltip.top="'Agregar'"
                variant=" iq-bg-success mr-1 mb-1"
                size="sm"
                @click="addItem(row.item)"
                v-if="!row.item.isAddItem">
                <i class="ri-add-line  m-0"></i>
              </b-button>
              <b-button
                v-b-tooltip.top="'Eliminar'"
                variant=" iq-bg-danger mr-1 mb-1"
                size="sm"
                @click="deleteItem(row.item)"
                v-show="row.item.isAddItem">
                <i class="ri-close-fill m-0"></i>
              </b-button>
            </template>
            <template #cell(quantity)="row">
              <b-form-input
                v-model="row.item.quantity"
                type="number"
                name="quantity"
                id="quantity"
                class="form-control"
                placeholder="Cantidad">
              </b-form-input>
            </template>
            <template #cell(image)="row">
              <b-img v-bind="{src:row.item.image != null ? row.item.image:'/img/no-image.f01e4c2a.png',width:75,height:75}" rounded alt="Producto"></b-img>
            </template>
          </b-table>
        </div>
      </template>
      <b-pagination
      align="center"
      v-model="CurrentPageProductExtra"
      :total-rows="TotalRowsProductExtra"
      :per-page="Per_PageProductExtra"
      aria-controls="my-table3"

      ></b-pagination>
    </b-modal>

    <!-- Modal Lista de Clientes -->
    <b-modal
      ok-only
      ref="lista-clientes"
      size="lg"
      id="lista-clientes"
      title="Lista de clientes"
      ok-title="Cerrar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <b-form-input
      autocomplete="off"
      v-model="SearchTable"
      type="text"
      placeholder="Buscar"
      debounce="500"
      ></b-form-input>
      <template>
        <div>
          <b-table
          striped
          hover
          :fields="cTitles"
          :items="GetAllClientTable"
          :per-page="Per_PageClient"
          :current-page="CurrentPageClient"
          small
          primary-key="a"
          id="my-table"
          :filter="SearchTable">
            <template #cell(action)="row">
              <b-button
                  @click="addClient(row.item)"
                  type="button"
                  class="mr-3 btn_add_client"
                  >+</b-button
                >
            </template>
          </b-table>
        </div>
      </template>
         <b-pagination
      align="center"
      v-model="CurrentPageClient"
      :total-rows="TotalRowsClient"
      :per-page="Per_PageClient"
      aria-controls="my-table"

      ></b-pagination>
    </b-modal>

    <!-- Final Order Modal -->
    <b-modal
      ok-only
      ref="modal-order"
      size="lg"
      id="final-order"
      ok-title="Finalizar orden"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="finishOrder"
    >
      <OrderDetailComponent
        :dataId="orderResponse.id"
        :idList="ids"
        :enableButtons="false"
      >
        <h5 class="mt-3">Formulario de datos</h5>

        <b-row>
          <b-col md="10">
            <a :href="url">{{ url }}</a>
          </b-col>
          <b-col md="2">
            <b-button
              v-b-tooltip.top="'Copiar'"
              variant="link"
              class="mb-3 mr-1"
              v-clipboard:copy="url"
            >
              <i class="ri-file-copy-line pr-0"></i>
            </b-button>
          </b-col>
        </b-row>

        <b-form-checkbox
          v-model="sendForm"
          name="sendForm"
          class="mb-2 mr-sm-2 mb-sm-0"
          >Enviar formulario por email</b-form-checkbox
        >
      </OrderDetailComponent>
    </b-modal>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import { mask } from 'vue-the-mask'
import { FormWizard, TabContent } from 'vue-form-wizard'
import clientService from '@/services/client'
import productService from '@/services/product'
import generalService from '@/services/general'
import orderService from '@/services/order'
// import ModalTable from '@/components/Modals/ModalTable'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'
import Client from '@/views/Clients/Client'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import { VMoney } from 'v-money'

export default {
  name: 'Order',
  directives: { money: VMoney, mask },

  components: {
    FormWizard,
    TabContent,
    OrderDetailComponent,
    Client
  },
  created () {
    const id = this.$route.params.id
    if (id) this.status = 'edit'
    else this.order.delivery_date = new Date().toISOString().split('T')[0] // Set default delivery date to today
  },
  mounted () {
    vito.index()
    this.loading = true
    generalService.paymentMethods().then(response => {
      const object = response.data
      const list = []
      for (const iterator of object) {
        this.payment = {}
        this.$set(this.payment, 'payment_method', iterator)
        this.$set(this.payment, 'amount', 0)
        list.push(this.payment)
      }
      if (!this.$route.params.id) {
        this.payments = [...list]
      }
    })

    generalService.reasons().then(response => {
      const object = response.data
      this.reason.text = 'Seleccione un motivo'
      this.reason.value = null
      this.reasons.push(this.reason)
      for (const iterator of object) {
        this.reason = {}
        this.reason.value = iterator
        this.reason.text = iterator
        this.reasons.push(this.reason)
      }
    })

    generalService.turns().then(response => {
      const object = response.data
      this.turn.text = 'Seleccione un turno'
      this.turn.value = null
      this.turns.push(this.turn)
      for (const iterator of object) {
        this.turn = {}
        this.turn.value = iterator
        this.turn.text = iterator
        this.turns.push(this.turn)
      }
    })

    generalService.deliveryZones().then(response => {
      const data = response.data
      this.deliveryZone.value = null
      this.deliveryZone.text = 'Seleccione una zona'
      this.deliveryZone.price = 0
      this.deliveryZones.push(this.deliveryZone)

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          this.deliveryZone = {}
          this.deliveryZone.value = element.id
          this.deliveryZone.text = `${element.name} - $${element.price}`
          this.deliveryZone.price = element.price
          this.deliveryZones.push(this.deliveryZone)
        }
      }
    })

    generalService.orderStatus().then(response => {
      const object = response.data
      for (const iterator of object) {
        let status = {}
        status.value = iterator
        status.text = iterator
        this.statuses.push(status)
      }
    })
      .finally(() => {
        this.loading = false
      })
    if (this.status === 'edit') {
      this.loading = true
      orderService
        .getById(this.$route.params.id)
        .then(response => {
          this.order = response.data
          this.order.discount = response.data.discount.toFixed(2)
          const value = this.order.delivery_date
          this.order.delivery_date = value.slice(0, value.indexOf(' '))
          // this.payments = this.order.payments
          for (let position in response.data.payments) {
            this.payments.push({
              checkBox: response.data.payments[position].amount > 0,
              amount: response.data.payments[position].amount.toFixed(2),
              payment_method: response.data.payments[position].payment_method,
              id: response.data.payments[position].id,
              order_id: response.data.payments[position].order_id,
              created_at: response.data.payments[position].created_at
            })
          }
          this.client = this.order.client
          this.orderProducts = this.order.products
          this.deliveryCost = this.order.delivery_price
        })
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  data () {
    return {
      TypeList: '',
      SearchTable: '',
      CurrentPageClient: 1,
      Per_PageClient: 15,
      TotalRowsClient: 1,
      SearchTable2: '',
      CurrentPageProduct: 1,
      Per_PageProduct: 15,
      TotalRowsProduct: 1,
      SearchTable3: '',
      CurrentPageProductExtra: 1,
      Per_PageProductExtra: 15,
      TotalRowsProductExtra: 1,
      editorConfig: {
        toolbar: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']
      },
      editor: ClassicEditor,
      note_design: '',
      tax: 0,
      deliveryCost: 0,
      percent: null,
      deliveryPrice: 0,
      deliveryTime: '00:00:00',
      reasons: [],
      reason: {},
      turns: [],
      turn: {},
      ids: [],
      status: 'add',
      orderResponse: [],
      sendForm: false,
      money: {},
      note: '',
      personalized_text: '',
      index: null,
      tabIndex: 0,
      validateMsg: '',
      loading: false,
      checkbox1: null,
      selectedType: null,
      selectedDelivery: null,
      client: {
        name: ''
      },
      order: {
        id: '',
        phone: null,
        delivery_zone_id: null,
        client_id: '',
        client_name: '',
        client_dni: '',
        delivery_date: '',
        delivery_time: '',
        type: null,
        mode: null,
        status: null,
        reason: null,
        turn: null,
        discount: 0,
        delivery_address: '',
        addressee: '',
        dedication: '',
        signature: '',
        products: [],
        payments: [],
        client: {
          name: '',
          dni: ''
        }
      },
      statuses: [],
      product: {
        id: null,
        personalized_text: '',
        product_id: '',
        order_id: null,
        quantity: 1,
        note: '',
        note_design: '',
        price: null,
        image: '',
        additionals: []
      },
      additional: {
        id: null,
        order_product_id: null,
        quantity: '',
        name: '',
        product_id: '',
        type: ''
      },
      deliveryZone: {},
      deliveryZones: [],
      payments: [],
      payment: {
        payment_method: '',
        amount: 0,
        checkBox: false
      },
      orderProducts: [],
      paymentSelected: [],
      paymentOptions: [
        { text: 'Efectivo', value: 'Efectivo' },
        { text: 'Depósito', value: 'Depósito' },
        { text: 'Tarjeta de crédito', value: 'Tarjeta de crédito' }
      ],
      deliveryType: [
        { value: null, text: 'Seleccione modo de entrega' },
        { value: 'pedidosya', text: 'Pedidos Ya' },
        { value: 'delivery', text: 'Delivery' },
        { value: 'local', text: 'Local' }
      ],
      purchaseType: [
        { value: null, text: 'Seleccione tipo de compra' },
        { value: 'whatsapp', text: 'WhatsApp' },
        { value: 'tienda', text: 'Tienda' },
        { value: 'paginaweb', text: 'Página Web' },
        { value: 'instagram', text: 'Instagram' },
        { value: 'pedidosya', text: 'Pedidos Ya' }
      ],
      tempProd: [],
      tempExtra: [],
      clients: [],
      cTitles: [
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        {
          label: 'Teléfono',
          key: 'phone',
          class: 'text-center',
          sortable: true
        },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      principals: [],
      additionals: [],
      pTitles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        // { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      eTitles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        {
          label: 'Cantidad',
          key: 'quantity',
          class: 'text-center',
          sortable: true
        },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    url () {
      return `${window.location.origin}/form/public/${this.orderResponse.id}`
    },
    itbm () {
      let tax = 0
      for (const key in this.orderProducts) {
        if (this.orderProducts.hasOwnProperty(key)) {
          const element = this.orderProducts[key]
          tax += (element.price * element.tax) / 100
        }
      }
      let deliveyIBTM = parseFloat(this.deliveryCost) * 0.07
      tax = tax + deliveyIBTM
      this.order.itbm = tax;
      return tax
    },
    amount () {
      // Total a pagar
      let price = 0
      let prices = []
      let products = this.orderProducts
      for (const key in products) {
        if (products.hasOwnProperty(key)) {
          const element = products[key]
          prices.push(parseFloat(element.price))
        }
      }
      const add = prices => prices.reduce((a, b) => a + b, 0)
      price = add(prices)
      return price
    },
    additionalsPrice () {
      let total = 0
      for (const key in this.orderProducts) {
        if (this.orderProducts.hasOwnProperty(key)) {
          const product = this.orderProducts[key]
          for (const key in product.additionals) {
            if (product.additionals.hasOwnProperty(key)) {
              const a = product.additionals[key]
              if (a.type === "additional") {
                total += a.salePriceWithTax * a.quantity
              }
            }
          }
        }
      }
      return total
    },
    finalPrice () {
      console.log(parseFloat(this.amount))
      console.log(this.additionalsPrice)
      console.log(this.deliveryCost)
      console.log(parseFloat(this.itbm))
      console.log(this.order.discount)
      const monto =
        parseFloat(this.amount) +
        // this.additionalsPrice +
        this.deliveryCost +
        parseFloat(this.itbm) -
        this.order.discount
      return parseFloat(monto).toFixed(2)
    },
    payOut () {
      let amount = 0
      for (const key in this.payments) {
        if (this.payments.hasOwnProperty(key)) {
          const element = this.payments[key]
          if (!element.checkBox) {
            element.amount = 0
          }
          amount += parseFloat(element.amount)
        }
      }
      return amount
    },
    rest () {
      const amount = this.finalPrice - this.payOut
      return parseFloat(amount).toFixed(2)
    },
    buttonTitle () {
      if (this.orderProducts.length > 0) {
        return 'Añadir otro producto'
      }
      return 'Añadir producto'
    },
    nextBtn () {
      if (this.tabIndex === 0) {
        return 'Añadir productos'
      }
      return 'Método de pago'
    },
    backBtn () {
      if (this.tabIndex === 1) {
        return 'Datos de la orden'
      }
      if (this.tabIndex === 2) {
        return 'Añadir productos'
      }
      return 'Método de pago'
    }
  },
  watch: {
    client (newValue, oldValue) {
      if (this.client) {
        this.order.client_id = this.client.id
        this.order.client_dni = this.client.dni
        this.order.client_name = this.client.name
        this.$refs['modal-client'].hide()
      }
    }
  },
  methods: {
    async GetAllClientTable () {
      this.loading = true
      let config = {
        'scope': '1',
        'paginate': '1',
        'page': this.CurrentPageClient,
        'name': this.SearchTable
      }
      const { data, pagination } = await clientService.getAll('', config)
      if (this.Per_PageClient !== pagination.itemsPerPage){
        this.Per_PageClient = pagination.itemsPerPage
      }
      this.TotalRowsClient = pagination.totalItems
      this.loading = false
      return data
    },
    async GetAllProduct () {
      this.loading = true
      let config = {
        'scope': '1',
        'paginate': '1',
        'page': this.TypeList !== 'extras' ? this.CurrentPageProduct : this.CurrentPageProductExtra,
        'name': this.TypeList !== 'extras' ? this.SearchTable2 : this.SearchTable3,
        'type': this.TypeList !== 'extras' ? 'principal' : 'additional'
      }
      const { data, pagination } = await productService.getAll('', config)
      if (this.TypeList !== 'extras'){
        if (this.Per_PageProduct !== pagination.itemsPerPage){
          this.Per_PageProduct = pagination.itemsPerPage
        }
        this.TotalRowsProduct = pagination.totalItems
      } else {
        if (this.Per_PageProductExtra !== pagination.itemsPerPage){
          this.Per_PaPer_PageProductExtrageProduct = pagination.itemsPerPage
        }
        this.TotalRowsProductExtra = pagination.totalItems
      }
      let result = []
      data.map(r => {
        if (this.TypeList === 'lista-productos') {
          r.additionals = []
          r.note = ''
          r.note_design = ''
          r.personalized_text = ''
          r.quantity = 1
          result.push(r)
        }
        if (this.TypeList === 'extras') {
          r.isAddItem = false
          r.quantity = 1
          result.push(r)
        }
      })
      this.loading = false
      return result
    },
    showClientModal () {
      this.$refs['modal-client'].show()
    },
    deliveryCostChange ($event) {
      const object = this.deliveryZones.find(x => x.value === $event)
      this.deliveryCost = object.price
    },
    onModeChange () {
      if (this.order.mode !== 'delivery') {
        this.order.delivery_zone_id = null
        this.deliveryCost = 0
      }
    },
    addClient (item) {
      this.client = item
      this.order.client_id = item.id
      this.order.client_dni = item.dni
      this.order.client_name = item.name
      this.$refs['lista-clientes'].hide()
    },
    addItem (item) {
      if (this.status === 'add') {
        if (item.type === 'principal') {
          this.tempProd.push(item)
          this.handleOk()
        } else {
          item.isAddItem = true
          this.tempExtra.push(item)
        }
      }
      if (this.status === 'edit') {
        if (item.type === 'principal') {
          let product = {}
          product.additionals = []
          product.created_at = null
          product.deleted_at = null
          product.extraCost = 0
          product.id = null
          product.name = item.name
          product.note = ''
          product.note_design = ''
          product.order_id = this.order.id
          product.personalized_text = ''
          product.price = item.price
          product.priceWithTax = item.priceWithTax
          product.product = item
          product.product_id = item.id
          product.quantity = 1
          product.tax = item.tax
          this.orderProducts.push(product)
          this.handleOk()
        } else {
          const extra = {}
          extra.id = null
          // extra.order_product_id = 0
          extra.product_id = item.id
          extra.product = item
          item.type = 'extra'
          extra.created_at = null
          extra.deleted_at = null
          extra.name = item.name
          extra.price = item.price
          extra.priceWithTax = item.priceWithTax
          extra.quantity = item.quantity
          extra.salePriceWithTax = item.salePriceWithTax
          extra.sale_price = item.sale_price
          extra.tax = item.tax
          extra.type = 'extra'
          extra.updated_at = null
          this.tempExtra.push(extra)
        }
      }
    },
    addNote () {
      this.orderProducts[this.index].note = this.note
      this.note = ''
    },
    addDesignNote () {
      this.orderProducts[this.index].note_design = this.note_design
      this.note_design = ''
    },
    addPersonalizedNote () {
      this.orderProducts[this.index].personalized_text = this.personalized_text
    },
    delItem (id) {
      this.tempProd = this.tempProd.filter(x => x.id !== id)
    },
    deleteProduct (index) {
      const object = this.orderProducts[index].additionals
      let salePrice = 0

      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key]
          salePrice += element.quantity * element.sale_price
        }
      }
      this.orderProducts[index].note = ''
      this.orderProducts[index].note_design = ''
      this.orderProducts[index].personalized_text = ''
      this.orderProducts[index].price =
        this.orderProducts[index].price - salePrice
      this.orderProducts[index].additionals.length = 0
      this.orderProducts.splice(index, 1)
    },
    deleteExtra (index, indice) {
      const extraPrice = this.orderProducts[index].additionals[indice]
        .sale_price
      const qty = this.orderProducts[index].additionals[indice].quantity
      const price = this.orderProducts[index].price
      if (this.status === 'add') {
        this.orderProducts[index].priceerror = price - extraPrice * qty
        this.orderProducts[index].additionals.splice(indice, 1)
      }
    },
    deleteItem (product) {
      product.isAddItem = false
      product.quantity = 1
      this.tempExtra = this.tempExtra.filter((item) => item.id !== product.id)
    },
    getClient () {
      this.clients.map(r => {
        if (r.isAddItem) {
          r.isAddItem = false
        }
      })
      this.$refs['lista-clientes'].show()
    },
    handleOk () {
      if (this.status === 'add') {
        if (this.tempProd.length > 0) {
          for (const key in this.tempProd) {
            if (this.tempProd.hasOwnProperty(key)) {
              const element = { ...this.tempProd[key] }
              this.orderProducts.push(element)
            }
          }
        }
      }
      this.resetPrincipals()
      this.tempProd.length = 0
      this.$refs['lista-productos'].hide()
    },
    handleCancel () {
      if (this.orderProducts.length === 0) {
        this.principals.map(r => {
          r.isAddItem = false
        })
      }
      if (this.tempProd.length > 0) {
        this.principals.map(r => {
          this.tempProd.map(x => {
            if (r.id === x.id) {
              r.isAddItem = false
            }
          })
        })
      }
      this.tempProd.length = 0
      if (this.SearchTable !== ''){
        this.SearchTable = ''
      } else if (this.SearchTable2 !== ''){
        if (this.TypeList !== 'extras'){
          this.SearchTable2 = ''
        }
      }
    },
    handleOkExtra () {
      // let order_product_id = 0
      if (this.tempExtra.length > 0) {
        this.orderProducts[this.index].additionals.map(a => {
          if (a.type === 'extra') {
            this.tempExtra.map(e => {
              e.order_product_id = a.order_product_id
            })
          }
        })
        this.orderProducts[this.index].additionals.push(...this.tempExtra)
      }
      this.tempExtra.length = 0
      this.resetAdditionals()
    },
    handleCancelExtra () {
      if (this.orderProducts[this.index].additionals.length === 0) {
        this.additionals.map(r => {
          r.isAddItem = false
        })
      }
      if (this.tempExtra.length > 0) {
        let object = []
        object = this.orderProducts[this.index].additionals
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key]
            this.additionals.map(r => {
              if (r.id === element.id) {
                r.isAddItem = false
              }
            })
          }
        }
      }
      this.tempExtra.length = 0
      if (this.TypeList !== 'extras'){
        this.SearchTable2 = ''
      } else {
        this.SearchTable3 = ''
      }
    },
    resetPrincipals () {
      this.principals.map(r => {
        if (r.isAddItem) {
          r.isAddItem = false
        }
      })
    },
    resetAdditionals () {
      this.additionals.map(r => {
        if (r.isAddItem) {
          r.isAddItem = false
        }
      })
    },
    showPersonalizedText (index) {
      this.personalized_text = ''
      this.index = index
      if (
        this.status === 'edit' &&
        this.orderProducts[this.index].product.personalized
      ) {
        this.personalized_text = this.orderProducts[this.index].personalized_text
      }

      this.$refs['modal-personalized'].show()
    },
    showModalNote (index) {
      this.index = index
      this.note = this.orderProducts[this.index].note
      this.$refs['modal-note'].show()
    },
    showModalDesignNote (index) {
      this.index = index
      this.note_design = this.orderProducts[this.index].note_design
      this.$refs['modal-design-note'].show()
    },
    onComplete () {
      // this.order.delivery_date = `${this.order.delivery_date} ${this.deliveryTime}`
      this.loading = true

      if (this.status === 'add') {
        orderService
          .create(this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(() => {
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      }
      if (this.status === 'edit') {
        orderService
          .update(this.order.id, this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(() => {
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    showModal (modal, index) {
      this.index = index
      this.TypeList = modal
      this.updateAdditionals()
      this.$refs[modal].show()
    },
    tabChange (prevIndex, nextIndex) {
      this.tabIndex = nextIndex
    },
    updateAdditionals () {
      if (this.orderProducts[this.index] !== undefined) {
        let extras = this.additionals
        let object = this.orderProducts[this.index].additionals
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key]
            extras.map(r => {
              if (r.id === element.id) {
                r.isAddItem = true
              } else {
                r.isAddItem = false
              }
            })
          }
        }
      }
    },
    validateOrder () {
      return this.$refs.form.validate().then(success => {
        return success
      })
    },
    validateProducts () {
      if (this.orderProducts.length === 0) {
        this.validateMsg =
          'Debe agregar al menos un producto antes de continuar'
        return false
      }

      this.validateMsg = ''

      if (this.status === 'add') {
        this.order.products.length = 0

        for (const key in this.orderProducts) {
          if (this.orderProducts.hasOwnProperty(key)) {
            const element = this.orderProducts[key]
            this.product = {}
            this.product.price = element.price
            this.product.product_id = element.id
            this.product.name = element.name
            this.product.note_design = element.note_design
            this.product.note = element.note
            this.product.personalized_text = element.personalized_text
            this.product.image = element.image
            this.product.quantity = 1
            this.product.additionals = []
            for (const key in element.additionals) {
              if (element.additionals.hasOwnProperty(key)) {
                const item = element.additionals[key]
                this.additional = {}
                this.additional.product_id = item.id
                this.additional.name = item.name
                this.additional.quantity = item.quantity
                this.additional.type = 'extra'
                this.additional.salePriceWithTax = item.salePriceWithTax
                this.product.additionals.push(this.additional)
              }
            }
            this.order.products.push(this.product)
          }
        }
      }

      return true
    },
    validatePayment () {
      if (this.rest < 0) {
        return false
      }
      this.order.payments = this.payments
      return true
    },
    finishOrder () {
      if (this.sendForm) {
        this.loading = true
        orderService
          .emailForm(this.orderResponse.id)
          .then(response => {
            if (response.status) {
              this.$router.push({ name: 'orders.list' })
            }
          })
          .catch(() => {
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$router.push({ name: 'orders.list' })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import url('https://rawgit.com/lykmapipo/themify-icons/master/css/themify-icons.css');

#row {
  border: 1px solid #E5E8E8;
  border-radius: 7px;
  padding: 20px;
}

#spinner {
  z-index: 1000;
  position: absolute;
  left: 40vw;
}

#image {
  width: 132px;
  height: auto;
}

#price {
  font-weight: 300;
}

.error {
  color: var(--pa-danger);
}

.success {
  color: var(--pa-light-blue);
}

.btn-link-personlized {
  color: var(--iq-success);
}

.btn_add_client{
  background: #eefff2 !important;
  color: var(--iq-success-dark) !important;
  font-size: 14px;
  font-family: "Muli", sans-serif;
  border-radius:0px
  border:0px;
}

@media print {
  .printable {
    text-transform: none;
  }
}
</style>
