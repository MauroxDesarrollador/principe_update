<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <div class="text-center" id="spinner" v-show="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </div>
            <b-alert :show="isError" variant="danger">
              <div class="iq-alert-text">Debe seleccionar un proveedor!</div>
            </b-alert>
            <b-row align-h="between">
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="quantity"
                      type="number"
                      id="quantity"
                      placeholder="Cantidad">
                    </b-form-input>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-form-select
                    v-model="selectedProvider"
                    id="providers"
                    size="sm"
                    :options="providerOptions"
                    @change="onChange">
                    </b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Añadir</b-button>
                </b-form-group>
              </b-col>
              <template>
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
                    ref="table">
                  </b-table>
                </b-col>
                <!-- <b-col sm="5" md="6">
                  <b-form-group
                    label="Resultados por página"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0">
                    <b-form-select
                      v-model="perPage"
                      id="perPageSelect"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col> -->
                <b-col sm="12" md="12">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="center"
                    aria-controls="my-table">
                  </b-pagination>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import inventoryService from '@/services/inventory'
import providerService from '@/services/provider'

export default {
  props: { product: { type: Object } },
  name: 'InventoryList',
  created () { },
  mounted () {
    vito.index()
    providerService.getAll()
      .then(response => {
        const data = response.data
        this.providers.value = null
        this.providers.text = 'Seleccionar proveedor'
        this.providerOptions.push(this.providers)
        data.map(r => {
          this.providers = {}
          this.providers.value = r.id
          this.providers.text = r.name
          this.providerOptions.push(this.providers)
        })
      })
      .catch(error => { console.error(error) })
      .finally(() => { console.error('finally') })
  },
  data () {
    return {
      isError: false,
      quantity: 0,
      sortBy: '',
      selectedProvider: null,
      providers: {},
      providerOptions: [],
      loading: true,
      filter: null,
      isShow: false,
      isEmpty: true,
      isRemoving: false,
      perPage: 5,
      selectedType: null,
      sortDesc: false,
      pageOptions: [3, 5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      data: [],
      titles: [
        { label: 'Producto', key: 'product.name', class: 'text-left' },
        { label: 'Cantidad', key: 'quantity', class: 'text-left' },
        { label: 'Proveedor', key: 'provider.name', class: 'text-left' }
      ]
    }
  },
  computed: {
  },
  methods: {
    onChange () {
      if (this.selectedProvider !== null) {
        this.sortBy = 'provider'
      } else {
        this.sortBy = ''
      }
      this.sortDesc = true
    },
    add () {
      if (this.selectedProvider) {
        const inv = {}
        inv.product_id = this.product.id
        inv.quantity = parseInt(this.quantity)
        inv.provider_id = this.selectedProvider
        inv.type = 'purchase'
        this.loading = true
        inventoryService.create(inv)
          .then(response => {
            this.$refs.table.refresh()
          })
          .catch((error) => { console.error(error) })
          .finally(() => { console.error('finally') })
      } else {
        this.isError = true
      }
    },
    async loadData () {
      let config = {
        'scope': '1',
        'paginate': '1',
        'page': this.currentPage,
        'name': this.filter
      }
      const { data, pagination } = await inventoryService.getAll(`product_id=${this.product.id}`, config)
      this.perPage = pagination.itemsPerPage
      this.totalRows = pagination.totalItems
      this.loading = false
      return data
    }
  }
}
</script>

<style lang="stylus" scoped>
  #spinner {
    z-index: 1000;
    position: relative;
    left: 0;

  }
</style>
