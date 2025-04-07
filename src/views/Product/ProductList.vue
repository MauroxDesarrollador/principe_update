<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert :show="isShow" variant="success" class="bg-white spinner">
          <div class="iq-alert-icon">
            <i class="ri-alert-line"></i>
          </div>
          <div class="iq-alert-text">
            El registro ha sido
            <b>eliminado</b> con éxito!
          </div>
        </b-alert>
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-show="isRemoving">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-row align-h="between">
              <b-col md="4" class="my-1">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      autocomplete="off"
                      type="text"
                      id="filterInput"
                      debounce="500"
                      placeholder="Escriba para buscar"
                      @input="ChangeInput"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="CleanInput"
                        >Limpiar</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="2" class="my-1">
                <b-form-group class="mb-0">
                  <b-form-select
                    v-model="selectedType"
                    id="types"
                    size="sm"
                    :options="typesOptions"
                    @change="onChange"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="2" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add"
                    >Nuevo producto</b-button
                  >
                </b-form-group>
              </b-col>
              <template  :style="{visibility: StatusData ? 'visible' : 'hidden'}">
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="loadData"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    ref="table"
                  >
                    <template v-slot:cell(name)="products">
                      <label for class="text-capitalize">{{
                        products.item.name
                      }}</label>
                    </template>
                    <template v-slot:cell(type)="products">{{
                      products.item.type === "principal"
                        ? "Principal"
                        : "Adicional"
                    }}</template>
                    <template v-slot:cell(price)="products"
                      >{{ products.item.price }} $</template
                    >
                    <template v-slot:cell(sale_price)="products"
                      >{{ products.item.sale_price }} $</template
                    >
                    <template v-slot:cell(personalized)="products">
                      {{
                        products.item.personalized === 0
                          ? "Standard"
                          : "Personalizado"
                      }}
                    </template>
                    <template v-slot:cell(image)="products">
                      <b-img
                        v-viewer="{ movable: false }"
                        center
                        rounded="circle"
                        :src="
                          products.item.image
                            ? products.item.image
                            : require(`@/assets/images/no-image.png`)
                        "
                        id="image"
                        class
                      ></b-img>
                    </template>
                    <template v-slot:cell(action)="products">
                      <b-dropdown
                        id="dropdownMenuButton5"
                        right
                        variant="none"
                        data-toggle="dropdown"
                      >
                        <template v-slot:button-content>
                          <span class="text-primary"
                            ><i class="ri-more-fill"></i
                          ></span>
                        </template>
                        <b-dropdown-item
                          @click="inventory(products.item)"
                          variant=" iq-bg-primary mr-1 mb-1"
                        >
                          <i class="ri-eye-fill mr-2"></i>
                          Inventario
                        </b-dropdown-item>

                        <b-dropdown-item
                          @click="edit(products.item)"
                          variant=" iq-bg-success mr-1 mb-1"
                        >
                          <i class="ri-pencil-fill mr-2"></i>
                          {{ $t("dropdown.edit") }}
                        </b-dropdown-item>

                        <b-dropdown-item
                          @click="remove(products.item)"
                          variant=" iq-bg-danger mr-1 mb-1"
                        >
                          <i class="ri-delete-bin-6-fill mr-2"></i>
                          {{ $t("dropdown.delete") }}
                        </b-dropdown-item>
                      </b-dropdown>
                    </template>
                  </b-table>
                </b-col>
                <!-- <b-col sm="5" md="4">
                  <b-form-group
                    label="Resultados por página"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="perPage"
                      id="perPageSelect"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col> -->
                <b-col sm="12" md="12" :style="{visibility: StatusData ? 'visible' : 'hidden'}">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="center"
                    aria-controls="my-table"
                  ></b-pagination>
                </b-col>
              </template>
              <template v-if="!StatusData">
                <b-col class="col-md-12" >
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registros para mostrar.</b> Por favor agrege un
                      producto para comenzar!
                    </div>
                  </b-alert>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
      <b-modal size="lg" id="modal-1" :title="title" ref="my-modal">
        <InventoryList :product="product"></InventoryList>
      </b-modal>
    </b-row>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import productService from '@/services/product'
import InventoryList from '@/views/Inventory/InventoryList'

export default {
  name: 'ProductList',
  components: { InventoryList },
  created () { },
  mounted () {
    vito.index()
  },
  data () {
    return {
      sortBy: '',
      loading: true,
      filter: '',
      isShow: false,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      StatusData: true,
      product: {
        id: 0,
        name: '',
        description: '',
        type: '',
        price: 0,
        image: '',
        personalized: ''
      },
      typesOptions: [
        { value: null, text: 'Tipo de Producto' },
        { value: true, text: 'Principal' },
        { value: false, text: 'Adicional' }
      ],
      titles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center' },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Precio Costo', key: 'price', class: 'text-center', sortable: true },
        { label: 'Precio Venta', key: 'sale_price', class: 'text-center', sortable: true },
        { label: 'Tipo', key: 'type', class: 'text-center', sortable: true },
        { label: 'Personalizado', key: 'personalized', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      products: [],
      isBusy: false
    }
  },
  methods: {
    async loadData () {
      this.loading = true
      let config = {
        'scope': '1',
        'paginate': '1',
        'page': this.currentPage,
        'name': this.filter
      }
      const { data, pagination } = await productService.getAll('', config)
      if (data.length > 0){
        this.StatusData = true
        if (pagination.itemsPerPage !== this.perPage){
          this.perPage = pagination.itemsPerPage
        }
        this.totalRows = pagination.totalItems
      } else {
        this.StatusData = false
      }
      this.loading = false
      this.isShow = false
      return data
    },
    add () {
      this.$router.push({ name: 'product.add' })
    },
    edit (item) {
      this.$router.push({ name: 'product.edit', params: { id: item.id } })
    },
    submit (item) {
      // item.editable = false
    },
    remove (item) {
      this.$bvModal.msgBoxConfirm('Esta seguro que desea eliminar el registro?.', {
        title: 'Por favor confirme',
        okVariant: 'danger',
        okTitle: 'Si',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.isRemoving = true
            productService.delete(item.id)
              .then(res => {
                this.isShow = true
                this.$refs.table.refresh()
              })
              .catch((error) => { console.error(error) })
              .finally(() => {
                this.isRemoving = false
              })
          }
        })
        .catch(err => { console.error(err) })
    },
    inventory (item) {
      this.product = item
      this.$refs['my-modal'].show()
    },
    CleanInput () {
      this.filter = ''
      this.StatusData = true
    },
    ChangeInput () {
      if (!this.StatusData && this.filter === '') {
        this.$refs.table.refresh()
      }
    },
    onChange () {
      if (this.selectedType !== null) {
        this.sortBy = 'type'
      } else {
        this.sortBy = ''
      }
      this.sortDesc = this.selectedType
    }
  },
  computed: {
    title () {
      return `Listado de inventario ${this.product.name}`
    }
  }
}
</script>

<style scoped>
#image {
  width: 64px;
  height: 64px;
}
</style>
