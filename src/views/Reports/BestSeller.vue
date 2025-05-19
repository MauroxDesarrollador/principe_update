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
              <b-col md="4">Fecha inicial
                <b-form-input
                  v-model="initDate"
                  type="date"
                ></b-form-input>
              </b-col>
              <b-col md="4">Fecha final
                <b-form-input v-model="endDate" type="date"></b-form-input>
              </b-col>
              <b-col md="4">
                Categoria
                <b-form-select v-model="category" :options="[{
                  value: '',
                  text: 'Todos'
                }, {
                  value: 1,
                  text: 'Flores'
                }, {
                  value: 2,
                  text: 'Globos'
                },{
                  value: 3,
                  text: 'Escarcha'
                },{
                  value: 4,
                  text: 'Otros'
                }]"></b-form-select>

              </b-col>
              <b-col md="12" class="my-1" style="text-align: right">
                <b-row align-h="end" class="mb-2 mt-2">
                  <div class="col-md-6 text-right">
                    <b-button
                      style="margin-right: 5px"
                      variant="primary"
                      v-b-tooltip.top="'Buscar'"
                      @click="refresh"
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
                      worksheet="Productos más vendidos"
                      name="Productos más vendidos.xls"
                    >
                      <i class="ri-file-excel-2-line"></i>
                    </download-excel>
                  </div>
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
                    <template v-slot:cell(name)="results">
                      <label for="" class="text-capitalize">{{
                        results.item.name
                      }}</label>
                    </template>
                    <template v-slot:cell(created_at)="results">
                      {{ results.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(type)="results">
                      <b-badge
                        variant="success"
                        v-if="results.item.type === 'sale'"
                        >Venta</b-badge
                      >
                      <b-badge
                        variant="primary"
                        v-if="results.item.type === 'purchase'"
                        >Compra</b-badge
                      >
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
    <iq-card id="pie-chart-category-export" style="padding: 20px">
      <b-row>
        <b-col md="12" style="text-align:left">
            <b-button
            variant="primary"
            v-b-tooltip.top="'Descargar a PDF'"
            class="mx-2"
            @click="exportImage()"
          >
            <i class="ri-download-cloud-line"></i>
          </b-button>
        </b-col>
        <b-col md="12">
          <h5 class="text-center my-3">Gráficos del reporte</h5>
          <p class="text-muted text-center">
            Reporte de productos más vendidos
          </p>
        </b-col>
        <b-col md="12">
          <div style="width: 100%; height: 400px;">
            <Pie
              :chart-options="chartOptions"
              :chart-data="chartDataByCategory"
              :chart-id="'pie-chart-category'"
              
              :styles="styles"
            />
          </div>
        </b-col>
      
      </b-row>
    </iq-card>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import reportsService from '@/services/reports'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { Pie,Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js' 
import html2canvas from 'html2canvas';
ChartJS.register(Title, Tooltip, Legend, ArcElement)
export default {
  name: 'BestSeller',
  components: { Pie,Bar },
  created () {
    this.getData()
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      titulos: {
        Producto: 'name',
        Total: 'total'
      },
      filters: {
        type: '',
        products: [],
        initDate: '',
        endDate: '',
        category: ''
      },
      initDate:"",
      endDate:"",
      category: '',
      options: {
        type: [
          { value: '', text: 'Todos' },
          { value: 'sale', text: 'Venta' },
          { value: 'purchase', text: 'Compra' }
        ],
        products: [
          { value: '', text: 'Todos' }
        ]
      },
      results: [],
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      titles: [
        { label: 'Producto', key: 'name', class: 'text-center' },
        { label: 'Total', key: 'total', class: 'text-center' }
      ],
      chartDataByCategory: {
        labels: ["General"],
        datasets: [
          { 
            label: 'Reporte por categoría',
            data: [],
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
          }
        ]
      },
      chartDataByMode: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }
        ]
      },
      chartOptions: {
        plugins: {
           
          },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          }
        }
      }
    },
      cssClasses: '',
      styles: {
        width: '100%',
        height: '400px',
      },
      width: 800,
      height: 800
    }
  },
  computed: {
    rows () {
      return this.results.length
    }
  },
  methods: {
    refresh () {
       let params = '';
       params=`?initDate=${this.initDate}&endDate=${this.endDate}`
       if(this.category !== '') {
          params += `&category=${this.category}`
        }
      this.loading = true
      reportsService.getBestSellers(params)
          .then(response => {
            this.results = response.data
            this.updatePieCharts()
          })
          .catch(() => { })
          .finally(() => { this.loading = false })
    },
    updatePieCharts () {
      // Actualizar datos del gráfico por categoría
      const categories = this.results.map(item => ({
        name: item.name,
        total: item.total
      }));
      //sumatoria del total
      const totalSum = categories.reduce((acc, item) => parseFloat(acc) + parseFloat(item.total), 0);

      //calcular el porcentaje y unir al nombre
      this.chartDataByCategory.labels = categories.map(cat => cat.name+` (${((parseFloat(cat.total) / totalSum) * 100).toFixed(2)}%)`)
      this.chartDataByCategory.datasets[0].data = categories.map(cat => cat.total)

      // Actualizar datos del gráfico por tipo (ejemplo: venta/compra)
      const types = this.results.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + item.total
        return acc
      }, {})
      this.chartDataByMode.labels = Object.keys(types)
      this.chartDataByMode.datasets[0].data = Object.values(types)
    },
    exportPDF () {
      const doc = new JsPDF()
      let columns = [
        { title: 'Producto', dataKey: 'name' },
        { title: 'Total', dataKey: 'total' }
      ]
      doc.text('Best Sellers', 20, 20)
      doc.autoTable(columns, this.results, { margin: { top: 30 } })
      doc.save('Best Sellers.pdf')
    },
    getData () {
      let params = '';
      reportsService.getBestSellers(params)
        .then(response => {
          this.results = response.data
          this.updatePieCharts()
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    exportImage(){
      const element = document.getElementById('pie-chart-category-export');
      //image export
      //image
       if (!element) {
        console.error('Elemento no encontrado');
        return;
      }

      html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Productos mas vendidos.png'; // Nombre del archivo descargado
        link.href = canvas.toDataURL('image/png'); // Convierte el canvas a una URL de imagen
        link.click(); // Simula el clic para descargar la imagen
      }).catch(error => {
        console.error('Error al generar la imagen:', error);
      });
    }
  }
}
</script>
