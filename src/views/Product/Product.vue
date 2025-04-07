<template>
  <b-container fluid>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:body>
                <div class="new-user-info">
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
                  <b-row align-v="end">
                    <b-form-group
                      class="col-md-6"
                      label="Nombre:"
                      label-for="name"
                    >
                      <ValidationProvider
                        name="Nombre"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-input
                          v-model="product.name"
                          type="text"
                          placeholder="Nombre"
                          class="text-capitalize"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group
                      class="col-md-6"
                      label="Descripción:"
                      label-for="description"
                    >
                      <ValidationProvider
                        name="Description"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-input
                          v-model="product.description"
                          type="text"
                          placeholder="Descripción"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group
                      class="col-md-6"
                      label="Categoría:"
                      label-for="category"
                      lot-scope="{ valid, errors }"
                    >
                      <ValidationProvider
                        name="Categoria"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-select
                          :state="
                            errors[0]
                              ? false
                              : product.category_id
                              ? true
                              : null
                          "
                          v-model="product.category_id"
                          :options="categories"
                        ></b-form-select>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <!-- Tipo -->
                    <b-form-group
                      class="col-md-6"
                      label="Tipo:"
                      label-for="type"
                    >
                      <ValidationProvider
                        name="Tipo"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-select
                          :state="
                            errors[0] ? false : product.type ? true : null
                          "
                          v-model="product.type"
                          :options="types"
                          @change="onTypeChange"
                        ></b-form-select>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <!-- Precio -->
                    <b-form-group
                      class="col-md-6"
                      label="Precio:"
                      label-for="price"
                    >
                      <ValidationProvider
                        name="Precio"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-input
                          v-if="product.price"
                          v-model.lazy="product.price"
                          type="text"
                          name="price"
                          id="price"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                          placeholder="Precio"
                        ></b-form-input>
                        <b-form-input
                          v-else
                          v-money="money"
                          v-model.lazy="product.price"
                          type="text"
                          name="price"
                          id="price"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                          placeholder="Precio"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <!-- Sale Price -->
                    <b-form-group
                      v-show="hideSalePrice"
                      class="col-md-6"
                      label="Precio de venta:"
                      label-for="price"
                    >
                      <ValidationProvider
                        name="Precio"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <b-form-input
                          v-show="hideSalePrice"
                          v-if="product.sale_price"
                          v-model.lazy="product.sale_price"
                          type="text"
                          name="price"
                          id="price"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                          placeholder="Precio"
                        ></b-form-input>
                        <b-form-input
                          v-else
                          v-money="money"
                          v-model.lazy="product.sale_price"
                          type="text"
                          name="sale_price"
                          id="sale_price"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                          placeholder="Precio de venta"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <!-- ITBMS -->
                    <b-form-group
                      class="col-md-6"
                      label="ITBMS:"
                      label-for="itbms_price"
                    >
                      <b-form-select v-model="product.tax" :options="itbms">
                      </b-form-select>
                    </b-form-group>
                    <!-- CheckBox Personalizado -->
                    <b-form-group class="col-md-6" label-for="personalized">
                      <div class="checkbox d-inline-block mr-2">
                        <input
                          type="checkbox"
                          class="checkbox-input"
                          v-model="product.personalized"
                        />
                        <label class="ml-2"
                          >Este producto es personalizado</label
                        >
                      </div>
                    </b-form-group>
                    <!-- Agregar Subproductos -->
                    <b-form-group
                      class="col-md-4"
                      label-for="type"
                      v-show="product.type === 'principal'"
                    >
                      <b-button
                        block
                        v-b-modal.modal-lg
                        variant="primary"
                        @click="addSubproduct"
                        v-b-modal.modal-1
                        >Agregar subproductos</b-button
                      >
                    </b-form-group>
                    <b-form-group
                      class="col-md-2"
                      label-for="type"
                      v-show="product.type === 'principal'"
                    >
                      <h6 class="mb-3">
                        Agregados
                        <b-badge variant="info">{{ subs }}</b-badge>
                      </h6>
                    </b-form-group>
                    <b-form-group class="col-md-12">
                      <vue-dropzone
                        :options="dropzoneOptions"
                        :useCustomSlot="true"
                        :id="'image'"
                        v-on:vdropzone-success="fileAdded"
                      >
                        <div class="dropzone-custom-content">
                          <h3 class="dropzone-custom-title">
                            Arrastra y suelta para subir contenido!
                          </h3>
                          <div class="subtitle">
                            ...o haga clic para seleccionar un archivo de su
                            computadora
                          </div>
                        </div>
                      </vue-dropzone>
                    </b-form-group>
                  </b-row>
                  <hr />
                  <b-modal
                    size="lg"
                    id="modal-1"
                    title="Lista de subproductos"
                    cancel-title="Cancelar"
                    no-close-on-esc
                    no-close-on-backdrop
                    hide-header-close
                    @ok="handleOk"
                    @cancel="handleCancel"
                  >
                    <modal-table
                      :items="subProducts"
                      :titems="subProductTitle"
                      v-on:add-item="addSub"
                      v-on:delete-item="deleteSub"
                    ></modal-table>
                  </b-modal>
                  <b-button variant="primary" type="submit">{{
                    btnTitle
                  }}</b-button>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import productService from '@/services/product'
import categoryService from '@/services/category'
import { VMoney } from 'v-money'
import ModalTable from '@/components/Modals/ModalTable'

export default {
  name: 'Product',
  components: {
    vueDropzone: vue2Dropzone,
    ModalTable
  },
  directives: { money: VMoney },
  created () {
    categoryService.getAll()
      .then(response => {
        const data = response.data
        this.category.value = null
        this.category.text = 'Seleccione un tipo'
        this.categories.push(this.category)
        data.map(r => {
          this.category = {}
          this.category.value = r.id
          this.category.text = r.name
          this.categories.push(this.category)
        })
      })
      .catch((error) => { console.error(error) })
    if (this.getStatus() === 'add') {
      this.title = 'Agregar nuevo producto'
      this.btnTitle = 'Nuevo producto'
      productService.getAll('type=additional')
        .then(response => {
          const data = response.data
          data.map(r => {
            r.quantity = 0
          })
          this.subProducts = data
        })
        .catch((error) => { console.error(error) })
    }
    if (this.getStatus() === 'edit') {
      this.loading = true
      this.title = 'Editar producto'
      this.btnTitle = 'Guardar cambios'
      productService.getAll('type=additional')
        .then(response => {
          const data = response.data
          data.map(r => {
            r.quantity = 0
          })
          this.subProducts = data
        })
        .catch((error) => { console.error(error) })

      productService.getById(this.$route.params.id)
        .then(response => {
          this.product = response.data
          this.subProducts = this.product.additionals
          this.subs = this.product.additionals.length
          this.subProducts.map(r => {
            r.quantity = r.pivot.quantity
          })
          this.selectedType = this.product.type
          this.selectedCategory = this.product.category_id
          if (this.product.type === 'additional') {
            this.hideSalePrice = true
          }
        })
        .catch((error) => { console.error(error) })
        .finally(() => { this.loading = false })
    }
  },
  mounted () { vito.index() },
  data () {
    return {
      isShow: false,
      loading: false,
      hideSalePrice: false,
      subs: 0,
      money: {},
      itbms: [
        { value: 0, text: '0%' },
        { value: 7, text: '7%' }
      ],
      product: {
        name: '',
        description: '',
        price: null,
        tax: 7,
        sale_price: null,
        category_id: null,
        type: null,
        image: '',
        personalized: false,
        relatedProducts: []
      },
      types: [
        { value: null, text: 'Seleccione un tipo' },
        { value: 'principal', text: 'Principal' },
        { value: 'additional', text: 'Adicional' }
      ],
      categories: [],
      category: {},
      subProductTitle: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      subProducts: [ ],
      dropzoneOptions: {
        maxFilesize: 10,
        clickable: true,
        thumbnailWidth: 150,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        url: 'https://httpbin.org/post'
      }
    }
  },
  methods: {
    onTypeChange ($event) {
      if ($event === 'additional') {
        this.hideSalePrice = true
      } else {
        this.hideSalePrice = false
      }
    },
    getStatus () {
      const id = this.$route.params.id
      if (id) return 'edit'
      if (!id) return 'add'
    },
    addSubproduct () {
      // alert('agregar subproducto')
    },
    addSub (item) {
      // Captura el item del componente hijo SubProductTable
      let subItem = {}
      subItem.additional_product_id = item.id
      subItem.quantity = item.quantity
      if (!this.product.relatedProducts) {
        this.product.relatedProducts = []
      }
      this.product.relatedProducts.push(subItem)
      this.subs = this.product.relatedProducts.length
    },
    handleOk () {
    },
    handleCancel () {
      this.product.relatedProducts.length = 0
      this.subs = 0
    },
    deleteSub (id) {
      let relatedProducts = this.product.relatedProducts.filter(x => x.additional_product_id !== id)
      this.product.relatedProducts = relatedProducts
      this.subs = this.product.relatedProducts.length
    },
    fileAdded (file) {
      this.product.image = file.dataURL
    },
    onSubmit () {
      this.loading = true
      this.product.price = parseFloat(this.product.price)
      if (this.getStatus() === 'add') {
        productService.create(this.product)
          .then(response => {
            if (response.status) {
              this.$router.push({ name: 'product.list' })
            }
          })
          .catch((error) => { console.error(error) })
          .finally(() => { this.loading = false })
      }
      if (this.getStatus() === 'edit') {
        productService.update(this.$route.params.id, this.product)
          .then(response => {
            if (response.status) {
              this.$router.push({ name: 'product.list' })
            }
          })
          .catch((error) => { console.error(error) })
          .finally(() => { this.loading = false })
      }
    }
  }
}
</script>

<style scoped>
#spinner {
  z-index: 1000;
  position: absolute;
  left: 40vw;
}
</style>
