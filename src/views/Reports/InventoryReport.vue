<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert :show="isShow" variant="success" class="bg-white" id="alert">
          <div class="iq-alert-icon">
            <i class="ri-alert-line"></i>
          </div>
        </b-alert>
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-show="search">
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
            <b-row v-else align-h="end">
              <b-col md="12" class="my-1 mb-3">
                <b-row align-h="end">
                  <b-col md="3">
                    Tipo producto
                    <b-form-select
                      v-model="filters.typeProduct"
                      :options="options.typeProduct"
                      size="sm"
                    ></b-form-select>
                  </b-col>
                  <b-col md="3">
                    Categoría
                    <b-form-select
                      v-model="filters.categoryId"
                      :options="options.categories"
                      size="sm"
                    ></b-form-select>
                  </b-col>
                  <b-col md="2">
                    Fecha inicial
                    <b-form-input
                      v-model="filters.initDate"
                      type="date"
                    ></b-form-input>
                  </b-col>
                  <b-col md="2">
                    Fecha final
                    <b-form-input
                      v-model="filters.endDate"
                      type="date"
                    ></b-form-input>
                  </b-col>
                  <b-col md="2" align-self="end">
                    <b-button
                      variant="primary"
                      v-b-tooltip.top="'Buscar'"
                      class="mr-2"
                      @click="getData()"
                    >
                      <i class="ri-search-line"></i>
                    </b-button>
                    <b-button
                      class="mr-2"
                      variant="outline-success"
                      v-b-tooltip.top="'Descargar a PDF'"
                      @click="exportPDF"
                    >
                      <i class="ri-download-cloud-line"></i>
                    </b-button>
                    <download-excel
                      class="btn btn-outline-warning"
                      :data="results"
                      :fields="titulos"
                      worksheet="Reporte de inventario"
                      name="Reporte de inventario.xls"
                    >
                      <i class="ri-file-excel-2-line"></i>
                    </download-excel>
                  </b-col>
                </b-row>
              </b-col>
              <template v-if="results.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registros para mostrar.</b>
                    </div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    ref="content"
                    striped
                    bordered
                    hover
                    :items="results"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    @filtered="onFiltered"
                  >
                  </b-table>
                </b-col>
                <b-col sm="5" md="4">
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
                </b-col>
                <b-col sm="7" md="8">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="right"
                    aria-controls="my-table"
                  >
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
import reportsService from '@/services/reports'
import categoryService from '@/services/category'

export default {
  name: 'OrdersReport',
  created () {},
  mounted () {
    vito.index()

    var date = new Date()

    // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)

    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    this.filters.initDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    this.filters.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    this.getData()

    categoryService.getAll(``)
      .then(response => {
        response.data.map(r => {
          r.value = r.id
          r.text = r.name
        })
        this.options.categories = this.options.categories.concat(response.data)
      })
      .catch(() => { })
      .finally(() => { this.loading = false })
  },
  data () {
    return {
      titulos: {
        'Producto': 'name',
        'Inventario Inicial': 'initialInventory',
        'Entradas': 'entries',
        'Salidas': 'outputs',
        'Existencia': 'existence'
      },
      filters: {
        typeProduct: '',
        categoryId: '',
        orders: [],
        initDate: '',
        endDate: ''
      },
      options: {
        typeProduct: [
          { value: '', text: 'Todos' },
          { value: 'principal', text: 'Principal' },
          { value: 'additional', text: 'Adicional' }
        ],
        categories: [
          { value: '', text: 'Todos' }

        ]
      },
      results: [],
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      search: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      titles: [
        { label: 'Producto', key: 'name', class: 'text-center' },
        { label: 'Inventario Inicial', key: 'initialInventory', class: 'text-center' },
        { label: 'Entradas', key: 'entries', class: 'text-center' },
        { label: 'Salidas', key: 'outputs', class: 'text-center' },
        { label: 'Existencia', key: 'existence', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.results.length
    }
  },
  methods: {
    exportPDF () {
      let params = `?init_date=${this.filters.initDate}&end_date=${this.filters.endDate}`
      if (this.filters.typeProduct) {
        params += `&type_product=${this.filters.typeProduct}`
      }
      if (this.filters.categoryId) {
        params += `&category_id=${this.filters.categoryId}`
      }
      reportsService.getInvengoryPdf(params)
    },
    getData () {
      this.search = true
      let params = `init_date=${this.filters.initDate}&end_date=${this.filters.endDate}`
      if (this.filters.typeProduct) {
        params += `&type_product=${this.filters.typeProduct}`
      }
      if (this.filters.categoryId) {
        params += `&category_id=${this.filters.categoryId}`
      }
      reportsService.getInventoryReport(params)
        .then(response => {
          this.results = response.data
        }).catch(error => {
          console.log('Error catch')
          console.log(error)
        }).finally(() => { this.search = false })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }

  }
}
</script>

<style>
</style>
