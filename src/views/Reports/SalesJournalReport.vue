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
                      :fields="titulos"
                      worksheet="Reporte diario de ventas"
                      name="Reporte diario de ventas.xls"
                    >
                      <i class="ri-file-excel-2-line"></i>
                    </download-excel>
                  </b-col>
                </b-row>
              </b-col>
              <template v-if="results.orders.length === 0">
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
                            >VENTA TOTAL</b-col
                          >
                          <b-col sm="6">
                            ${{
                              parseFloat(results.totalOrder.total).toFixed(2)
                            }}</b-col
                          >
                        </b-row>
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >TOTAL PAGADO</b-col
                          >
                          <b-col sm="6">
                            ${{
                              parseFloat(
                                results.paymentsOrders.payment
                              ).toFixed(2)
                            }}</b-col
                          >
                        </b-row>
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >No. de Pedidos</b-col
                          >
                          <b-col sm="6">
                            {{ results.totalOrder.quantity }}</b-col
                          >
                        </b-row>
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >ITBMS Cobrado</b-col
                          >
                          <b-col sm="6">
                            ${{ parseFloat(itbmTotal).toFixed(2) }}</b-col
                          >
                        </b-row>
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >Descuentos</b-col
                          >
                          <b-col sm="6">
                            {{
                              parseFloat(results.totalOrder.discount).toFixed(2)
                            }}</b-col
                          >
                        </b-row>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="my-3">
                    <b-row
                      v-for="(payment, i) in results.paymentsMethodOrders"
                      :key="i"
                    >
                      <b-col sm="6" align-self="start">
                        <b-row>
                          <b-col
                            sm="6"
                            style="font-weight: bold; color: #0b0b0b"
                            >{{ payment.payment_method }}</b-col
                          >
                          <b-col sm="6">
                            ${{ parseFloat(payment.amount).toFixed(2) }}</b-col
                          >
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
                          :items="results.orders"
                          :filter="filter"
                          :fields="titles"
                          :sort-by.sync="sortBy"
                        >
                          <template v-slot:cell(payment_method)="results">
                            <label
                              v-for="(pay, i) in results.item.payments"
                              :key="i"
                              ><span v-if="pay.amount"
                                >{{ pay.payment_method }}
                              </span></label
                            >
                          </template>
                          <template v-slot:cell(itbm)="results">
                            {{ parseFloat(results.item.itbm).toFixed(2) }}
                          </template>
                          <template v-slot:cell(monto)="results">
                            {{
                              (
                                parseFloat(results.item.total) -
                                parseFloat(results.item.itbm.toFixed(2))
                              ).toFixed(2)
                            }}
                          </template>
                          <template v-slot:cell(saldo)="results">
                            {{
                              (
                                parseFloat(results.item.total) -
                                parseFloat(results.item.totalPaid)
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
    dateInit.setDate(dateInit.getDate())
    const formatDateInit = moment(String(dateInit)).format('YYYY-MM-DD')
    this.startDate = formatDateInit
    this.getData()
  },
  data () {
    return {
      titulos: {
        '#Orden': 'id',
        Cliente: 'client.name',
        'Tipo de compra': 'type',
        'Modo de Pago': 'payments',
        Monto: {
          callback: (item) => {
            return (parseFloat(item.total) - parseFloat(item.itbm)).toFixed(2)
          }
        },
        ITBMS: 'itbm',
        Total: 'total',
        Saldo: {
          callback: (item) => {
            return (parseFloat(item.total) - parseFloat(item.totalPaid)).toFixed(2)
          }
        }
      },
      startDate: '',
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
      itbmTotal: 0,
      titles: [
        { label: '#Orden', key: 'id', class: 'text-center', sortable: true },
        {
          label: 'Cliente',
          key: 'client.name',
          class: 'text-center',
          sortable: true
        },
        {
          label: 'Tipo de Compra.',
          key: 'type',
          class: 'text-center',
          sortable: true
        },
        {
          label: 'Modo de Pago',
          key: 'payment_method',
          class: 'text-center',
          sortable: true
        },
        { label: 'Monto', key: 'monto', class: 'text-center', sortable: true },
        { label: 'ITBMS', key: 'itbm', class: 'text-center', sortable: false },
        { label: 'Total', key: 'total', class: 'text-center', sortable: false },
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

      excelResults.orders = excelResults.orders.map(order => {
        order.payments = order.payments.reduce((acc, value) => {
          if (value.amount > 0) acc.push(value.payment_method)
          return acc
        }, []).join(', ')
        return order
      })

      return excelResults.orders
    }
  },
  methods: {
    exportPDF () {
      let params = `start_date=${this.startDate}`
      reportsService.getSalesJournalReportPdf(params)
    },
    getData () {
      // eslint-disable-next-line no-unused-vars
      let params = ''
      params = `start_date=${this.startDate}`
      reportsService
        .getSalesJournalReport(params)
        .then((response) => {
          this.results = response.data
          // console.log(this.results)
          this.itbmTotal = this.results.orders.reduce(
            (a, b) => a + parseFloat(b.itbm),
            0
          )
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
