<template>
  <b-container fluid>
    <b-row>
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
            <b-row v-else align-h="between">
              <b-col md="12" class="my-1 mb-3">
                <b-row align-h="end">
                  <b-col md="3">
                    Fecha inicial
                    <b-form-input
                      v-model="startDate"
                      type="date"
                    ></b-form-input>
                  </b-col>
                  <b-col md="3">
                    Fecha final
                    <b-form-input v-model="endDate" type="date"></b-form-input>
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
                      :data="excel"
                      worksheet="Cuentas por cobrar"
                      name="Cuentas por cobrar.xls"
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
                <b-col md="12">
                  <div class="my-3">
                    <b-row align-h="end">
                      <b-col sm="6">
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >Cuentas x Cobrar</b-col
                          >
                          <b-col sm="6"> ${{ totalCredit }}</b-col>
                        </b-row>
                        <b-row>
                          <b-col sm="6" style="color: #0b0b0b"
                            >Facturas Pendientes.</b-col
                          >
                          <b-col sm="6"> {{ results.length }}</b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="my-3">
                    <b-row>
                      <b-col md="12" class="table-responsive">
                        <b-table
                          ref="content"
                          striped
                          bordered
                          hover
                          :items="results"
                          :filter="filter"
                          :fields="titles"
                          :sort-by.sync="sortBy"
                        >
                          <template v-slot:cell(created_at)="results">
                            {{ results.item.created_at | formatDate }}
                          </template>
                          <template v-slot:cell(products)="results">
                            <label
                              v-for="(product, i) in results.item.products"
                              :key="i"
                              >{{ product.name
                              }}<span
                                v-if="results.item.products.length - 1 > i"
                              >
                                -
                              </span></label
                            >
                          </template>
                          <template v-slot:cell(total)="results">
                            {{ parseFloat(results.item.total).toFixed(2) }}
                          </template>
                          <template v-slot:cell(totalPaid)="results">
                            {{ parseFloat(results.item.totalPaid).toFixed(2) }}
                          </template>
                          <template v-slot:cell(saldo)="results">
                            {{
                              parseFloat(
                                (
                                  parseFloat(results.item.total) -
                                  parseFloat(results.item.totalPaid)
                                ).toFixed(2)
                              ).toFixed(2)
                            }}
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                  </div>
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
import moment from 'moment'

export default {
  name: 'Moment',
  created () {},
  mounted () {
    vito.index()
    const dateInit = new Date()
    dateInit.setDate(dateInit.getDate() - 8)
    const dateEnd = new Date()
    dateEnd.setDate(dateEnd.getDate())
    const formatDateInit = moment(String(dateInit)).format('YYYY-MM-DD')
    const formatDateEnd = moment(String(dateEnd)).format('YYYY-MM-DD')
    this.startDate = formatDateInit
    this.endDate = formatDateEnd
    this.getData()
  },
  data () {
    return {
      startDate: '',
      endDate: '',
      results: [],
      category: {
        qty: null,
        val: null
      },
      gProducts: {},
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      totalCredit: 0,
      titles: [
        { label: '#Orden', key: 'id', class: 'text-center', sortable: true },
        { label: 'Cliente', key: 'client.name', class: 'text-center', sortable: true },
        { label: 'Teléfono.', key: 'client.phone', class: 'text-center', sortable: true },
        { label: 'F. de Compra', key: 'created_at', class: 'text-center', sortable: true },
        { label: 'Productos', key: 'products', class: 'text-center', sortable: true },
        { label: 'Total Compra', key: 'total', class: 'text-center', sortable: false },
        { label: 'Abono', key: 'totalPaid', class: 'text-center', sortable: false },
        { label: 'Saldo', key: 'saldo', class: 'text-center' }
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
      let params = `start_date=${this.startDate}&end_date=${this.endDate}`
      reportsService.getAccountsReceivableReportPdf(params)
    },
    getData () {
      // eslint-disable-next-line no-unused-vars
      let params = ''
      params = `start_date=${this.startDate}&end_date=${this.endDate}`
      reportsService.getAccountsReceivableReport(params)
        .then(response => {
          this.results = response.data
          console.log(this.results)
          let totalPaid = this.results.reduce((a, b) => a + parseFloat(b.totalPaid), 0)
          let total = this.results.reduce((a, b) => a + parseFloat(b.total), 0)
          this.totalCredit = (total - totalPaid).toFixed(2)
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
