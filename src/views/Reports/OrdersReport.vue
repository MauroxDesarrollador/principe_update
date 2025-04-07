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
                    Fecha inicial
                    <b-form-input
                      v-model="filters.initDate"
                      type="date"
                    ></b-form-input>
                  </b-col>
                  <b-col md="3">
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
                      class="mx-2"
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
                      :data="excel"
                      worksheet="Reporte de ganancias"
                      name="Reporte de ganancias.xls"
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
                    <template v-slot:cell(type)="results">
                      {{ results.item.type | capitalize }}
                    </template>
                    <template v-slot:cell(status)="orders">
                      <b-badge
                        variant="primary"
                        v-if="orders.item.status === 'Creado'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="secondary"
                        v-if="orders.item.status === 'Pendiente'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="warning"
                        v-if="orders.item.status === 'En confección'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="light"
                        v-if="orders.item.status === 'Confeccionado'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="info"
                        v-if="orders.item.status === 'En camino a reparto'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="success"
                        v-if="orders.item.status === 'Entregado'"
                        >{{ orders.item.status }}</b-badge
                      >
                      <b-badge
                        variant="danger"
                        v-if="orders.item.status === 'Cancelado'"
                        >{{ orders.item.status }}</b-badge
                      >
                    </template>
                    <template v-slot:cell(created_at)="orders">
                      {{ orders.item.created_at | formatDate }}
                    </template>
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
import orderService from '@/services/order'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'OrdersReport',
  created () {
    this.getData()

    orderService.getAll()
      .then(response => {
        response.data.map(r => {
          r.value = r.id
          r.text = r.name
        })
        this.options.orders = this.options.orders.concat(response.data)
      })
      .catch(() => { })
      .finally(() => { this.loading = false })
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      filters: {
        type: '',
        orders: [],
        initDate: '',
        endDate: ''
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
        { label: 'Id', key: 'id', class: 'text-center' },
        { label: 'Cliente', key: 'client.name', class: 'text-center' },
        { label: 'Tipo de compra', key: 'type', class: 'text-center' },
        { label: 'Status', key: 'status', class: 'text-center' },
        { label: 'Fecha', key: 'created_at', class: 'text-center' },
        { label: 'Total', key: 'total', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.results.length
    },
    excel () {
      let excelResults = JSON.parse(JSON.stringify(this.results))
      excelResults = excelResults.map(result => {
        result.client = result.client.name

        result.products = result.products.reduce((acc, value) => {
          acc.push(value.name)
          return acc
        }, []).join(', ')

        result.payments = result.payments.reduce((acc, value) => {
          acc.push(value.payment_method)
          return acc
        }, []).join(', ')

        return result
      })
      return excelResults
    }
  },
  methods: {
    exportPDF () {
      const doc = new JsPDF()
      let columns = [
        { title: 'Id', dataKey: 'id' },
        { title: 'Cliente', dataKey: 'client.name' },
        { title: 'Tipo', dataKey: 'type' },
        { title: 'Status', dataKey: 'status' },
        { title: 'Fecha', dataKey: 'created_at' },
        { title: 'Total', dataKey: 'total' }
      ]
      doc.text('Reporte de Ganancias', 20, 20)
      doc.autoTable(columns, this.results, { margin: { top: 30 } })
      doc.save('Reporte de Ganancias.pdf')
    },
    getData () {
      this.search = true
      let params = `init_date=${this.filters.initDate}&end_date=${this.filters.endDate}`
      reportsService.getOrderReport(params)
        .then(response => {
          this.results = response.data
        })
        .catch(() => { })
        .finally(() => { this.search = false })
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
